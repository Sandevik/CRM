import Button from '@/components/Button';
import Input from '@/components/Input';
import { CurrentCrmContext } from '@/context/CurrentCrmContext';
import request from '@/utils/request';
import React, { useContext, useState } from 'react'
import { IoClose } from "react-icons/io5";

export default function NewEntryForm({active, close, client, refetchEntries}: {active: boolean, close: () => void, client: Client | null, refetchEntries: () => Promise<void>}) {
    const {crm} = useContext(CurrentCrmContext);
    const [form, setForm] = useState<{content: string, addedAtMeeting: string | null}>({content: "", addedAtMeeting: null})
    const [error, setError] = useState<boolean>(false);

    const submitEntry = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (form.content === "") {
            setError(true);
            return
        }
        if (crm?.crmUuid && client?.uuid) {
            let res = await request("/entries/create", {...form, clientUuid: client.uuid, crmUuid: crm.crmUuid}, "POST");
            if (res.code === 201) {
                setError(false);
                await refetchEntries();
                close();
            }
        }
    }


  return (
    <div className={`${active ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} transition-opacity absolute top-0 left-0 h-full w-full bg-background-dark bg-opacity-40 backdrop-blur-md grid place-items-center`}>
        <form className="h-[70%] w-[40em] bg-background-light p-4 rounded-md relative flex flex-col gap-5">
            <h3 className="text-2xl font-semibold">Create a new entry for {client?.firstName || "unknown client"}</h3>
            <IoClose onClick={() => close()} className="absolute top-2 right-2 text-4xl cursor-pointer"/>
            
            <div className="flex flex-col h-[70%] gap-2">
                <label htmlFor="entry note" className="text-lg">Entry note *</label>
                <textarea name="entry note" value={form.content} onChange={(e) => setForm({...form, content: e.target.value})} className="w-full flex-1 rounded-md overflow-y-scroll scrollthumb resize-none transition-all relative p-2 bg-background-dark text-white" placeholder='Write a note entry about this client...'></textarea>   
            </div>
            
            <div className='flex flex-col gap-2'>
                <label htmlFor="meeting uuid" className="text-lg">Meeting uuid</label>
                <Input name='meeting uuid' className=" w-full bg-background-dark" placeholder='83cdfbe5-7240-4cfc-9cc8-520b15e00bc4'/>
            </div>

            <Button onClick={(e) => submitEntry(e)}>Create</Button>
        </form>
    </div>
  )
}
