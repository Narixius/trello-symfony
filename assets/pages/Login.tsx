import { Inertia } from '@inertiajs/inertia'
import * as React from 'react'

export default function Login(props:any) {
    console.log(props)
    function handleSubmit(e:any) {
        e.preventDefault()
        Inertia.post('/login', {
            password: e.target.elements.password.value,
            username: e.target.elements.username.value
        }, {
            headers: {

            }
        })
    }
    return <form onSubmit={handleSubmit}>
        <input name="username" />
        <input name="password" type={"password"} />
        <button type={"submit"}>login</button>
    </form>
}