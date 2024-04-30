import React, { useEffect, useState } from 'react'
import Text from './Text'
import { IoExpand } from "react-icons/io5";
import { matchWeekDay } from '@/utils/matchWeekDay';


export default function SmallTimeReportBox({timeReport}: {timeReport: TimeReport}) {
    const [totalBreakTime, setTotalBreakTime] = useState<number>(0);

    useEffect(()=>{
        let totalBreakTime = 0;
        timeReport.breaks?.forEach(b => {
            totalBreakTime += new Date(b.end_date_time).getTime() - new Date(b.end_date_time).getTime() / 1000 / 60; 
        })
        setTotalBreakTime(totalBreakTime);
    },[timeReport])

  return (
    <div key={timeReport.uuid} className={`bg-background-dark rounded-md p-2 min-w-32 cursor-pointer ${new Date(timeReport?.scheduleDate).toDateString() === new Date().toDateString() && "border border-accent-color"}`}>
            <div className='min-h-32 min-w-32'>
              <div className="flex justify-between gap-5">
                <span className={`text-lg ${new Date(timeReport?.scheduleDate).toDateString() === new Date().toDateString() ? "text-accent-color" : new Date(timeReport.scheduleDate).getDay() === 0 ? "text-light-red" : "text-white" }`}>{matchWeekDay(new Date(timeReport.scheduleDate).getDay())}</span>
                <span>{timeReport.scheduleDate}</span>
              </div>
              
              <div className="flex flex-col mt-1">
                <span>
                  <Text text={{swe: "Rapporterad tid", eng: "Reported time"}}/>
                </span>
                <span className=''>
                  {timeReport.startDateTime ? new Date(timeReport.startDateTime).toLocaleTimeString() : "00:00"} - {timeReport.endDateTime ? new Date(timeReport.endDateTime).toLocaleTimeString() : "00:00"} 
                </span>
              </div>
            
              <div className=" flex justify-between gap-5 items-end">
                <div className="flex flex-col mt-1">
                  <span>
                    <Text text={{swe: "Rast", eng: "Breaks"}}/>
                  </span>
                  <span className=''>
                    {(totalBreakTime / 60).toFixed(0)}h {totalBreakTime % 60} min 
                  </span>
                </div>
              
                <IoExpand className='text-2xl hover:text-accent-color'/>
              </div>
            </div> 
          </div>
  )
}
