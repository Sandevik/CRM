import Input from '@/components/Input';
import SmallTimeReportBox from '@/components/SmallTimeReportBox';
import Text from '@/components/Text'
import { CurrentCrmContext } from '@/context/CurrentCrmContext';
import getDateWeek from '@/utils/getDateWeek';
import { matchWeekDay } from '@/utils/matchWeekDay';
import request from '@/utils/request';
import timeStringFromMs from '@/utils/timeStringFromMs';
import React, { useContext, useEffect, useState } from 'react'
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { IoIosTimer } from 'react-icons/io'

export default function EmployeeTimeReports({selectedTab, employee, setExpandedTimeReport, timeReports, selectedPeriod, selectedMonth, setSelectedMonth, selectedWeek, setSelectedWeek, selectedYear, setSelectedYear, setSelectedPeriod}:{setSelectedPeriod: React.Dispatch<React.SetStateAction<"weekly" | "monthly">>, selectedYear: number, setSelectedYear: React.Dispatch<React.SetStateAction<number>>,selectedWeek: string, setSelectedWeek: React.Dispatch<React.SetStateAction<string>>, selectedMonth: number, setSelectedMonth: React.Dispatch<React.SetStateAction<number>>, selectedPeriod: "monthly" | "weekly",selectedTab: "tasks" | "time" | "settings", employee: Employee, setExpandedTimeReport: React.Dispatch<React.SetStateAction<TimeReport | null>>, timeReports: TimeReport[]}) {
  const {crm} = useContext(CurrentCrmContext);
  
  const [totalTimeReported, setTotalTimeReported] = useState<number>(0);

  
  const calcTime = () => {
    let totalTime: number = 0;
    timeReports.forEach(timeReport => {
      if (timeReport.startDateTime && timeReport.endDateTime) {
        totalTime += (new Date(timeReport.endDateTime).getTime() - new Date(timeReport.startDateTime).getTime()) / 1000 / 60;
      } 
    })
    setTotalTimeReported(totalTime);
  }

  useEffect(()=>{
    calcTime();
  },[timeReports])

  const changeWeek = (newWeekNum: number, year: number) => {
    const currentMonth = new Date(year, (0), (1 + (newWeekNum - 1)*7)).getMonth()+1;
    setSelectedMonth(currentMonth);
    setSelectedWeek(newWeekNum.toString());
  }

  return (
    <div className={`p-2 ${selectedTab === "time" ? "translate-x-0 opacity-100 pointer-events-auto " : "translate-x-5 opacity-0 pointer-events-none"} absolute top-4 w-full h-full transition-all bg-background-light bg-opacity-50 rounded-md overflow-y-scroll scrollthumb overflow-x-hidden `}>
      <span className="flex gap-2 items-center mb-2"><IoIosTimer /><Text text={{swe: "Tidsrapporteringar", eng: "Time Reports"}} /></span>
      <IoIosTimer className="absolute text-background-dark h-full w-full top-0 opacity-10 pointer-events-none z-10" />

      <div className="z-20">
        <div className="flex gap-4 items-center justify-center">

          <div className="flex flex-col gap-1">
            <label htmlFor="time_period" className="ml-2"><Text text={{swe: "Tidsperiod", eng: "Time Period"}} /></label>
            <select name="time_period" className="bg-background-light text-lg p-1 rounded-md" value={selectedPeriod} onChange={(e) => setSelectedPeriod(e.target.value as "monthly" | "weekly")}>
              <option value="weekly"><Text text={{swe: "Veckovis", eng: "Weekly"}} /></option>
              {/* <option value="monthly"><Text text={{swe: "Månadsvis", eng: "Monthly"}} /></option> */}
            </select>
          </div>

          {selectedPeriod === "weekly" && <div className="flex flex-col gap-1">
            <label htmlFor="week" className='flex justify-center'><Text text={{swe: "Vecka", eng: "Week"}} /></label>
            <div className="flex items-center gap-2">
              <button onClick={() => selectedWeek !== "" ? +selectedWeek >= 2 ? changeWeek((+selectedWeek-1), selectedYear) : 1 : changeWeek((getDateWeek(new Date())-1), selectedYear)}><BsChevronLeft/></button>
              <Input type="number" name='week' className="w-10" value={+selectedWeek} onChange={(e) => changeWeek(Number(e.target.value) > 52 ? 52 : e.target.value.length > 1 && e.target.value[0] === "0" ? +e.target.value.substring(1) : Number(e.target.value), selectedYear)}/>
              <button onClick={() => selectedWeek !== "" ? +selectedWeek <= 51 ? changeWeek((+selectedWeek+1), selectedYear) : 52 : changeWeek((getDateWeek(new Date())+1), selectedYear)}><BsChevronRight/></button>
            </div>
          </div>}

          {selectedPeriod === "monthly" && <div className='flex flex-col gap-1'>
            <label htmlFor="month"><Text text={{swe: "Månad", eng: "Month"}} /></label>
            <Input value={selectedMonth} />
          </div> }

          <div className='flex flex-col gap-1'>
            <label htmlFor="year" className="ml-2"><Text text={{swe: "År", eng: "Year"}} /></label>
            <Input name="year" type='number' value={selectedYear} onChange={(e) => setSelectedYear(+e.target.value)}/>
          </div>

        </div>
      </div>

      <div className='flex items-center mt-4 justify-center gap-6'>
        <div className="flex gap-6 ">
          
          <div className="flex flex-col">
            <span>Övertid</span>
            <span>0</span>
          </div>

          <div className="flex flex-col">
            <span>Komp saldo</span>
            <span>0</span>
          </div>

        </div>

        <div className="flex flex-col">
          <div>Totalrapporterad tid vecka {selectedWeek}: {totalTimeReported < 0 ? "0h 0 min" : timeStringFromMs(totalTimeReported)} </div>
          <div>Totalrapporterad tid månad {selectedMonth}: 0h 0 min </div>
        </div>

      </div>

      <div className="flex justify-center flex-wrap gap-6 mt-6 w-full">
        {timeReports.map((timeReport) => 
          <SmallTimeReportBox key={timeReport.uuid} timeReport={timeReport} setExpandedTimeReport={setExpandedTimeReport} />
        )}
      
      </div>

      


    </div>
  )
}
