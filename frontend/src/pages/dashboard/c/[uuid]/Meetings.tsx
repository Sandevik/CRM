import React from 'react'
import MeetingCard from './MeetingCard'

export default function Meetings({meetings, crmUuid}: {meetings: Meeting[] | undefined, crmUuid: string | undefined}) {
  return (
    <aside className="w-[20%] bg-gray-400 flex-shrink h-full overflow-scroll overflow-x-hidden p-2">
        <h2 className="text-xl font-semibold pb-4">Upcoming meetings</h2>
        <ul className="">
          {meetings?.map(meeting => (<MeetingCard key={meeting.clientUuid + meeting.added} crmUuid={crmUuid} meeting={meeting}/>))}
        </ul>
    </aside>
  )
}
