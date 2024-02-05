import React, { useContext, useEffect, useState } from 'react'
import { IoClose } from "react-icons/io5";
import request from '@/utils/request';
import { CurrentCrmContext } from '@/context/CurrentCrmContext';
import Input from '@/components/Input';
import Button from '@/components/Button';

type NewMeeting = Omit<Meeting, "added" | "updated" | "uuid" | "entryId">;

interface BaseProps {
    closePopup: () => void, 
    _meeting: Meeting | null, 
    onSuccessfulSubmit: () => void, 
}

const calcDateWithTimezoneOffset = (date: Date): Date => {
    let newDate = new Date(date);
    let nextHours = date.getHours() + (new Date().getTimezoneOffset() * 60) % 24;
    newDate.setHours(nextHours);
    if (date.getHours() + (new Date().getTimezoneOffset() * 60) > 24) {
        if (newDate.getDate() + 1 > new Date(newDate.getFullYear(), newDate.getMonth() + 1, 0).getDate()) {
            newDate.setMonth(1)
            newDate.setFullYear(newDate.getFullYear() + 1);
        }else {
            newDate.setMonth(newDate.getMonth() + 1)
        }
        newDate.setDate(newDate.getDate() + 1)
    }
    return newDate;
}

const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const _date = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    return `${year}-${month < 10 ? "0"+month : month}-${_date < 10 ? "0"+_date : _date}T${hour < 10 ? "0"+hour : hour}:${minute < 10 ? "0"+minute : minute}`
}

export default function EditMeeting({closePopup, _meeting, onSuccessfulSubmit}: BaseProps) {
    const {crm} = useContext(CurrentCrmContext);
    const [meeting, setMeeting] = useState<NewMeeting>({clientUuid: _meeting?.clientUuid || "", from: _meeting?.from ? formatDate(calcDateWithTimezoneOffset(new Date(_meeting?.from))) : "", to: _meeting?.to ? formatDate(calcDateWithTimezoneOffset(new Date(_meeting?.to))) : ""})

    useEffect(()=>{
        setMeeting({clientUuid: _meeting?.clientUuid || "", from: _meeting?.from ? formatDate(calcDateWithTimezoneOffset(new Date(_meeting?.from))) : "", to: _meeting?.to ? formatDate(calcDateWithTimezoneOffset(new Date(_meeting?.to))) : ""})
    },[_meeting])

    const editMeeting = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        const from = new Date(meeting.from);
        const to = new Date(meeting.to);
        if (crm?.crmUuid && _meeting?.uuid) {
            const res = await request(`/meetings?crmUuid=${crm.crmUuid}&uuid=${_meeting?.uuid}`, {
                clientUuid: meeting.clientUuid,
                from: from.getTime(),
                to: to.getTime(),
            }, "PUT")
            if (res.code === 200) {
                onSuccessfulSubmit();
                closePopup();
            }
        }
    }
  
    return (
    <form className={`absolute bottom-3 left-[50%] translate-x-[-50%] w-[300px] z-20 rounded-md bg-background-light bg-opacity- p-4 ${_meeting !== null ? "pointer-events-auto opacity-100 translate-y-0" : "pointer-events-none opacity-0 translate-y-12"} transition-all`}>
        <IoClose className="absolute top-2 right-2 text-4xl text-gray-400 cursor-pointer" onClick={() => closePopup()}/>
        <div className="flex flex-col gap-4 mt-6">
            <div className="flex flex-col">
                <label htmlFor="from">From</label>
                <Input type="datetime-local" name='from' value={meeting?.from || ""} onChange={(e) => setMeeting({...meeting, from: e.target.value})}/>
            </div>
            
            <div className="flex flex-col">
                <label htmlFor="to">To</label>
                <Input type="datetime-local" name="to" value={meeting?.to || ""} onChange={(e) => setMeeting({...meeting, to: e.target.value})}/>
            </div>

            <div className="flex flex-col">
                <label htmlFor="clientUuid">Client uuid</label>
                <Input type="text" name="clientUuid" placeholder='dc586882-5a1c-4f35-b4d4-08c695427090' value={meeting.clientUuid} onChange={(e) => setMeeting({...meeting, clientUuid: e.target.value})}/>
            </div>

            <Button type='submit' className='mt-4' onClick={(e) => editMeeting(e)}>Save</Button>
        </div>
    </form>
  )
}
