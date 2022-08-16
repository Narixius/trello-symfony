import { Inertia } from '@inertiajs/inertia'
import * as React from 'react'
import Logo from "../components/Logo";
import Input from "../components/Input";
import Button from "../components/Button";
import {useEffect, useState} from "react";
import {Link, useForm} from "@inertiajs/inertia-react";

export default function Login(props:any) {
    const {post, data, setData, processing, errors} = useForm({
        first_name: "",
        last_name: "",
        email: "",
        password: ""
    })
    function handleSubmit(e:any) {
        e.preventDefault()
        post('/register')
    }
    return <div className="bg-[#FDFCFD] mx-auto max-w-[300px] mt-8 pb-5">
        <div className={"flex space-x-2 items-center  mt-1"}>
            <Logo className={"w-7 h-7"} />
            <h1 className={"text-2xl font-medium"}>Registration</h1>
        </div>
        <form onSubmit={handleSubmit} className={"mt-8 flex flex-col  space-y-3"}>
            <Input onChange={(e:any)=>setData('first_name', e.target.value)} value={data.first_name} autoComplete={"off"} placeholder={"First name"} name="first_name" error={errors.first_name} />
            <Input onChange={(e:any)=>setData('last_name', e.target.value)} value={data.last_name} autoComplete={"off"} placeholder={"Last name"} name="last_name" error={errors.last_name} />
            <Input onChange={(e:any)=>setData('email', e.target.value)} value={data.email} autoComplete={"off"} placeholder={"Email"} name="email" error={errors.email} />
            <Input onChange={(e:any)=>setData('password', e.target.value)} value={data.password} placeholder={"Password"} name="password" type={"password"} error={errors.password} />
            {props.error && <div className={"bg-red-200 border border-red-300 my-4 rounded px-2 py-2 text-gray-700"}>
                {props.error}
            </div>}
            <div>
                <Button disabled={processing} type={"submit"} className={"mt-2 w-full"}>{
                    processing ? "Loading..." : "Register"
                }</Button>
            </div>
        </form>
        <div className={"flex flex-col space-y-3 mt-8 text-[#848387] justify-center text-center"}>
            <span>Already have an account?</span>
            <Link href={"/login"}
                  headers={{
                      'Content-Type': ''
                  }}
                  className={"bg-white py-2 rounded-md border border-gray-200 font-medium hover:bg-[#fafafa] transition"}>Sign in</Link>
        </div>
    </div>
}