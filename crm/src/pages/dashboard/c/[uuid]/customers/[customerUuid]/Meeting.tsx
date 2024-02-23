import Text from '@/components/Text';
import { CurrentCrmContext } from '@/context/CurrentCrmContext';
import request from '@/utils/request';
import React, { useContext } from 'react'
import { FaPen, FaTrash } from "react-icons/fa";


export default function Meeting({meeting, setEditMeeting, refetchMeetings}: {meeting: Meeting, refetchMeetings: () => Promise<void>, setEditMeeting: React.Dispatch<React.SetStateAction<Meeting | null>>}) {
  const {crm} = useContext(CurrentCrmContext);
  const removeMeeting = async () => {
    if (crm?.crmUuid) {
      let res = await request(`/meetings?crmUuid=${crm.crmUuid}&uuid=${meeting.uuid}`, {}, "DELETE");
      if (res.code === 200) {
        refetchMeetings();
      }
    }
  }
  
  return (
    <ul className="flex justify-between bg-background-light p-2 rounded-md">
      <li className="flex gap-6">
        <div><Text text={{eng: "From", swe: "Från"}} /> {new Date(meeting.from).toLocaleDateString() + " " + new Date(meeting.from).toLocaleTimeString().substring(0, new Date(meeting.from).toLocaleTimeString().length - 3)}</div>
        <div><Text text={{eng: "To", swe: "Till"}} /> {new Date(meeting.to).toLocaleDateString() + " " + new Date(meeting.to).toLocaleTimeString().substring(0, new Date(meeting.from).toLocaleTimeString().length - 3)}</div>
      </li>
      <li className="flex gap-6">
        <div><Text text={{eng: "Added", swe: "Tillagd"}} /> {new Date(meeting.added).toLocaleDateString() + " " + new Date(meeting.added).toLocaleTimeString().substring(0, new Date(meeting.added).toLocaleTimeString().length - 3)}</div>
        <button onClick={() => setEditMeeting(meeting)} className="hover:text-light-blue flex gap-1 items-center"><FaPen/> <Text text={{eng: "Edit", swe: "Ändra"}} /></button>
        <button onClick={() => removeMeeting()} className="hover:text-light-red flex gap-1 items-center"><FaTrash/><Text text={{eng: "Remove", swe: "Ta bort"}} /></button>
      </li>
    </ul>
  )
}

