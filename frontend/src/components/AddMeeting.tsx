import React, { useContext, useState } from 'react'
import { IoClose } from "react-icons/io5";
import Input from './Input';
import Button from './Button';
import request from '@/utils/request';
import { CurrentCrmContext } from '@/context/CurrentCrmContext';

type NewMeeting = Omit<Meeting, "added" | "updated" | "uuid" | "entryId">;

interface BaseProps {
    closePopup: () => void, 
    active: boolean, 
    onSuccessfulSubmit: () => void, 
    withClientUuid?: string
}




export default function AddMeeting({closePopup, active, onSuccessfulSubmit, withClientUuid}: BaseProps) {
    const {crm} = useContext(CurrentCrmContext);
    const [meeting, setMeeting] = useState<NewMeeting>({clientUuid: withClientUuid || "", from: "", to: ""})


    const createMeeting = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        const from = new Date(meeting.from);
        const to = new Date(meeting.to);
        if (crm?.crmUuid) {
            const res = await request("/meetings/create", {
                clientUuid: withClientUuid || meeting.clientUuid,
                crmUuid: crm?.crmUuid,
                from: from.getTime(),
                to: to.getTime(),
            }, "POST")
            if (res.code === 201) {
                onSuccessfulSubmit();
                closePopup();
            }
        }
    }
  
    return (
    <form className={`absolute bottom-3 left-[50%] translate-x-[-50%] w-[300px] z-20 rounded-md bg-background-light bg-opacity- p-4 ${active ? "pointer-events-auto opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-12"} transition-all`}>
        <IoClose className="absolute top-2 right-2 text-4xl text-gray-400 cursor-pointer" onClick={() => closePopup()}/>
        <div className="flex flex-col gap-4 mt-6">
            <div className="flex flex-col">
                <label htmlFor="from">From</label>
                <Input type="datetime-local" name='from' value={meeting.from} onChange={(e) => setMeeting({...meeting, from: e.target.value})}/>
            </div>
            
            <div className="flex flex-col">
                <label htmlFor="to">To</label>
                <Input type="datetime-local" name="to" value={meeting.to} onChange={(e) => setMeeting({...meeting, to: e.target.value})}/>
            </div>

            {!withClientUuid && <div className="flex flex-col">
                <label htmlFor="clientUuid">Client uuid</label>
                <Input type="text" name="clientUuid" placeholder='dc586882-5a1c-4f35-b4d4-08c695427090' value={meeting.clientUuid} onChange={(e) => setMeeting({...meeting, clientUuid: e.target.value})}/>
            </div>}

            <Button type='submit' className='mt-4' onClick={(e) => createMeeting(e)}>Create</Button>
        </div>
    </form>
  )
}
