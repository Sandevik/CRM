import React from 'react'

export default function EmployeeTimeReports({selectedTab}: {selectedTab: "tasks" | "time" | "settings"}) {
  return (
    <div className={`p-2 ${selectedTab === "time" ? "translate-x-0 opacity-100 pointer-events-auto h-auto" : "translate-x-5 opacity-0 pointer-events-none h-0"} transition-all`}>Tidsrapportering</div>
  )
}
