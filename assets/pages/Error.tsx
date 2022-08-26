import * as React from 'react';
import {Container} from "../components/Container";
import {Link} from "@inertiajs/inertia-react";
import {Messages} from "../messages";

export default function Error(props:any) {
    const status = props.status;
    Messages.setMessages(props.messages)
    Messages.setLocale(props.locale)
    return <Container className="pt-4 min-h-screen flex flex-col">
        <h1>Error  {status}</h1>

        <span className="text-gray-500 mt-4">Important links</span>
        <ul className="text-blue-500">
            <li><Link href="/login" headers={{
                'Content-Type': 'plain/txt'
            }}>Login</Link></li>
            <li><Link href="/register" headers={{
                'Content-Type': 'plain/txt'
            }}>Register</Link></li>
            <li><Link href="/" headers={{
                'Content-Type': 'plain/txt'
            }}>Dashboard</Link></li>
        </ul>
    </Container>
}