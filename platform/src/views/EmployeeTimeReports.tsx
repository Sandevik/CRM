import React from 'react'
import { IoIosTimer } from 'react-icons/io'

export default function EmployeeTimeReports({selectedTab}: {selectedTab: "tasks" | "time" | "settings"}) {
  return (
    <div className={`p-2 ${selectedTab === "time" ? "translate-x-0 opacity-100 pointer-events-auto " : "translate-x-5 opacity-0 pointer-events-none"} absolute top-4 w-full h-full transition-all bg-background-light bg-opacity-50 rounded-md`}>
      Tidsrapportering
      <IoIosTimer className="absolute text-background-dark h-full w-full top-0 opacity-10" />
    </div>
  )
}
