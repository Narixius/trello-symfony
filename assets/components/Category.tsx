import * as React from "react";
import {Category as CategoryType} from '../types/Category'
import {useForm} from "@inertiajs/inertia-react";
import Input from "./Input";
import {useOnClickOutside} from "../hooks/useClickOutside";
import {useEffect, useRef, useState} from "react";
import {Board} from "../types/Board";
import {Editable} from "./Editable";
import {Inertia} from "@inertiajs/inertia";
import classNames from "classnames";

export const Category:React.FC<{category: CategoryType, board: Board}> = ({category, board}) => {
    const {data, setData, patch, errors} = useForm({title: '', board: board.id})
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
    useOnClickOutside(deleteRef, cancelDelete)
    useEffect((): any =>{
        if(!didMount.current) {
            didMount.current = true
        }else {
            patch('/category/' + category.id)
        }
    }, [data])
    return <div className="h-max rounded-md bg-white border border-mellow-darker px-4 py-2 text-sm min-w-[280px] text-gray-600 flex justify-start items-center">
        <div className="group flex overflow-x-hidden items-center w-full space-x-2">
            <Editable error={errors.title} value={category.title} onSubmit={onEditCategory} inputClasses="w-full flex-grow" textClasses="w-full py-1 font-bold flex-grow truncate" placeholder="Category title...">{category.title}</Editable>
            <button ref={deleteRef} onClick={handleDelete} className={
                classNames("transition-all bg-opacity-50 duration-200 transform translate-x-[45px] group-hover:translate-x-0 text-xs font-normal text-gray-400 hover:text-red-500 p-1 rounded-md", {
                    'flex-grow w-full bg-red-100 translate-x-0 text-red-500 border-red-500 border': deleting,
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