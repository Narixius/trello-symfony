import { Inertia } from '@inertiajs/inertia'
import * as React from 'react'

export default function Login(props:any) {
    console.log(props)
    function handleSubmit(e:any) {
        e.preventDefault()
        Inertia.post('/register', {
            first_name: e.target.elements.first_name.value,
            last_name: e.target.elements.last_name.value,
            email: e.target.elements.email.value,
            password: e.target.elements.password.value
        })
    }
    return <form onSubmit={handleSubmit}>
        <input name="first_name" />
        <input name="last_name" />
        <input name="email" />
        <input name="password" type={"password"} />
        <button type={"submit"}>login</button>
    </form>
}