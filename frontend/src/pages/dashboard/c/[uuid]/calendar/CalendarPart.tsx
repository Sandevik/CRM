import React, { useContext, useEffect, useState } from 'react'
import { MeetingWithDay } from './Calendar';
import fetchClientDetails from '@/utils/fetchClientDetails';
import { CurrentCrmContext } from '@/context/CurrentCrmContext';

export default function CalendarPart({activeDate, meetings, i, currentDate}: {activeDate: Date, meetings: Meeting[], i: number, currentDate: Date}) {
    
    const [clients, setClients] = useState<Client[]>([]);
    const {crm} = useContext(CurrentCrmContext);

    useEffect(()=>{},[meetings])

    
    useEffect(()=>{
        (async () => {
            const _clients: Client[] = [];
            if (crm?.crmUuid) {
                meetings.forEach(async (mWD) =>  {
                    const cl = await fetchClientDetails(crm?.crmUuid, mWD.clientUuid);
                    if (cl) _clients.push(cl);
                })
            }
            setClients(_clients);
        })();
    },[crm, meetings, activeDate, i, currentDate])
  
    return (
    <li className={`h-32 p-2 hover:bg-light-purple transition-colors ${new Date(activeDate.getFullYear(), activeDate.getMonth(), i + 1).toDateString() === currentDate.toDateString() ? "bg-light-purple bg-opacity-60" : new Date(activeDate.getFullYear(), activeDate.getMonth(), i + 1).getTime() < currentDate.getTime() ? "bg-background-light bg-opacity-50" : "bg-background-light" }`} key={i + 1}>
        <div className="flex justify-between text-light-blue">
            <span className="text-2xl font-semibold">{i + 1}</span>
            <span className="text-md">{matchWeekDay(new Date(activeDate.getFullYear(), activeDate.getMonth() + 1, i + 1).getDay())}</span>
        </div>
        {clients.map((client, i) => 
        <div key={client.uuid + i}>
            {client.firstName}
        </div>
        )}
    </li>
  )
}

const matchWeekDay = (num: number): string => {
    switch (num) {
        case 0:
            return "Thursday";
        case 1:
            return "Friday";
        case 2:
            return "Saturday";
        case 3:
            return "Sunday";
        case 4:
            return "Monday";
        case 5:
            return "Tuesday";
        case 6: 
            return "Wednesday";
        default: 
            return "";
    }
}