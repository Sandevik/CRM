import React, { useContext, useEffect, useState } from 'react'
import { MeetingWithDay } from './Calendar';
import fetchClientDetails from '@/utils/fetchClientDetails';
import { CurrentCrmContext } from '@/context/CurrentCrmContext';
import ClientList from './ClientList';

export default function CalendarPart({activeDate, meetingWithDay, currentDate}: {activeDate: Date, meetingWithDay: MeetingWithDay, currentDate: Date}) {
    
    const [clients, setClients] = useState<Client[]>([]);
    const {crm} = useContext(CurrentCrmContext);

    useEffect(()=>{
        if(crm?.crmUuid){
           getClients(crm);
        }
    },[meetingWithDay, crm])

    const getClients = async (crm: Crm) => {
        let res: Client[] = [];
        meetingWithDay.meetings.forEach( async (meeting) => {
            let c = await fetchClientDetails(crm?.crmUuid, meeting.clientUuid)
            if (c) res.push(c)
        });
        console.log(res);
        setClients(res)
    }

    /* useEffect(()=>{
        console.log("clients")
    },[clients]) */
  
    return (
    <li className={`h-32 p-2 hover:bg-light-purple transition-colors ${new Date(activeDate.getFullYear(), activeDate.getMonth(), meetingWithDay.day).toDateString() === currentDate.toDateString() ? "bg-light-purple bg-opacity-60" : new Date(activeDate.getFullYear(), activeDate.getMonth(), meetingWithDay.day).getTime() < currentDate.getTime() ? "bg-background-light bg-opacity-50" : "bg-background-light" }`} key={meetingWithDay.day}>
        <div className="flex justify-between text-light-blue">
            <span className="text-2xl font-semibold">{meetingWithDay.day}</span>
            <span className="text-md">{matchWeekDay(new Date(activeDate.getFullYear(), activeDate.getMonth() + 1, meetingWithDay.day).getDay())}</span>
        </div>
        <ClientList clients={clients} />
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