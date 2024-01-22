import Button from '@/components/Button';
import { CurrentCrmContext } from '@/context/CurrentCrmContext';
import request from '@/utils/request';
import React, { useContext, useEffect, useState } from 'react'
import CalendarPart from './CalendarPart';

export interface MeetingWithDay {
    meeting: Meeting,
    day: number,
}

export default function Calendar() {
    const {crm} = useContext(CurrentCrmContext);
    const currentDate = new Date();
    const [activeDate, setActiveDate] = useState<Date>(new Date());
    const [meetingsWithDays, setMeetingsWithDays] = useState<MeetingWithDay[]>([]);

    const numDaysThisMonth = (y: number, m: number) => new Date(y, m, 0).getDate();

    const nextMonth = () => {
        setActiveDate(new Date(activeDate.getMonth() == 11 ? activeDate.getFullYear() + 1 : activeDate.getFullYear(), activeDate.getMonth() === 11 ? 0 : activeDate.getMonth() + 1))
    }
    const prevMonth = () => {
        setActiveDate(new Date(activeDate.getMonth() == 0 ? activeDate.getFullYear() - 1 : activeDate.getFullYear(), activeDate.getMonth() === 0 ? 11 : activeDate.getMonth() - 1))
    }


    const getMeetings = async () => {
        if(crm?.crmUuid) {
            const res = await request<MeetingWithDay[]>(`/meetings?crmUuid=${crm?.crmUuid}&year=${activeDate.getFullYear()}&month=${activeDate.getMonth()+1}`, {}, "GET")
            if (res.code === 200 && res.data) {
                setMeetingsWithDays(res.data)
            }
        }
    }

    useEffect(()=>{
        getMeetings();
    },[activeDate, crm])


    useEffect(()=>{console.log(meetingsWithDays)},[meetingsWithDays])

    const arr = Array(numDaysThisMonth(activeDate.getFullYear(), activeDate.getMonth() + 1)).fill("");

  return (
    <div className='max-w-[1440px] m-auto p-4 flex flex-col gap-4'>

        <div className="flex justify-center items-center gap-4">
            <Button onClick={() => prevMonth()}>Prev</Button>
            {activeDate.getFullYear() + " " + matchMonth(activeDate.getMonth() + 1) }
            <Button onClick={() => nextMonth()}>Next</Button>
        </div>

        <ul className="grid grid-cols-auto-fill md:grid-cols-calendar gap-2 ">
            {arr.map((_, i) => (
                <CalendarPart key={i} i={i} meetings={meetingsWithDays.filter(mWD => mWD.day === i+1).map(mWD => mWD.meeting)} currentDate={currentDate} activeDate={activeDate} />
            ))}
        </ul>
    </div>
  )
}




const matchMonth = (num: number): string => {
    switch (num) {
        case 1:
            return "January";
        case 2:
            return "February";
        case 3:
            return "March";
        case 4:
            return "April";
        case 5:
            return "May";
        case 6:
            return "June";
        case 7: 
            return "July";
        case 8:
            return "August";
        case 9: 
            return "September";
        case 10:
            return "October";
        case 11:
            return "November";
        case 12:
            return "December";
        default: 
            return "";
    }
}