import Input from '@/components/Input';
import Text from '@/components/Text'
import React, { useEffect, useState } from 'react'
import { BsChevronLeft, BsChevronRight } from 'react-icons/bs';
import { IoIosTimer } from 'react-icons/io'

export default function EmployeeTimeReports({selectedTab}: {selectedTab: "tasks" | "time" | "settings"}) {
  const [selectedPeriod, setSelectedPeriod] = useState<"monthly" | "weekly">("weekly");
  const [selectedWeek, setSelectedWeek] = useState<string>(getDateWeek(new Date()).toString());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth()+1);


  function getDateWeek(date: Date) {
    const currentDate = date;
    const januaryFirst = new Date(currentDate.getFullYear(), 0, 1);
    const daysToNextMonday = (januaryFirst.getDay() === 1) ? 0 : (7 - januaryFirst.getDay()) % 7;
    const nextMonday = new Date(currentDate.getFullYear(), 0, januaryFirst.getDate() + daysToNextMonday);
    return (currentDate < nextMonday) ? 52 : (currentDate > nextMonday ? Math.ceil((currentDate.getTime() - nextMonday.getTime()) / (24 * 3600 * 1000) / 7) : 1);
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
              <option value="monthly"><Text text={{swe: "Månadsvis", eng: "Monthly"}} /></option>
            </select>
          </div>

          {selectedPeriod === "weekly" && <div className="flex flex-col gap-1">
            <label htmlFor="week" className='flex justify-center'><Text text={{swe: "Vecka", eng: "Week"}} /></label>
            <div className="flex items-center gap-2">
              <button onClick={() => selectedWeek !== "" ? +selectedWeek >= 2 ? setSelectedWeek((+selectedWeek-1).toString()) : 1 : setSelectedWeek((getDateWeek(new Date())-1).toString())}><BsChevronLeft/></button>
              <Input type="number" name='week' className="w-10" value={+selectedWeek} onChange={(e) => setSelectedWeek(Number(e.target.value) > 52 ? "52" : e.target.value.length > 1 && e.target.value[0] === "0" ? e.target.value.substring(1) : Number(e.target.value).toString())}/>
              <button onClick={() => selectedWeek !== "" ? +selectedWeek <= 51 ? setSelectedWeek((+selectedWeek+1).toString()) : 52 : setSelectedWeek((getDateWeek(new Date())+1).toString())}><BsChevronRight/></button>
            </div>
          </div>}

          {selectedPeriod === "monthly" && <div className='flex flex-col gap-1'>
            <label htmlFor="month"><Text text={{swe: "Månad", eng: "Month"}} /></label>
            <Input value={selectedMonth} />
          </div> }

          <div className='flex flex-col gap-1'>
            <label htmlFor="year" className="ml-2"><Text text={{swe: "År", eng: "Year"}} /></label>
            <Input name="year" value={selectedYear}/>
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
          <div>Totalrapporterad tid vecka {selectedWeek}: 16h 53min </div>
          <div>Totalrapporterad tid månad {selectedMonth}: 26h 34min </div>
        </div>

      </div>

      <div className="flex justify-center  flex-wrap gap-6 mt-6 w-full">
        {Array<string>(7).fill("").map((item, index) => 
          <div className="bg-background-dark rounded-md p-2">
            <div className='min-h-32 min-w-32'>
              Måndag 15 / 4
              <br />
              Tid rapporterad
              <br />
              12h 35min 
              <br /> 
              Rapporterad Rast / Frånvaro
              <br />
              45min
              <BsChevronRight />
            </div> 
          </div>
        )}
      
      </div>

      


    </div>
  )
}
