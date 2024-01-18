import React, { useContext } from 'react'
import MeetingCard from './MeetingCard'
import { CurrentCrmContext } from '@/context/CurrentCrmContext'

export default function Meetings() {
  const {crm} = useContext(CurrentCrmContext);
  return (
    <aside className="w-[20%] bg-gray-400 flex-shrink h-full overflow-scroll overflow-x-hidden p-2">
        <h2 className="text-xl font-semibold pb-4">Upcoming meetings</h2>
        <ul className="">
          {crm?.meetings?.map(meeting => (<MeetingCard key={meeting.clientUuid + meeting.added} meeting={meeting}/>))}
        </ul>
    </aside>
  )
}
