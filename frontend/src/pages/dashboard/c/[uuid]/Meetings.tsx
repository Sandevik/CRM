import React, { useContext } from 'react'
import MeetingCard from './MeetingCard'
import { CurrentCrmContext } from '@/context/CurrentCrmContext'

export default function Meetings() {
  const {crm} = useContext(CurrentCrmContext);
  return (
    <aside className="w-[20%] h-full bg-background-light bg-opacity-30 flex-shrink  overflow-y-scroll overflow-x-hidden p-4 scrollthumb">
        <h2 className="text-xl font-semibold pb-4">Upcoming meetings</h2>
        <ul >
          {crm?.meetings?.map(meeting => (<MeetingCard key={meeting.clientUuid + meeting.added} meeting={meeting}/>))}
        </ul>
    </aside>
  )
}
