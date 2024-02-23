import React from 'react'
import Meeting from './Meeting'
import Text from '@/components/Text'

export default function Meetings({meetings, setEditMeeting, refetchMeetings}: {meetings: Meeting[], refetchMeetings: () => Promise<void>, setEditMeeting: React.Dispatch<React.SetStateAction<Meeting | null>>}) {
  return (
    <div className="flex flex-col gap-4 overflow-y- overflow-x-hidden scroll h-[calc(100dvh-16em)] scrollthumb pr-4">
        {meetings.map(meeting => <Meeting refetchMeetings={refetchMeetings} setEditMeeting={setEditMeeting} key={meeting.uuid} meeting={meeting}/>)}
        {meetings.length < 1 && <div><Text text={{eng: "No meetings found", swe: "Inga möten hittades"}} /></div> }
    </div>
  )
}
