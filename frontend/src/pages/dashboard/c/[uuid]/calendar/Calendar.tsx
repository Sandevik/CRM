import Button from '@/components/Button';
import React, { useEffect, useState } from 'react'

export default function Calendar() {

    const currentDate = new Date();
    const [activeDate, setActiveDate] = useState<Date>(new Date());
    const [meetings, setMeetings] = useState<Meeting[]>([]);

    const numDaysThisMonth = (y: number, m: number) => new Date(y, m, 0).getDate();

    const nextMonth = () => {
        setActiveDate(new Date(activeDate.getMonth() == 11 ? activeDate.getFullYear() + 1 : activeDate.getFullYear(), activeDate.getMonth() === 11 ? 0 : activeDate.getMonth() + 1))
    }
    const prevMonth = () => {
        setActiveDate(new Date(activeDate.getMonth() == 0 ? activeDate.getFullYear() - 1 : activeDate.getFullYear(), activeDate.getMonth() === 0 ? 11 : activeDate.getMonth() - 1))
    }


    const getMeetings = async () => {

    }

    useEffect(()=>{
        console.log("new month")
    },[activeDate])



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
                <li className={`h-32  hover:bg-light-purple transition-colors ${new Date(activeDate.getFullYear(), activeDate.getMonth(), i + 1).toDateString() === currentDate.toDateString() ? "bg-light-purple" : new Date(activeDate.getFullYear(), activeDate.getMonth(), i + 1).getTime() < currentDate.getTime() ? "bg-background-light bg-opacity-50" : "bg-background-light" }`} key={i + 1}>
                {i + 1}
                <br />
                {matchWeekDay(new Date(activeDate.getFullYear(), activeDate.getMonth() + 1, i + 1).getDay())}
            </li>
            ))}
        </ul>
    </div>
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