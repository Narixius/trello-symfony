import * as React from 'react'
import {useEffect, useRef, useState} from "react";
import {useOnClickOutside} from "../hooks/useClickOutside";
import Input from "./Input";
import classNames from "classnames";

export const Editable:React.FC<{
    textarea?: boolean,
    onSubmit: (value: string) => void,
    className?: string,
    error?: string,
    placeholder?: string,
    inputClasses?: string,
    textClasses?: string,
    children: React.ReactNode,
    value?: string,
    onEditing?: (editing:boolean) => void
}> = (props) => {
    const {
        textarea = false,
        className,
        error,
        placeholder,
        onSubmit,
        inputClasses,
        textClasses,
        children,
        onEditing,
        ...rest
    } = props

    const [editing, setEditing] = React.useState(false)
    const [value, setValue] = useState(rest.value || '')
    const ref = useRef() as React.MutableRefObject<HTMLFormElement>;

    const handleForm = (e?:any) => {
        if(e)
            e.preventDefault()
        onSubmit(value)
        cancelEditing()
    }
    const enableEditing = () => {
        if(onEditing)
            onEditing(true)
        setValue(rest.value || '')
        setEditing(true)
    }
    const cancelEditing = () => {
        setValue('')
        setEditing(false)
        if(onEditing)
            onEditing(false)
    }
    useOnClickOutside(ref, cancelEditing)
    useEffect(()=>{
        if(rest.value)
            setValue(rest.value)
    }, [rest.value])
    if(!editing)
        return <span onClick={enableEditing} className={classNames("block cursor-text w-full", textClasses)}>{children}</span>
    else
        return <form ref={ref} onSubmit={handleForm} className={classNames("w-full", className)}>
            {!textarea ? <Input error={error} small value={value} autoFocus
                    placeholder={placeholder}
                    onChange={e => setValue(e.target.value)}
                    className={classNames("", inputClasses)}/>
            : <textarea value={value} autoFocus
                        placeholder={placeholder}
                        onChange={e => setValue(e.target.value)}
                        className={classNames("", inputClasses)}
                        onKeyUp={e=>{
                            if(e.which === 13 && e.shiftKey){
                                handleForm()
                            }
                        }} />}
        </form>
}