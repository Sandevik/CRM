import Button from '@/components/Button';
import Link from 'next/link';
import React from 'react'
import { FaUser } from "react-icons/fa";


export default function ClientCard({client, edit, setEdit}: {client: Client | null, edit: boolean, setEdit: React.Dispatch<React.SetStateAction<boolean>>}) {
  return (
    <div className="w-[30em] h-full bg-background-dark p-2 rounded-md flex flex-col justify-between">
        
        <div className="flex flex-col h-[20%] mt-10">
            <FaUser className="text-8xl flex justify-center m-auto bg-background-light rounded-full p-4"/>
            <span className="m-auto flex justify-center text-2xl font-semibold">{client?.firstName} {client?.lastName}</span>
            <span className="mx-auto flex justify-center ">{client?.dateOfBirth}</span>
        </div>
        
        <div className="flex flex-col gap-4 h-[30%] justify-center">
            <span className="mx-auto flex justify-center ">{client?.address}</span>
            <span className="mx-auto flex justify-center ">{client?.zipCode} {client?.city}</span>
            <span className="mx-auto flex justify-center ">{client?.country}</span>
        </div>

        <div className="flex flex-col justify-center  w-full gap-2 h-[20%]">
            <div className="flex justify-between w-[70%] m-auto">
                <span>Email</span>
                {client?.email ? <Link className="text-greenish" href={`mailto:${client.email}`}>{client?.email}</Link> : <span>-</span>}
            </div>
            <div className="flex justify-between w-[70%] m-auto">
                <span>Phone</span>
                {client?.phoneNumber ? <Link className="text-greenish" href={`mailto:${client.phoneNumber}`}>{client?.phoneNumber}</Link> : <span>-</span>}
            </div>
            <div className="flex justify-between w-[70%] m-auto">
                <span>Company</span>
                <span>{client?.company || "-"}</span>
            </div>
        </div>

        <div className="flex-1 justify-center gap-6 flex py-2 items-end">
            <Button onClick={() => setEdit(!edit)}>{edit ? "Close" : "Edit"}</Button>
            <Button>Delete</Button>
        </div>

    </div>
  )
}
