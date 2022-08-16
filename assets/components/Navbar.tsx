import * as React from "react";
import {User} from "../types/User";

export const Navbar:React.FC<{
    user: User
}> = ({
    user
}) => {
    return (
        <div className="flex justify-between">
            <div></div>
            <div className="flex items-center justify-end cursor-pointer px-3 py-1 space-x-1 text-gray-500 hover:text-gray-600 border border-transparent hover:border-mellow-darker hover:bg-mellow rounded-md">
                <span>{`${user.firstName}${user.lastName ? ' ' + user.lastName : ''}`}</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            </div>
        </div>
    )
}