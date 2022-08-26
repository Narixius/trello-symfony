import * as React from 'react'
import Logo from "../components/Logo";
import {Container} from "../components/Container";
import {Board} from "../types/Board";
import {User} from "../types/User";
import {Navbar} from "../components/Navbar";
import {Errors} from "../types/Error";
import {AddCategory, Category} from "../components/Category";
import {
    closestCenter,
    CollisionDetection, defaultDropAnimationSideEffects,
    DndContext, DragOverlay, DropAnimation, getFirstCollision, MeasuringStrategy, MouseSensor, PointerSensor,
    pointerWithin, rectIntersection, TouchSensor,
    UniqueIdentifier, useSensor, useSensors,
} from '@dnd-kit/core';
import {horizontalListSortingStrategy, SortableContext, arrayMove} from '@dnd-kit/sortable';
import {useCallback, useEffect, useRef, useState} from "react";
import {Category as CategoryType} from '../types/Category'
import {Card as CardType} from "../types/Card";
import {createPortal} from "react-dom";
import {Card} from "../components/Card";
import {Inertia} from "@inertiajs/inertia";
import Button from "../components/Button";
import {ManageBoard} from "../components/ManageBoard";
import {Messages} from "../messages";

const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: {
            active: {
                opacity: '0.5',
            },
        },
    }),
};

const initializeCategories = (categories: any):CategoryType[] => {
    return !Array.isArray(categories) ? [] : categories.sort((c1,c2)=>c1.orderNumber - c2.orderNumber)
}

const initializeItems = (categories:CategoryType[]) => {
    return Object.fromEntries(
        categories.map((category) => {
            return [`category-${category.id}`, generateCardItems(category.cards)]
        })
    )
}

export const generateCardItems = (cards: CardType[]) => {
    if(!Array.isArray(cards))
        cards = []
    return cards.sort((c1, c2)=>c1.orderNumber - c2.orderNumber)
}

let dumpCats:CategoryType[] = [];


export default function Dashboard(props:{
    board: Board,
    user: User,
    errors: Errors,
    messages: Record<string, string>,
    locale: string
}) {
    Messages.setMessages(props.messages)
    Messages.setLocale(props.locale)
    const {board, user} = props
    const [categories, setCategories] = useState(initializeCategories(board.categories))
    const [items, setItems] = useState(initializeItems(categories))
    const [isManageBoardOpen, setOpenManageBoard] = useState(false)
    const openManageBoard = () => {
        setOpenManageBoard(true)
    }
    const closeManageBoard = () => {
        setOpenManageBoard(false)
    }
    useEffect(()=>{
        setItems(initializeItems(categories))
    }, [categories])
    useEffect(()=>{
        dumpCats = JSON.parse(JSON.stringify(board.categories))
        setCategories(initializeCategories(board.categories))
    }, [board.categories])

    const saveChanges = (categories: CategoryType[], newItems: typeof items = items) => {
        categories = categories.filter((cat) => {
            return cat.orderNumber !== dumpCats.find(c=>c.id == cat.id)!.orderNumber
        })
        const cards = Object.keys(newItems).map(key=>{
            return newItems[key].filter(card => {
                const lastCat = dumpCats[dumpCats.findIndex(cat => containerIncludes(cat.cards, card.id))]
                const lastOrderNumber = lastCat.cards.find(c => c.id == card.id)!.orderNumber
                const newCat = findCategory(findContainer(String(card.id)));
                card.category = newCat.id;
                return newCat.id !== lastCat.id || card.orderNumber !== lastOrderNumber;
            })
        }).flat()
        if(cards.length > 0 || categories.length > 0)
            Inertia.patch(Messages.locale + '/board/'+board.id+'/reorder', {
                cards: cards.map(card => `${card.id}-${card.category}-${card.orderNumber}`),
                categories: categories.map(cat => `${cat.id}-${cat.orderNumber}`)
            });
    }

    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const lastOverId = useRef<UniqueIdentifier | null>(null);
    const recentlyMovedToNewContainer = useRef(false);
    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 10
            }
        }),
        useSensor(MouseSensor),
        useSensor(TouchSensor),
    );
    const [clonedItems, setClonedItems] = useState<typeof items | null>(null);
    const containerIncludes = (cards: CardType[], id: any) => {
        if(!Array.isArray(cards))
            cards = []
        return cards.find((card) => {
            if(!card)
                return false
            return card.id == id
        });
    }
    const findCategory = (id:string) => {
        return board.categories.find(category => String(category.id) == id.split("-")[1])!
    }
    const findContainer = (id: string):string => {
        if (id in items) {
            return id;
        }
        return Object.keys(items).find((key) => {
            return items[key].find(card => String(card.id) == id)
        })!;
    };
    const onDragCancel = () => {
        if (clonedItems) {
            setItems(clonedItems);
        }

        setActiveId(null);
        setClonedItems(null);
    };
    const collisionDetectionStrategy: CollisionDetection = useCallback(
        (args) => {
            if (activeId && activeId in items) {
                return closestCenter({
                    ...args,
                    droppableContainers: args.droppableContainers.filter(
                        (container) => container.id in items
                    ),
                });
            }
            const pointerIntersections = pointerWithin(args);
            const intersections =
                pointerIntersections.length > 0 ?
                    pointerIntersections
                    : rectIntersection(args);

            let overId = getFirstCollision(intersections, 'id');

            if (overId != null) {
                if (overId in items) {
                    const containerItems = items[overId];
                    if (containerItems.length > 0) {
                        overId = closestCenter({
                            ...args,
                            droppableContainers: args.droppableContainers.filter(
                                (container) =>
                                    container.id !== overId &&
                                    containerIncludes(containerItems, (Number(container.id)))
                            ),
                        })[0]?.id;
                    }
                }

                lastOverId.current = overId;

                return [{id: overId}];
            }
            if (recentlyMovedToNewContainer.current) {
                lastOverId.current = activeId;
            }
            return lastOverId.current ? [{id: lastOverId.current}] : [];
        },
        [activeId, items]
    );

    return (
          <Container className="pt-4 min-h-screen flex flex-col">
              <Navbar user={user} />
              <div className={"flex space-x-2 items-center  mt-1"}>
                  <Logo className={"w-7 h-7 z-10 relative"} />
                  <h1 className={"text-2xl font-medium z-10 relative"}>{board.title}</h1>
                  {
                      user.id == board.createdBy.id && (
                          <div className="z-10 relative">
                              <button onClick={openManageBoard} className="transition border border-gray-400 text-gray-500 px-2 py-1 text-sm rounded-md ml-6 hover:bg-gray-100 hover:text-gray-700">{Messages.trans("Manage Board")}</button>
                          </div>
                      )
                  }
                  { isManageBoardOpen &&
                      createPortal(
                          <ManageBoard board={board} onClose={closeManageBoard} currentUser={user}/>,
                          document.body
                      )
                  }
              </div>
              <div className="flex space-x-4 flex-nowrap mt-8 overflow-x-auto flex-grow">
                  <DndContext
                      sensors={sensors}
                      collisionDetection={collisionDetectionStrategy}
                      measuring={{
                          droppable: {
                              strategy: MeasuringStrategy.Always,
                          },
                      }}
                      onDragCancel={onDragCancel}
                      onDragStart={({active}:any) => {
                          setActiveId(active.id);
                          setClonedItems(items);
                      }}
                      onDragEnd={({active, over}:any) => {
                          let newCategories = categories;
                          let newItems = undefined;
                          if (active.id in items && over?.id) {
                              setCategories((categories) => {
                                  const activeIndex = categories.findIndex(category => String(category.id) == String(active.id).replace("category-", ""));
                                  const overIndex = categories.findIndex(category => String(category.id) == String(over.id).replace("category-", ""));
                                  newCategories = arrayMove(categories, activeIndex, overIndex);
                                  newCategories.forEach((cat, i) => {
                                      cat.orderNumber = ++i
                                  });
                                  return newCategories;
                              });
                          }
                          const activeContainer = findContainer(active.id);
                          if (!activeContainer) {
                              setActiveId(null);
                              saveChanges(newCategories)
                              return;
                          }
                          const overId = over?.id;
                          if (overId == null) {
                              setActiveId(null);
                              saveChanges(newCategories)
                              return;
                          }
                          const overContainer = findContainer(overId);
                          if (overContainer) {
                              const activeIndex = items[activeContainer].findIndex(card => card.id == active.id);
                              const overIndex = items[overContainer].findIndex(card => card.id == overId);

                              if (activeIndex !== overIndex) {
                                  newItems = ({
                                      ...items,
                                      [overContainer]: arrayMove(
                                          items[overContainer],
                                          activeIndex,
                                          overIndex
                                      ).map((card, i)=>{
                                          card.orderNumber = ++i;
                                          return card
                                      }),
                                  })
                                  setItems(newItems);
                              }
                          }

                          saveChanges(newCategories, newItems)
                          setActiveId(null);
                      }}
                      onDragOver={({active, over}:any) => {
                          const overId = over?.id;
                          if (overId == null || active.id in items) {
                              return;
                          }
                          const overContainer = findContainer(overId);
                          const activeContainer = findContainer(active.id);
                          if (!overContainer || !activeContainer) {
                              return;
                          }
                          if (activeContainer !== overContainer) {
                              setItems((items) => {
                                  const activeItems = items[activeContainer];
                                  const overItems = items[overContainer];
                                  const overIndex = overItems.findIndex(card => card.id == overId);
                                  const activeIndex = activeItems.findIndex(card => card.id == active.id);

                                  let newIndex: number;

                                  if (overId in items) {
                                      newIndex = overItems.length + 1;
                                  } else {
                                      const isBelowOverItem =
                                          over &&
                                          active.rect.current.translated &&
                                          active.rect.current.translated.top >
                                          over.rect.top + over.rect.height;

                                      const modifier = isBelowOverItem ? 1 : 0;

                                      newIndex =
                                          overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
                                  }
                                  recentlyMovedToNewContainer.current = true;
                                  items[activeContainer][activeIndex].orderNumber = newIndex + 1;
                                  return {
                                      ...items,
                                      [activeContainer]: items[activeContainer].filter(
                                          (item) => item.id !== active.id
                                      ).map((card, i)=>{
                                          card.orderNumber = ++i;
                                          return card
                                      }),
                                      [overContainer]: [
                                          ...items[overContainer].slice(0, newIndex).map((card, i)=>{
                                              card.orderNumber = ++i;
                                              return card;
                                          }),
                                          items[activeContainer][activeIndex],
                                          ...items[overContainer].slice(
                                              newIndex,
                                              items[overContainer].length
                                          ).map((card, i)=>{
                                              card.orderNumber = ++i + newIndex + 1;
                                              return card;
                                          }),
                                      ],
                                  };
                              });
                          }
                      }}>
                      <SortableContext strategy={horizontalListSortingStrategy} items={Object.keys(items)}>
                          {
                              categories.map((category)=>{
                                  const categoryKey ='category-'+category.id
                                  return <Category key={categoryKey} category={category} board={board} cards={items[categoryKey]} user={user} />
                              })
                          }
                      </SortableContext>
                      {createPortal(
                          <DragOverlay dropAnimation={dropAnimation}>
                              {activeId
                                  ? activeId in items
                                      ? <Category key={activeId} category={findCategory(String(activeId))} board={board} cards={items[activeId]} user={user} />
                                      : <Card overlay card={items[findContainer(String(activeId))].find(card => card.id == activeId)!} category={findCategory(findContainer(String(activeId)))} key={activeId} />
                                  : null}
                          </DragOverlay>,
                          document.body
                      )}
                    </DndContext>
                  <AddCategory board={board} />
              </div>
          </Container>
       )
}

