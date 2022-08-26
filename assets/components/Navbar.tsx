import * as React from "react";
import {User} from "../types/User";
import {Link} from "@inertiajs/inertia-react";
import {Messages} from "../messages";

export const Navbar:React.FC<{
    user: User
}> = ({
    user
}) => {
    return (
        <div className="flex justify-between absolute top-0 w-full mt-5 right-1">
            <div></div>
            <button role="presentation" className="relative group">
                <div role="presentation" className="group-hover:outline outline-primary flex items-center justify-end cursor-pointer px-3 py-1 space-x-1 text-gray-500 hover:text-gray-600 border border-transparent hover:border-mellow-darker hover:bg-mellow rounded-md">
                    <span>{`${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                </div>

                <ul className="bg-white select-none group-hover:select-auto transition-all opacity-0 group-hover:opacity-100 absolute z-10 bottom-1 w-full transform translate-y-10 group-hover:translate-y-12 p-1 rounded-md border border-mellow-darker">
                    <li className="py-1 text-sm hover:bg-mellow border border-transparent hover:border-mellow-darker rounded-md">
                        <Link href={Messages.locale + "/logout"} method="get" headers={{
                            'Content-Type': 'text/plain'
                        }} className="group-hover:select-auto group-hover:cursor-pointer select-none cursor-default">{Messages.trans("Logout")}</Link>
                    </li>
                </ul>
            </button>
        </div>
    )
}