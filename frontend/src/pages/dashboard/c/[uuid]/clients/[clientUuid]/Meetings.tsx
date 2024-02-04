import React from 'react'
import Meeting from './Meeting'

export default function Meetings({meetings}: {meetings: Meeting[]}) {
  return (
    <div className="flex flex-col gap-4 overflow-y- overflow-x-hidden scroll h-[calc(100dvh-16em)] scrollthumb pr-4">
        {meetings.map(meeting => <Meeting key={meeting.uuid} meeting={meeting}/>)}
        {meetings.length < 1 && <div>No meetings found</div> }
    </div>
  )
}
