import * as React from 'react'
import classNames from "classnames";
import {Inertia} from "@inertiajs/inertia";
import {useOnClickOutside} from "../hooks/useClickOutside";
import {FC, useRef, useState} from "react";
import {Messages} from "../messages";

export default function Button({
        small= false,
        outline = false,
        danger=false,
       ...rest
      }) {
    return <button
        {...rest}
        className={classNames(rest.className,
            "transition rounded-md",
            {
                "text-xs py-1 font-normal": small,
                "py-2 font-medium": !small,
                "border border-gray-300 text-gray-400 bg-mellow": outline && !danger,
                "border border-red-300 text-red-400": outline && danger,
                "bg-primary hover:bg-primary-darker text-[#fff]": !outline && !danger,
                "bg-red-400 hover:bg-red-400 text-[#fff]": !outline && danger,
            })}
    />
}

export const DeleteButton:FC<{onDelete: any, translate?: boolean}> = ({onDelete, translate=true}) => {
    const [deleting, setDeleting] = useState(false)
    const deleteRef = useRef() as React.MutableRefObject<HTMLButtonElement>;
    const handleDelete = () => {
        if(!deleting){
            setDeleting(true)
        }else{
            onDelete()
        }
    }
    const cancelDelete = () => {
        if(deleting)
            setDeleting(false)
    }
    useOnClickOutside(deleteRef, cancelDelete)
    return <button ref={deleteRef} onClick={handleDelete} className={
        classNames("group-hover:h-auto group-hover:w-auto overflow-hidden transition bg-opacity-50 duration-200 text-xs font-normal text-gray-400 hover:text-red-500 rounded-md", {
            'flex-grow w-full bg-red-100 translate-x-0 text-red-500 border-red-500 border': deleting,
            // "group-hover:mr-0": !editing,
            "group-hover:mr-0 mr-[-45px] w-0 h-0 group-hover:p-1": translate,
            "p-1": !translate,
            'bg-mellow hover:bg-gray-200': !deleting
        })
    }>
        {
            !deleting ?
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                : Messages.trans("Are you sure?")
        }
    </button>
}