import React, { useContext, useState } from 'react'
import { IoClose } from "react-icons/io5";
import Input from './Input';
import Button from './Button';
import request from '@/utils/request';
import { CurrentCrmContext } from '@/context/CurrentCrmContext';
import Text from './Text';

type NewMeeting = Omit<Meeting, "added" | "updated" | "uuid" | "entryId" | "crmUuid">;

interface BaseProps {
    closePopup: () => void, 
    active: boolean, 
    onSuccessfulSubmit: () => void, 
    withCustomerUuid?: string
}

const calcDateWithTimezoneOffset = (date: Date): Date => {
    return new Date(date.getTime() - (new Date().getTimezoneOffset() * 60 * 1000));
}


export default function AddMeeting({closePopup, active, onSuccessfulSubmit, withCustomerUuid}: BaseProps) {
    const {crm} = useContext(CurrentCrmContext);
    const [meeting, setMeeting] = useState<NewMeeting>({customerUuid: withCustomerUuid || "", from: "", to: ""})


    const createMeeting = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        const from = new Date(meeting.from);
        const to = new Date(meeting.to);
        if (crm?.crmUuid) {
            const res = await request("/meetings/create", {
                customerUuid: withCustomerUuid || meeting.customerUuid,
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
    <form className={`absolute bottom-3 left-[50%] translate-x-[-50%] w-[300px] z-20 rounded-md bg-background-light  p-4 ${active ? "pointer-events-auto opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-12"} transition-all`}>
        <IoClose className="absolute top-2 right-2 text-4xl text-gray-400 cursor-pointer" onClick={() => closePopup()}/>
        <div className="flex flex-col gap-4 mt-6">
            <div className="flex flex-col gap-2">
                <label htmlFor="from"><Text text={{eng: "From", swe: "Från"}} /></label>
                <Input type="datetime-local" name='from' value={meeting.from} onChange={(e) => setMeeting({...meeting, from: e.target.value})}/>
            </div>
            
            <div className="flex flex-col gap-2">
                <label htmlFor="to"><Text text={{eng: "To", swe: "Till"}} /></label>
                <Input type="datetime-local" name="to" value={meeting.to} onChange={(e) => setMeeting({...meeting, to: e.target.value})}/>
            </div>

            {!withCustomerUuid && <div className="flex flex-col gap-2">
                <label htmlFor="customerUuid"><Text text={{eng: "Customer Uuid", swe: "Kund Uuid"}} /></label>
                <Input type="text" name="customerUuid" placeholder='dc586882-5a1c-4f35-b4d4-08c695427090' value={meeting.customerUuid} onChange={(e) => setMeeting({...meeting, customerUuid: e.target.value})}/>
            </div>}

            <Button type='submit' className='mt-4' onClick={(e) => createMeeting(e)}><Text text={{eng: "Create", swe: "Skapa"}} /></Button>
        </div>
    </form>
  )
}
