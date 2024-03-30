
import Button from '@/components/Button';
import { CurrentCrmContext } from '@/context/CurrentCrmContext';
import request from '@/utils/request';
import React, { useContext, useEffect, useState } from 'react'
import { FaChevronRight } from "react-icons/fa6";
import { FaPen, FaTrash } from "react-icons/fa";
import Text from '@/components/Text';


export default function Entry({entry, customer, refetchEntries}: {entry: Entry, customer: Customer | null, refetchEntries: () => Promise<void>}) {
    const {crm} = useContext(CurrentCrmContext);
    const [initialEntry, setInitialEntry] = useState<Entry>(entry);
    const [expand, setExpand] = useState<boolean>(false);
    const [editing, setEditing] = useState<boolean>(false);
    const [currentContent, setCurrentContent] = useState<string>(initialEntry.content || "");


    const removeEntry = async () => {
        let answer = prompt("Are you sure you want to remove this entry? Write \"yes\"");
        if (answer === "yes"){
            if (crm?.crmUuid) {
                let res = await request(`/entries?crmUuid=${crm.crmUuid}&id=${initialEntry.id}`, {}, "DELETE");
                if (res.code === 200) {
                    await refetchEntries();
                }
            }
        }
    }

    const handleSave = async () => {
        if (currentContent !== initialEntry.content){
            await uploadChanges();
            setInitialEntry({...initialEntry, content: currentContent, updated: new Date().toLocaleDateString()});
        }
        setEditing(!editing)
    }

    const uploadChanges = async () => {
        if (crm?.crmUuid && customer?.uuid && entry.id){
            let res = await request(`/entries?crmUuid=${crm.crmUuid}&customerUuid=${customer.uuid}&id=${entry.id}`, {...initialEntry, content: currentContent}, "PUT") 
            if (res.code === 200) {
                //console.log(res.message);
            }
        }
    }

    useEffect(()=>{
        setCurrentContent(initialEntry.content || "");
    },[initialEntry])

  return (
    <div onClick={()=>!expand && setExpand(!expand)} className={` ${expand ? " cursor-default" : "min-h-20 cursor-pointer"} transition-all relative bg-background-light rounded-md p-2`}>
        <span className=""><FaChevronRight onClick={() => expand && setExpand(false)} className={`${!expand ? "rotate-0 top-[50%] -translate-y-[50%]" : "rotate-90 top-3 translate-y-0 cursor-pointer"} transition-all absolute `}/></span>
        <div onClick={() => expand && setExpand(false)} className={`${!expand ? "top-[1.7em]" : "top-2 cursor-pointer"} ml-6 absolute transition-all grid grid-cols-5 w-full items-center gap-8`}>
            <div className="flex gap-2 truncate">
                <span><Text text={{eng: "Added", swe: "Tillagd"}} /></span>
                <span>{entry.added ? new Date(entry.added).toLocaleDateString() : ""}</span>
            </div>
            <div className="flex gap-2 truncate">
                <span><Text text={{eng: "Updated", swe: "Uppdaterad"}} /></span>
                <span>{entry.updated ? new Date(entry.updated).toLocaleDateString() : ""}</span>
            </div>
            <div className="flex gap-2 truncate">
                <span><Text text={{eng: "Meeting", swe: "Möte"}} /></span>
                <span className="truncate">{entry.addedAtMeeting || "-"}</span>
            </div>
            <span className={`${!expand ? "opacity-100" : "opacity-0"} " truncate w-32`}>{currentContent}</span>
        </div>
        <div className={`absolute right-2 flex gap-5 ${!expand ? "top-[1.7em]" : "top-2 cursor-pointer"}`}>
            <button onClick={() => removeEntry()} className="flex gap-2 items-center hover:text-light-red"> <FaTrash /> <Text text={{eng: "Remove", swe: "Ta bort"}} /> </button>
            <button onClick={() => handleSave()} className="flex gap-2 items-center hover:text-light-blue" >< FaPen /> {currentContent !== initialEntry.content ? <Text text={{eng: "Save", swe: "Spara"}} /> : editing ? <Text text={{eng: "Close", swe: "Stäng"}} /> : <Text text={{eng: "Edit", swe: "Ändra"}} />}</button>
        </div>
        <textarea value={currentContent || ""} disabled={!editing} onChange={(e) => setCurrentContent(e.target.value)} className={`${expand ? "opacity-100 pointer-events-auto h-52 overflow-y-scroll" : "opacity-0 pointer-events-none h-0 overflow-y-hidden"} ${editing ? "ring-background-dark" : "ring-transparent"}  scrollthumb resize-none ring-2 transition-all rounded-md relative p-2 mt-8  bg-background-light text-white  w-full `}></textarea>
    </div>
  )
}
