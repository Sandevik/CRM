
import React, { useState } from 'react'
import { FaChevronRight } from "react-icons/fa6";


export default function Entry({entry}: {entry: Entry}) {
    const [expand, setExpand] = useState<boolean>(false);


  return (
    <div onClick={()=>setExpand(!expand)} className={` ${expand ? "min-h-32" : "min-h-20"} transition-all relative bg-background-light rounded-md p-2 cursor-pointer`}>
        <span className=""><FaChevronRight className={`${!expand ? "rotate-0 top-[50%] -translate-y-[50%]" : "rotate-90 top-2 trnaslate-y-0"} transition-all absolute `}/></span>
        <div className={`${!expand ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} ml-6 absolute top-0 transition-opacity grid grid-cols-5 w-[60%] h-full items-center gap-8`}>
            <span>{entry.added}</span>
            <span>{entry.updated}</span>
            <span>{entry.addedAtMeeting || "Not added at meeting"}</span>
            <span className="truncate w-32">{entry.content}</span>
        </div>
        <div className={`${expand ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} transition-opacity mt-6 ml-6`}>
            {entry.content}
        </div>
    </div>
  )
}
