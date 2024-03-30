import React, { useContext, useEffect, useState } from 'react'
import MeetingCard from './MeetingCard'
import { CurrentCrmContext } from '@/context/CurrentCrmContext'
import Button from './Button';
import AddMeeting from './AddMeeting';
import request from '@/utils/request';

export default function Meetings() {
  const {crm} = useContext(CurrentCrmContext);
  const [meetings, setMeetings] = useState<Meeting[]>([])
  const [popupActive, setPopupActive] = useState<boolean>(false);

  useEffect(()=>{
    setMeetings(crm?.meetings || []);
  },[crm])


  const refetchMeetings = async () => {
    if (crm?.crmUuid) {
      const res = await request<Meeting[]>(`/meetings/upcoming?crmUuid=${crm?.crmUuid}`, {}, "GET");
      if (res.code === 200) {
        setMeetings(res.data || []);
      }
    }
  }


  return (
    <aside className="w-[20%] h-[calc(100dvh - 3em)] bg-background-light bg-opacity-30 flex-shrink relative overflow-y-scroll overflow-x-hidden p-4 scrollthumb">
        <h2 className="text-xl font-semibold pb-4">{crm?.meetings?.length && crm?.meetings?.length > 0 ? "Upcoming meetings" : "No upcoming meetings"}</h2>
        <ul className="min-h-[80%] flex flex-col gap-10">
          {meetings.map(meeting => (<MeetingCard refetchMeetings={refetchMeetings} key={meeting.customerUuid + meeting.added} meeting={meeting}/>))}
        </ul>
        <Button className="absolute bottom-3 left-[50%] translate-x-[-47%] w-[80%] z-10" onClick={()=>setPopupActive(true)}>Add a meeting</Button>
        <AddMeeting onSuccessfulSubmit={refetchMeetings} active={popupActive} closePopup={() => setPopupActive(false)}/>
    </aside>
  )
}
