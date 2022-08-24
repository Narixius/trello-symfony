import * as React from "react";
import {Category as CategoryType} from '../types/Category'
import {useForm} from "@inertiajs/inertia-react";
import {useOnClickOutside} from "../hooks/useClickOutside";
import {useEffect, useRef, useState} from "react";
import {Board} from "../types/Board";
import {Editable} from "./Editable";
import {Inertia} from "@inertiajs/inertia";
import classNames from "classnames";
import {
    AnimateLayoutChanges, defaultAnimateLayoutChanges,
    SortableContext,
    useSortable, verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import {CSS} from '@dnd-kit/utilities';
import {Card as CardType} from "../types/Card";
import {AddCard, Card} from "./Card";

export const animateLayoutChanges: AnimateLayoutChanges = (args) =>
    defaultAnimateLayoutChanges({...args});


export const Category:React.FC<{category: CategoryType, board: Board, cards: CardType[]}> = ({category, board, cards}) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
        active
    } = useSortable({
        id: `category-${category.id}`,
        animateLayoutChanges
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        zIndex: isDragging || (active && cards.find(card => card.id === active.id)) ? 10 : 0,
        opacity: isDragging ? 0.3 : undefined,
        transition,
    };
    const {data, setData, patch, errors} = useForm({title: '', board: board.id})
    const [editing, setEditing] = useState(false)
    const [deleting, setDeleting] = useState(false)
    const deleteRef = useRef() as React.MutableRefObject<HTMLButtonElement>;
    const didMount = useRef(false);
    const onEditCategory = (value: string) => {
        setData('title', value)
    }
    const handleDelete = () => {
        if(!deleting){
            setDeleting(true)
        }else{
            Inertia.delete('/category/'+category.id)
        }
    }
    const cancelDelete = () => {
        if(deleting)
            setDeleting(false)
    }
    const handleEditingChanges = (editing:any) => {
        setEditing(editing)
    }
    useOnClickOutside(deleteRef, cancelDelete)
    useEffect((): any =>{
        if(!didMount.current) {
            didMount.current = true
        }else {
            patch('/category/' + category.id)
        }
    }, [data])
    return <div
        id={String(category.id)}
        ref={setNodeRef}>
        <div style={style}  ref={setNodeRef}
        className="flex-col relative h-max rounded-md bg-white border border-mellow-darker px-4 py-2 text-sm min-w-[280px] max-w-[280px] text-gray-600 flex justify-start items-center">
            <div className="mb-2 group flex overflow-x-hidden items-center w-full max-w-[280px] ">
                <button {...listeners}
                        {...attributes}
                        className={classNames("-ml-7 transition-all bg-opacity-50 bg-mellow rounded-md p-1 text-gray-400", {
                            "group-hover:ml-0 ": !editing
                    })}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                    </svg>
                </button>
                <Editable onEditing={handleEditingChanges} error={errors.title} value={category.title} onSubmit={onEditCategory} inputClasses="flex-grow" textClasses="w-full py-1 font-bold flex-grow truncate max-w-[245px]" placeholder="Category title...">{category.title}</Editable>
                <button ref={deleteRef} onClick={handleDelete} className={
                    classNames("transition-all bg-opacity-50 duration-200 mr-[-45px] text-xs font-normal text-gray-400 hover:text-red-500 p-1 rounded-md", {
                        'flex-grow w-full bg-red-100 translate-x-0 text-red-500 border-red-500 border': deleting,
                        "group-hover:mr-0": !editing,
                        'bg-mellow hover:bg-gray-200': !deleting
                    })
                }>
                    {
                        !deleting ?
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        : "Are you sure?"
                    }
                </button>
            </div>
            <CategoryBody board={board} category={category} cards={cards} />
        </div>
    </div>
}

export const AddCategory:React.FC<{board: Board}> = ({board}) => {
    const didMount = useRef(false);
    const {post, data, setData, errors, reset, isDirty} = useForm({
        title: '',
        board: board.id
    })
    const onSubmit = (value: string) => {
        setData('title', value)
    }
    useEffect((): any =>{
        if(!didMount.current) {
            didMount.current = true
        }else if(isDirty){
            post('/category/create')
            reset()
        }
    }, [data])
    return <div className="h-max rounded-md bg-white border border-mellow-darker px-4 py-2 text-sm min-w-[280px] text-gray-600 flex justify-start items-center">
        <Editable error={errors.title} value={data.title} onSubmit={onSubmit} inputClasses="w-full" textClasses="text-gray-400 flex items-center" placeholder="Category title...">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.4}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="block py-1">Add new category...</span>
        </Editable>
    </div>

}

export const CategoryBody:React.FC<{cards: CardType[], category: CategoryType, board:Board}> = ({category, board, cards
    }) => {
    cards = Array.isArray(cards) ? cards.filter(c => c) : []
    return(
        <SortableContext strategy={verticalListSortingStrategy} items={cards.filter(c => c).map(c=>c.id)}>
            <div className="flex justify-start items-center text-gray-500 flex-col w-full">
                <div className="w-full flex flex-col">
                    {
                        cards.map((card)=>{
                            return <Card card={card} category={category} key={card.id} />
                        })
                    }
                </div>
                <AddCard category={category} />
            </div>
        </SortableContext>
    )
}
