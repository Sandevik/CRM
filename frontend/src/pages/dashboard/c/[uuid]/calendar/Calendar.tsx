import Button from '@/components/Button';
import React, { useState } from 'react'

export default function Calendar() {

    const [currentDate, setCurrentDate] = useState<Date>(new Date());
    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const date = new Date().getDate();


    const numDaysThisMonth = (y: number, m: number) => new Date(y, m, 0).getDate();

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getMonth() == 11 ? currentDate.getFullYear() + 1 : currentDate.getFullYear(), currentDate.getMonth() === 11 ? 0 : currentDate.getMonth() + 1))
    }
    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getMonth() == 0 ? currentDate.getFullYear() - 1 : currentDate.getFullYear(), currentDate.getMonth() === 0 ? 11 : currentDate.getMonth() - 1))
    }


  return (
    <div className='max-w-[1440px] m-auto p-4 flex flex-col gap-4'>

        <div className="flex justify-center items-center gap-4">
            <Button onClick={() => prevMonth()}>Prev</Button>
            {currentDate.getFullYear() + " " + matchMonth(currentDate.getMonth() + 1) }
            <Button onClick={() => nextMonth()}>Next</Button>
        </div>

        <ul className="grid grid-cols-auto-fill md:grid-cols-calendar gap-2 ">
            {Array(numDaysThisMonth(currentDate.getFullYear(), currentDate.getMonth() + 1)).fill("a").map((_, i) => (
            <li className={`h-32  hover:bg-light-purple transition-colors ${i+1 === date ? "bg-light-purple" : i + 1 < date ? "bg-background-light bg-opacity-50" : "bg-background-light" }`} key={i + 1}>
                {i + 1}
                <br />
                {matchWeekDay(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, i + 1).getDay())}
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