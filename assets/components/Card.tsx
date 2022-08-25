import * as React from "react";
import {Category as CategoryType} from "../types/Category";
import {Inertia} from "@inertiajs/inertia";
import {Editable} from "./Editable";
import {Card as CardType} from "../types/Card";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {animateLayoutChanges} from "./Category";
import * as dayjs from "dayjs";
import {useEffect, useRef, useState} from "react";
import {Dayjs} from "dayjs";
import {useForm} from "@inertiajs/inertia-react";
import {Board} from "../types/Board";
import classNames from "classnames";
import {DeleteButton} from "./Button";
import {User} from "../types/User";
import {COLORS} from "./BoardCard";


export const Card:React.FC<{card:CardType, category: CategoryType, overlay?: boolean, onClick?: any}> = ({card, category, overlay = false, onClick}) => {
    const {
        setNodeRef,
        listeners,
        isDragging,
        attributes,
        transform,
        active,
    } = useSortable({
        id: card ? card.id : 0,
        animateLayoutChanges
    });
    if(!card)
        return null
    const style = {
        transform: CSS.Transform.toString(transform),
        zIndex: isDragging ? 10 : 0,
        opacity: isDragging ? 0.3 : undefined,
        transition: active ? active.id !== card.id ? '200ms ease all' : undefined : undefined,
        boxShadow: overlay ? '0 0 0 1px rgba(63, 63, 68, 0.05), -1px 0 15px 0 rgba(34, 33, 81, 0.01), 0px 10px 15px 0 rgba(0, 0, 0, 0.2)' : undefined
    };

    return (
        <div onClick={onClick}>
            <button ref={setNodeRef} {...listeners} {...attributes} style={style} className="text-gray-600 text-sm mb-2 text-left bg-gray-200 rounded-sm px-2 py-2 w-full ">
                {card.title}
            </button>
        </div>
    )
}


export const AddCard:React.FC<{category: CategoryType}> = ({category}) => {
    const createCard = (title:string) => {
        Inertia.post('/card/create', {
            title,
            category: category.id
        })
    }
    return <Editable value={''} onSubmit={createCard} inputClasses="w-full" textClasses="w-full flex justify-start items-center text-gray-500 hover:text-gray-600 hover:bg-gray-100 w-full text-sm space-x-2 transition px-2 py-1 rounded-md">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
            <path fillRule="evenodd" d="M10.75 2.75a.75.75 0 00-1.5 0v6.5h-6.5a.75.75 0 000 1.5h6.5v6.5a.75.75 0 001.5 0v-6.5h6.5a.75.75 0 000-1.5h-6.5v-6.5z" clipRule="evenodd" />
        </svg>
        <span>Add a card...</span>
    </Editable>
}

export const CardEdit:React.FC<{card:CardType, onClose: any,  board:Board, user:User}> = ({card, onClose, board,user}) => {
    const datepickerRef = useRef() as React.MutableRefObject<HTMLInputElement>;
    const [dueDate, setDueDate] = useState<Dayjs | undefined>(card.dueDate ? dayjs(card.dueDate) : undefined)
    const handleDateChange = (e:any) => {
        setDueDate(e.target.value.length ? dayjs(e.target.value) : undefined)
    }
    const submitChanges = (key:string) => (value?:string | number[]) => {
        if(value)
            Inertia.patch("/card/"+card.id, {
                [key]: value!
            })
    }
    const addComment = (text:string) => {
        if(text && text.length)
            Inertia.post("/comment/create", {
                text,
                card: card.id
            })
    }
    const addLabel = (title:string) => {
        if(title && title.length) {
            Inertia.post("/label/create", {
                title,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                board: board.id,
                card: card.id
            })
        }
    }
    const deleteComment = (commentId:number) => {
        Inertia.delete("/comment/"+commentId)
    }
    const deleteLabel = (labelId:number) => {
        Inertia.delete("/label/"+labelId)
    }

    if(!Array.isArray(card.comments))
        card.comments = []
    if(!Array.isArray(card.labels))
        card.labels = []
    if(!Array.isArray(board.labels))
        board.labels = []

    card.comments.sort((c1, c2) => {
        return dayjs(c1.createdAt).toDate().getTime() - dayjs(c2.createdAt).toDate().getTime()
    })
    useEffect(()=>{
        if(card && card.dueDate)
            setDueDate(dayjs(card.dueDate))
    }, [card])
    return <div className="z-20 absolute top-0 left-0 bg-black bg-opacity-30 w-full h-full px-2 py-2" onClick={onClose}>
        <div className="rounded-md max-w-2xl w-full bg-mellow mx-auto p-4 mt-16" onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between items-center">
                <Editable value={card.title} onSubmit={submitChanges('title')}>
                    <span className="font-bold">{card.title}</span>
                </Editable>
                <button onClick={onClose} className="hover:bg-mellow-darker rounded-md transition text-gray-400 hover:text-gray-500 p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m-15 0l15 15" />
                    </svg>
                </button>
            </div>
            <div className="text-gray-500 text-xs mb-4">
                <span>Last updated {dayjs().from(dayjs(card.updatedAt))}, created by {card.createdBy.firstName + " " + card.createdBy.lastName}, {dayjs().from(dayjs(card.createdAt))}</span>
            </div>
            <div className="grid grid-cols-4 mt-8 gap-4">
                <div className="col-span-3">
                    <div className="mb-3">
                        <span className="text-gray-500 text-sm mb-2 block">Description</span>
                        <Editable textarea inputClasses={"w-full p-2 text-sm"} value={card.description} onSubmit={submitChanges('description')} textClasses={"min-h-[30px] text-sm text-gray-700"}>
                            <p className="whitespace-pre-wrap">{(!card.description || card.description.length === 0) ? "Click to add description..." : card.description}</p>
                        </Editable>
                    </div>
                    <div className="mb-3 mt-8">
                        <span className="text-gray-500 text-sm mb-2 block">Comments</span>
                        <div className="flex flex-col space-y-2">
                            {
                                card.comments.map((comment)=>{
                                    return <div className="group bg-gray-200 rounded-md w-full text-sm px-2 py-1 pr-1 flex relative overflow-x-hidden" key={comment.id}>

                                        <div className="flex-grow mr-2">
                                            <span className="block text-gray-500 text-xs">{comment.createdBy.firstName + " " + comment.createdBy.lastName}</span>
                                            <span className="text-gray-700">{comment.text}</span>
                                        </div>
                                        {
                                            comment.createdBy.id === user.id && (
                                                <div>
                                                    <DeleteButton onDelete={deleteComment.bind(null, comment.id)} />
                                                </div>
                                            )
                                        }
                                    </div>
                                })
                            }
                        </div>
                       <div className="mt-5 pl-1">
                           <Editable inputClasses={"w-full p-2 text-sm"} value={""} onSubmit={addComment} textClasses={"min-h-[30px] text-sm text-gray-700"}>
                               <p className="whitespace-pre-wrap text-gray-400">Click to add comment...</p>
                           </Editable>
                       </div>
                    </div>
                </div>
                <div className="col-span-1">
                    <span className="text-gray-500 text-sm mb-2 block">Options</span>
                    <div className="flex flex-col space-y-2">
                        <div className="relative">
                            <button onClick={
                                () => {
                                    datepickerRef.current.focus()
                                    // @ts-ignore
                                    datepickerRef.current.showPicker()
                                }
                            } className="relative z-[2] bg-gray-200 px-2 py-1 w-full text-left text-gray-700 rounded-sm text-sm">
                                <span className="block">Due Date</span>
                                {dueDate && <span className="font-medium">{dueDate.format("YYYY-MM-DD hh:mm")}</span> }
                            </button>
                            <input onBlur={()=>submitChanges('dueDate')(dayjs(dueDate).toISOString())} className="focus:outline-none h-[20px] left-0 bottom-[2px] absolute z-[1] w-1" ref={datepickerRef} type={"datetime-local"} onChange={handleDateChange} />
                        </div>

                        <div className="relative">
                            <div className="relative z-[2] bg-gray-200 px-2 py-1 w-full text-left text-gray-700 rounded-sm text-sm">
                                <span className="block mb-1">Labels</span>
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {
                                        board.labels.map((label) => {
                                            const isChecked = card.labels.find(l => l.id === label.id);
                                            return <span key={label.id} style={{
                                                backgroundColor: label.color,
                                                opacity: isChecked? 1 : 0.2
                                            }} className="text-xs px-1 rounded-sm w-full flex justify-between"
                                             onClick={() => {
                                                 if(!isChecked)
                                                     submitChanges('labels')([...card.labels.map(a=>a.id), label.id])
                                                 else
                                                     submitChanges('labels')([...card.labels.filter(a=>a.id !== label.id).map(a=>a.id)])
                                             }}
                                            >
                                                <span>{label.title}</span>
                                                <button onClick={() => deleteLabel(label.id)}>
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                                                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m-15 0l15 15" />
                                                    </svg>
                                                </button>
                                            </span>
                                        })
                                    }
                                </div>
                                <Editable value={""} onSubmit={addLabel} placeholder="Label name" textClasses="text-sm text-gray-400">
                                    <span>Click to add label</span>
                                </Editable>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="relative z-[2] bg-gray-200 px-2 py-1 w-full text-left text-gray-700 rounded-sm text-sm">
                                <span className="block mb-1">Assignees</span>
                                {
                                    board.members.map(user => {
                                        if(!Array.isArray(card.assignees))
                                            card.assignees = []
                                        const isChecked = card.assignees.find(u => u.id === user.id)
                                        return <button key={user.id}
                                                       onClick={() => {
                                                           if(!isChecked)
                                                                submitChanges('assignees')([...card.assignees.map(a=>a.id), user.id])
                                                            else
                                                               submitChanges('assignees')([...card.assignees.filter(a=>a.id !== user.id).map(a=>a.id)])
                                                       }}
                                                       className={ classNames('rounded-sm p-1 text-xs py-0',
                                                        {
                                                            'border border-gray-600 bg-gray-300 text-gray-700': isChecked,
                                                            'border border-gray-400 text-gray-400': !isChecked
                                                        }
                                            )}>{user.firstName + " " + user.lastName}</button>
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
}