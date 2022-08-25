import * as React from "react";
import {Board} from "../types/Board";
import {useForm} from "@inertiajs/inertia-react";
import Input from "./Input";
import Button, {DeleteButton} from "./Button";
import {User} from "../types/User";
import {Inertia} from "@inertiajs/inertia";

export const ManageBoard:React.FC<{board:Board, onClose:any, currentUser: User}> = ({board, onClose, currentUser}) => {
    const {data, setData, post, errors, clearErrors } = useForm({
        email: ''
    })
    const addMember = (e:any) => {
        e.preventDefault();
        clearErrors();
        post('/board/'+board.id+"/members")
    }
    const deleteUser = (userId:number) => {
        Inertia.delete('/board/'+board.id+"/members", {
            data: {
                user: userId
            }
        })
    }
    return <div className="absolute z-20 top-0 left-0 bg-black bg-opacity-30 w-full h-full px-2 py-2" onClick={onClose}>
        <div className="rounded-md max-w-2xl w-full bg-mellow mx-auto p-4 mt-16" onClick={e=>e.stopPropagation()}>
            <div className="flex justify-between items-center">
                <span className="font-bold">Manage Board</span>
                <button onClick={onClose} className="hover:bg-mellow-darker rounded-md transition text-gray-400 hover:text-gray-500 p-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 19.5l15-15m-15 0l15 15" />
                    </svg>
                </button>
            </div>
            <form onSubmit={addMember} className="mt=2">
                <span className="text-sm text-gray-500">Invite new member</span>
                <div className="flex space-x-2 mt-1">
                    <Input error={errors.email} small value={data.email} placeholder="Member email..." onChange={e=>setData('email', e.target.value)} />
                    <div>
                        <Button small className="px-5 py-2">Invite</Button>
                    </div>
                </div>
            </form>

            <div className="mt-4">
                <span className="text-sm text-gray-500">Member</span>
                <div className="flex flex-col space-y-2">
                    {
                        board.members.map(user => {
                            return <div key={user.id} className="group relative overflow-x-hidden px-2 py-1 border border-gray-300 rounded-md group flex">
                                <span className="text-gray-500 flex-grow py-1">{user.firstName + " " + user.lastName}</span>
                                {
                                    user.id === board.createdBy.id && <div>
                                        <span className="text-xs bg-gray-200 rounded-sm text-gray-500 px-2 py-1">Admin</span>
                                    </div>
                                }
                                {
                                    currentUser.id === board.createdBy.id &&  user.id !== board.createdBy.id && (
                                        <DeleteButton onDelete={()=> deleteUser(user.id)} />
                                    )
                                }
                            </div>
                        })
                    }
                </div>
            </div>
        </div>
    </div>
}