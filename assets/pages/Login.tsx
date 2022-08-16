import { Inertia } from '@inertiajs/inertia'
import * as React from 'react'
import Input from "../components/Input";
import Button from "../components/Button";
import Logo from "../components/Logo";
import {useEffect, useState} from "react";
import {Link} from "@inertiajs/inertia-react";


export default function Login(props:any) {
    const [loading, setLoading] = useState(false)
    useEffect(()=>{
        Inertia.on('start', (event) => {
            setLoading(true)
        })
        Inertia.on('finish', (event) => {
            setLoading(false)
        })
    })
    function handleSubmit(e:any) {
        e.preventDefault()
        Inertia.post('/login', {
            password: e.target.elements.password.value,
            username: e.target.elements.username.value
        })
    }
    return <div className="bg-[#FDFCFD] mx-auto max-w-[300px] mt-8 pb-5">
        <div className={"flex space-x-2 items-center  mt-1"}>
            <Logo className={"w-7 h-7"} />
            <h1 className={"text-2xl font-medium"}>Sign in</h1>
        </div>
        <form onSubmit={handleSubmit} className={"mt-8 flex flex-col  space-y-3"}>
            <Input autoComplete={"off"} placeholder={"Email"} name="username" />
            <Input placeholder={"Password"} name="password" type={"password"} />
            {props.error && <div className={"bg-red-200 border border-red-300 my-4 rounded px-2 py-2 text-gray-700"}>
                {props.error}
            </div>}
            <div>
                <Button disabled={loading} type={"submit"} className={"mt-2 w-full"}>{
                    loading ? "Loading..." : "Login"
                }</Button>
            </div>
        </form>
        <div className={"flex flex-col space-y-3 mt-8 text-[#848387] justify-center text-center"}>
            <span>Don't have an account?</span>
            <Link href={"/register"} className={"bg-white py-2 rounded-md border border-gray-200 font-medium hover:bg-[#fafafa] transition"}>Create new account</Link>
        </div>
    </div>
}