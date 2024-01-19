import { CurrentCrmContext } from '@/context/CurrentCrmContext';
import fetchClientDetails from '@/utils/fetchClientDetails';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react'
import { FaUser } from "react-icons/fa";

export default function MeetingCard({meeting}: {meeting: Meeting}) {
    const {crm} = useContext(CurrentCrmContext);
    const fromDate = new Date(meeting.from);
    const toDate = new Date(meeting.to);
    const [client, setClient] = useState<Client | null>(null);
    
    // fetch client details from localstorage first then request
    useEffect(()=>{
        (async () => {
            if (crm?.crmUuid) {
                setClient(await fetchClientDetails(crm?.crmUuid, meeting.clientUuid));
            }
        })();
    },[meeting])


    return (
    <li className="border-b-2 border-light-purple min-h-[400px] flex flex-col justify-between p-2 bg-background-light rounded-md">
        
        <div className="flex flex-col gap-12 mt-8">
            <div className='flex flex-col gap-2 items-center justify-center'>
                <FaUser className="text-[92px] bg-background-dark p-2 rounded-full" />
                <Link href={`${crm?.crmUuid}/clients/${client?.uuid}`} className='font-semibold text-lg text-light-blue hover:text-greenish transition-colors'>{client ? client.firstName + " " + client.lastName : "Unknown client"}</Link>
            </div>


            <div className="flex flex-col items-center gap-2">
                <a className='text-greenish' href={`mailto:${client?.email}`}>{client?.email}</a>
                <a className='text-greenish' href={`tel:${client?.phoneNumber}`}>{client?.phoneNumber}</a>
                <span>{client?.company}</span>
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

