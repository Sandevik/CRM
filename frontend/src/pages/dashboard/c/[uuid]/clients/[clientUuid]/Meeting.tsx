import React from 'react'

export default function Meeting({meeting}: {meeting: Meeting}) {
  return (
    <ul className="flex justify-between bg-background-light p-2 rounded-md">
      <li className="flex gap-6">
        <div>From {new Date(meeting.from).toLocaleDateString() + " " + new Date(meeting.from).toLocaleTimeString().substring(0, new Date(meeting.from).toLocaleTimeString().length - 3)}</div>
        <div>To {new Date(meeting.to).toLocaleDateString() + " " + new Date(meeting.to).toLocaleTimeString().substring(0, new Date(meeting.to).toLocaleTimeString().length - 3)}</div>
      </li>
      <li>Added {new Date(meeting.added).toLocaleDateString() + " " + new Date(meeting.added).toLocaleTimeString().substring(0, new Date(meeting.added).toLocaleTimeString().length - 3)}</li>
    </ul>
  )
}

