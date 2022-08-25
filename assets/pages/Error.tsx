import * as React from 'react';
import {Container} from "../components/Container";
import {Link} from "@inertiajs/inertia-react";

export default function Error({status}:{status:number}) {
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