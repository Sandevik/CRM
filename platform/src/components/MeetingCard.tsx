import { CurrentCrmContext } from '@/context/CurrentCrmContext';
import fetchCustomerDetails from '@/utils/fetchCustomerDetails';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react'
import { FaUser } from "react-icons/fa";
import { RiSettings3Fill } from "react-icons/ri";
import { IoClose } from "react-icons/io5";
import Button from './Button';
import request from '@/utils/request';


export default function MeetingCard({meeting, refetchMeetings}: {meeting: Meeting, refetchMeetings: () => void}) {
    const {crm} = useContext(CurrentCrmContext);
    const fromDate = new Date(meeting.from);
    const toDate = new Date(meeting.to);
    const [customer, setCustomer] = useState<Customer | null>(null);
    const [meetingSettingsOpen, setMeetingSettingsOpen] = useState<boolean>(false);
    
    // fetch customer details from localstorage first then request
    useEffect(()=>{
        (async () => {
            if (crm?.crmUuid) {
                setCustomer(await fetchCustomerDetails(crm?.crmUuid, meeting.customerUuid));
            }
        })();
    },[meeting])

    
    const removeMeeting = async () => {
        const res = await request(`/meetings?crmUuid=${crm?.crmUuid}&uuid=${meeting.uuid}`, {}, "DELETE")
        if (res.code === 200) {
            setMeetingSettingsOpen(false);
            refetchMeetings();
        } else {
            alert(res.message);
        }
    }

    return (
    <li className="border-b-2 border-light-purple min-h-[400px] flex flex-col justify-between relative p-2 bg-background-light bg-opacity-60 rounded-md">
        <RiSettings3Fill onClick={() => setMeetingSettingsOpen(true)} className="absolute text-2xl top-3 right-3 cursor-pointer text-light-blue"/>
        
        <div className={`absolute p-4 z-30 h-full w-full bg-background-light rounded-md top-0 right-0 backdrop-blur-md bg-opacity-60 ${meetingSettingsOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} transition-opacity`}>
            <IoClose onClick={() => setMeetingSettingsOpen(false)} className="absolute text-3xl top-3 right-3 cursor-pointer text-light-blue"/>
            <Button onClick={() => removeMeeting()}>Remove meeting</Button>
        </div>
        
        
        <div className="flex flex-col gap-12 mt-8">
            <div className='flex flex-col gap-2 items-center justify-center'>
                <FaUser className="text-[92px] bg-background-dark p-2 rounded-full" />
                <Link href={`${crm?.crmUuid}/customers/${customer?.uuid}`} className='font-semibold text-lg text-light-blue hover:text-greenish transition-colors'>{customer ? customer.firstName + " " + customer.lastName : "Unknown customer"}</Link>
            </div>


            <div className="flex flex-col items-center gap-2">
                <a className='text-greenish' href={`mailto:${customer?.email}`}>{customer?.email}</a>
                <a className='text-greenish' href={`tel:${customer?.phoneNumber}`}>{customer?.phoneNumber}</a>
                <span>{customer?.company}</span>
            </div>
        </div>
        
        <div>
            <div className="flex justify-between text-lg p-2">
                <span>{fromDate.toLocaleDateString() === toDate.toLocaleDateString() && fromDate.getTime() === Date.now() ? "Today" : fromDate.toLocaleDateString()}</span>
                <span>{fromDate.toLocaleTimeString().substring(0, 5)} {isSameDate(fromDate, toDate) ? "- " + toDate.toLocaleTimeString().substring(0, 5) : "-"}</span>
            </div>

            {!isSameDate(fromDate, toDate) && 
            <div className='flex justify-between text-lg p-2'>  
                <span>{toDate.toLocaleDateString()}</span>
                <span>{toDate.toLocaleTimeString().substring(0, 5)}</span>
            </div>
            }
        </div>
    </li>
  )
}


function isSameDate(date1: Date, date2: Date): boolean {
    if (date1.toDateString() === date2.toDateString()) {
        return true;
    }
    return false;
}

