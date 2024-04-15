import React, { useContext, useEffect, useState } from 'react'
import { MeetingWithDay } from './Calendar';
import fetchCustomerDetails from '@/utils/fetchCustomerDetails';
import { CurrentCrmContext } from '@/context/CurrentCrmContext';
import CustomerList from './CustomerList';
import Text from '@/components/Text';


export default function CalendarPart({activeDate, meetingWithDay, currentDate}: {activeDate: Date, meetingWithDay: MeetingWithDay, currentDate: Date}) {
    
    const [customers, setCustomers] = useState<Customer[]>([]);
    const {crm} = useContext(CurrentCrmContext);

    useEffect(()=>{
        if(crm?.crmUuid){
           getCustomers(crm);
        }
    },[meetingWithDay, crm])

    const getCustomers = async (crm: Crm) => {
        let res: Customer[] = [];
        meetingWithDay.meetings.forEach( async (meeting) => {
            let c = await fetchCustomerDetails(crm?.crmUuid, meeting.customerUuid)
            if (c) res.push(c)
        });
        console.log(res);
        setCustomers(res)
    }

    /* useEffect(()=>{
        console.log("customers")
    },[customers]) */
  
    return (
    <li className={`h-32 p-2 hover:bg-light-purple transition-colors ${new Date(activeDate.getFullYear(), activeDate.getMonth(), meetingWithDay.day).toDateString() === currentDate.toDateString() ? "bg-light-purple bg-opacity-60" : new Date(activeDate.getFullYear(), activeDate.getMonth(), meetingWithDay.day).getTime() < currentDate.getTime() ? "bg-background-light bg-opacity-50" : "bg-background-light" }`} key={meetingWithDay.day}>
        <div className="flex justify-between text-accent-color">
            <span className="text-2xl font-semibold">{meetingWithDay.day}</span>
            <span className="text-md">{matchWeekDay(new Date(activeDate.getFullYear(), activeDate.getMonth() + 1, meetingWithDay.day).getDay())}</span>
        </div>
        <CustomerList customers={customers} />
    </li>
  )
}

const matchWeekDay = (num: number): React.JSX.Element | "" => {
    switch (num) {
        case 0:
            return <Text text={{eng: "Thursday", swe: "Torsdag"}} />;
        case 1:
            return <Text text={{eng: "Friday", swe: "Fredag"}} />;
        case 2:
            return <Text text={{eng: "Saturday", swe: "Lördag"}} />;
        case 3:
            return <Text text={{eng: "Sunday", swe: "Söndag"}} />;
        case 4:
            return <Text text={{eng: "Monday", swe: "Måndag"}} />;
        case 5:
            return <Text text={{eng: "Tuesday", swe: "Tisdag"}} />;
        case 6: 
            return <Text text={{eng: "Wednesday", swe: "Onsdag"}} />;
        default: 
            return "";
    }
}