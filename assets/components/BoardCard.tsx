import * as React from 'react';
import {PropsWithChildren, useEffect} from "react";
import {Board} from "../types/Board";
import Input, {ColorPicker} from "./Input";
import Button from "./Button";
import * as dayjs from 'dayjs'
import * as relativeTime from 'dayjs/plugin/relativeTime'
import {useOnClickOutside} from "../hooks/useClickOutside";
import { useForm } from '@inertiajs/inertia-react'
import classNames from "classnames";
import {Inertia} from "@inertiajs/inertia";

dayjs.extend(relativeTime)

export const BoardCard:React.FC<PropsWithChildren<{
    board: Board
}>> = ({board}) => {
    const [deleting, setDeleting] = React.useState(false);
    const deleteRef = React.useRef() as React.MutableRefObject<HTMLDivElement>;
    const [editing, setEditing] = React.useState(false);
    const {patch, data, setData, processing, errors, reset} = useForm({
        title: '',
        color: ''
    });
    const editRef = React.useRef() as React.MutableRefObject<HTMLDivElement>;
    const handleDelete = (e?:any) => {
        if(e) {
            e.preventDefault()
            e.stopPropagation()
        }
        setDeleting(true)
    }
    const cancelDelete = (e?:any) => {
        if(e) {
            e.preventDefault()
            e.stopPropagation()
        }
        setDeleting(false)
    }
    const deleteBoard = (e?:any) => {
        if(e) {
            e.preventDefault()
            e.stopPropagation()
        }
        Inertia.delete('/board/'+board.id)
    }
    const handleEditing = (e?:any) => {
        if(e) {
            e.preventDefault()
            e.stopPropagation()
        }
        setData({
            title: board.title,
            color: board.color || ""
        })
        setEditing(true)
    }
    const cancelEditing = () => {
        reset()
        setEditing(false)
    }
    const editBoard = (e: any) => {
        e.preventDefault();
        patch('/board/'+board.id)
    }

    useEffect(()=>{
        if(!processing && (!errors || Object.keys(errors).length === 0)){
            cancelEditing()
        }
    }, [
        processing, errors
    ])
    useOnClickOutside(deleteRef, cancelDelete)
    useOnClickOutside(editRef, cancelEditing)

    return <div style={{
        backgroundColor: board.color,
    }} className="group flex justify-between flex-col p-4 w-full h-[130px] border border-smooth bg-mellow hover:bg-mellow-darker
            hover:text-gray-700 rounded-md text-gray-700 font-medium cursor-pointer hover:border-[#E6E6E7] transition overflow-hidden">
        {!editing ? <><div className="flex justify-between relative overflow-hidden">
            <span className="truncate w-full block">{board.title}</span>
            <button onClick={handleDelete} className="bg-opacity-50 bg-mellow transition transform translate-x-full group-hover:translate-x-0 text-gray-400 hover:text-red-500 hover:bg-gray-200 p-1 rounded-md">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            </button>
        </div>
        <div className="max-h-[40px]" ref={deleteRef}>
            <div className={classNames("flex justify-between overflow-hidden", {
                "opacity-0" : deleting,
            })}>
                <span className={classNames("text-black text-opacity-40 font-normal text-sm transition mt-[20px] block")}>
                    {dayjs().from(dayjs(board.updatedAt))}
                </span>
                <button onClick={handleEditing} className="bg-opacity-50 bg-mellow mt-[15px] transition transform translate-x-full group-hover:translate-x-0 text-gray-400 hover:text-gray-600 hover:bg-gray-200 p-1 rounded-md">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                </button>
            </div>
            <div className={classNames("transition transform flex space-x-2",{
                "translate-y-[-28px]" : deleting,
                "translate-y-[100px]": !deleting
            })}>
                <Button outline small className="w-full" onClick={cancelDelete}>Cancel</Button>
                <Button danger small className="w-full" onClick={deleteBoard}>Delete</Button>
            </div>
        </div>
        </>
        :   <div onClick={e=>{
                console.log('asdf')
                e.preventDefault()
                }
            }>
                <BoardCardForm
                    title={"Create new board"}
                    formRef={editRef}
                    onSubmit={editBoard}
                    onCancel={cancelEditing}
                    errors={errors}
                    data={data}
                    setData={setData}
                    processing={processing}
                    loadingMessage={"Saving..."}
                    submitMessage={"Save"} />
            </div>
        }
    </div>
}

export const AddBoardCard:React.FC = () => {
    const [clicked, setClicked] = React.useState(false);
    const formRef = React.useRef() as React.MutableRefObject<HTMLFormElement>;
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        color: '#F8F7F8'
    })
    const handleClick = () => {
        setClicked(true);
    }
    const createBoard = (e:any) => {
        e.preventDefault();
        post('/board/create')
    }
    const back = (e:any) => {
        if(e){
            e.stopPropagation()
        }
        setClicked(false)
    }
    useEffect(()=>{
        if(!processing && (!errors || Object.keys(errors).length === 0)){
            back(null);
            reset()
        }
    }, [
        processing, errors
    ])
    useOnClickOutside(formRef, back)

    return <div className={classNames("flex justify-center items-center space-x-2 w-full min-h-[130px] py-3 border border-smooth  " +
        "hover:text-gray-500 rounded-md text-gray-400 cursor-pointer hover:border-[#E6E6E7] transition transform", {
        'bg-white' : clicked,
        'bg-mellow hover:bg-mellow-darker' : !clicked
    })} onClick={handleClick}>
        {!clicked ? (<>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Add new board</span>
        </>) : (
            <div className="px-4 w-full">
                <BoardCardForm
                    title={"Create new board"}
                    formRef={formRef}
                    onSubmit={createBoard}
                    onCancel={back}
                    errors={errors}
                    data={data}
                    setData={setData}
                    processing={processing}
                    loadingMessage={"Creating..."}
                    submitMessage={"Create"}
                />
            </div>
        )}
    </div>
}

const BoardCardForm:React.FC<any> = ({
    title,
    formRef,
    onSubmit,
    onCancel,
    errors,
    data,
    setData,
    processing,
    submitMessage,
    loadingMessage,
    }) => {
    return <form ref={formRef} onSubmit={onSubmit} className="flex flex-col justify-center items-center space-y-2 w-full h-full
            hover:text-gray-500 rounded-md text-gray-400 cursor-pointer hover:border-[#E6E6E7] transition">
        <div className="block text-left text-sm w-full text-gray-600 flex justify-start items-center space-x-2">
            <button type={"button"} className="transition hover:bg-mellow rounded-sm text-gray-500 hover:text-gray-600" onClick={onCancel}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
                </svg>
            </button>
            <span>{title}</span>
        </div>
        <Input error={errors.title} onClick={
            // @ts-ignore
            e=>e.target.focus()
        } small name={"title"} placeholder={"Title"} value={data.title} onChange={(e:any) => setData('title', e.target.value)} />
        <div className="flex space-x-2 w-full">
            <ColorPicker colors={[
                '#F8F7F8',
                '#C0DEFF',
                '#D6C0FF',
                '#FFC0EF',
                '#FFBFBF',
                '#FFE6BF',
                '#E9FFBF'
            ]} color={data.color} onChange={(color) => setData('color', color)} />
            <Button small onClick={onSubmit} className={"px-6"} disabled={processing}>{processing ? loadingMessage : submitMessage}</Button>
        </div>
    </form>
}