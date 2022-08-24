import * as React from "react";
import {Category as CategoryType} from "../types/Category";
import {Inertia} from "@inertiajs/inertia";
import {Editable} from "./Editable";
import {Card as CardType} from "../types/Card";
import {useSortable} from "@dnd-kit/sortable";
import {CSS} from "@dnd-kit/utilities";
import {animateLayoutChanges} from "./Category";


export const Card:React.FC<{card:CardType, category: CategoryType, overlay?: boolean}> = ({card, category, overlay = false}) => {
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
        <button ref={setNodeRef} {...listeners} {...attributes} style={style} className="text-gray-500 text-sm mb-2 text-left bg-gray-200 rounded-md px-2 py-1  w-full ">
            {card.title}
        </button>
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
