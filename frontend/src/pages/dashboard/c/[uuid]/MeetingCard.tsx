import fetchClientDetails from '@/utils/fetchClientDetails';
import React, { useEffect, useState } from 'react'

export default function MeetingCard({meeting}: {meeting: Meeting}) {
    const fromDate = new Date(meeting.from);
    const toDate = new Date(meeting.to);
    const [client, setClient] = useState<Client | null>(null);
    
    // fetch client details from localstorage first then request
    useEffect(()=>{
        (async () => {
            setClient(await fetchClientDetails(meeting.clientUuid));
        })();
    },[meeting])


    return (
    <li className="border-b-2 border-gray-200 min-h-28 flex flex-col justify-between py-2">
        <span className='font-semibold text-lg'>{client ? client.firstName + " " + client.lastName : "Unknown client"}</span>
        <div>
            <div className="flex justify-between">
                <span>{fromDate.toLocaleDateString() === toDate.toLocaleDateString() ? "Today" : fromDate.toLocaleDateString()}</span>
                <span>{fromDate.toLocaleTimeString()} {isSameDate(fromDate, toDate) ? "- " + toDate.toLocaleTimeString() : "-"}</span>
            </div>

            {!isSameDate(fromDate, toDate) && 
            <div className='flex justify-between'>  
                <span>{toDate.toLocaleDateString()}</span>
                <span>{toDate.toLocaleTimeString()}</span>
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

