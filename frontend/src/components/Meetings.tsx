import React, { useContext } from 'react'
import MeetingCard from './MeetingCard'
import { CurrentCrmContext } from '@/context/CurrentCrmContext'
import Button from './Button';

export default function Meetings() {
  const {crm} = useContext(CurrentCrmContext);
  return (
    <aside className="w-[20%] h-[calc(100dvh - 3em)] bg-background-light bg-opacity-30 flex-shrink relative overflow-y-scroll overflow-x-hidden p-4 scrollthumb">
        <h2 className="text-xl font-semibold pb-4">{crm?.meetings?.length && crm?.meetings?.length > 0 ? "Upcoming meetings" : "No upcoming meetings"}</h2>
        <ul className="min-h-[80%] flex flex-col gap-10">
          {crm?.meetings?.map(meeting => (<MeetingCard key={meeting.clientUuid + meeting.added} meeting={meeting}/>))}
        </ul>
        <Button className="absolute bottom-3 left-[50%] translate-x-[-47%] w-[80%] z-10" onClick={()=>alert("do something")}>Add a meeting</Button>
    </aside>
  )
}
