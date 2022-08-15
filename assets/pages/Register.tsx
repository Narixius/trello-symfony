import { Inertia } from '@inertiajs/inertia'
import * as React from 'react'
import Logo from "../components/Logo";
import Input from "../components/Input";
import Button from "../components/Button";
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
    const errors:any = {};
    if(props.errors){
       if(props.errors.violations.length > 0){
           props.errors.violations.map((err:{propertyPath: string, title: string}) => {
               errors[err.propertyPath] = err.title;
           })
       }
    }
    function handleSubmit(e:any) {
        e.preventDefault()
        Inertia.post('/register', {
            first_name: e.target.elements.first_name.value,
            last_name: e.target.elements.last_name.value,
            email: e.target.elements.email.value,
            password: e.target.elements.password.value
        })
    }
    return <div className="bg-[#FDFCFD] mx-auto max-w-[300px] mt-10 pb-5">
        <div className={"flex space-x-2 items-center  mt-4"}>
            <Logo className={"w-7 h-7"} />
            <h1 className={"text-2xl font-medium"}>Registration</h1>
        </div>
        <form onSubmit={handleSubmit} className={"mt-6 flex flex-col  space-y-3"}>
            <Input placeholder={"First name"} name="first_name" error={errors.first_name} />
            <Input placeholder={"Last name"} name="last_name" error={errors.last_name} />
            <Input placeholder={"Email"} name="email" error={errors.email} />
            <Input placeholder={"Password"} name="password" type={"password"} error={errors.password} />
            {props.error && <div className={"bg-red-200 border border-red-300 my-4 rounded px-2 py-2 text-gray-700"}>
                {props.error}
            </div>}
            <div>
                <Button disabled={loading} type={"submit"} className={"mt-2 w-full"}>{
                    loading ? "Loading..." : "Register"
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