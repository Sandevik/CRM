
import Button from '@/components/Button';
import React, { useEffect, useState } from 'react'
import { FaChevronRight } from "react-icons/fa6";


export default function Entry({entry}: {entry: Entry}) {
    const [expand, setExpand] = useState<boolean>(false);
    const [editing, setEditing] = useState<boolean>(false);
    const [currentContent, setCurrentContent] = useState<string>(entry.content || "");

    const onSaved = () => {

    }

    useEffect(()=>{
        setCurrentContent(entry.content || "");
    },[entry])

  return (
    <div onClick={()=>!expand && setExpand(!expand)} className={` ${expand ? " cursor-default" : "min-h-20 cursor-pointer"} transition-all relative bg-background-light rounded-md p-2`}>
        <span className=""><FaChevronRight onClick={() => expand && setExpand(false)} className={`${!expand ? "rotate-0 top-[50%] -translate-y-[50%]" : "rotate-90 top-3 translate-y-0 cursor-pointer"} transition-all absolute `}/></span>
        <div onClick={() => expand && setExpand(false)} className={`${!expand ? "top-[1.7em]" : "top-2 cursor-pointer"} ml-6 absolute transition-all grid grid-cols-5 w-full items-center gap-8`}>
            <div className="flex gap-2 truncate">
                <span>Added</span>
                <span>{entry.added}</span>
            </div>
            <div className="flex gap-2 truncate">
                <span>Updated</span>
                <span>{entry.updated}</span>
            </div>
            <div className="flex gap-2 truncate">
                <span>Meeting</span>
                <span className="truncate">{entry.addedAtMeeting || "-"}</span>
            </div>
            <span className={`${!expand ? "opacity-100" : "opacity-0"} " truncate w-32`}>{currentContent}</span>
        </div>
        <div className="absolute top-1 right-2">
            <button onClick={() => setEditing(!editing)}>{currentContent !== entry.content ? "Save" : editing ? "Close" : "Edit"}</button>
        </div>
        <textarea value={currentContent || ""} disabled={!editing} onChange={(e) => setCurrentContent(e.target.value)} className={`${expand ? "opacity-100 pointer-events-auto h-52 overflow-y-scroll" : "opacity-0 pointer-events-none h-0 overflow-y-hidden"} ${editing ? "ring-background-dark" : "ring-transparent"}  scrollthumb resize-none ring-2 transition-all rounded-md relative p-2 mt-8  bg-background-light text-white  w-full `}></textarea>
    </div>
  )
}
