import React from 'react'

export default function ClientRowHeading() {
  return (
    <li className="grid grid-cols-2 md:grid-cols-5 bg-background-light text-lg bg-opacity-60">
        <div className="border-l-2 p-2 pl-4 border-background-light truncate">Name</div>
        <div className="border-l-2 p-2 pl-4 border-background-light truncate">Email</div>
        <div className="hidden md:block border-l-2 p-2 pl-4 border-background-light truncate">Phone number</div>
        <div className="hidden md:block border-l-2 p-2 pl-4 border-background-light truncate">City</div>
        <div className="hidden md:block border-l-2 p-2 pl-4 border-background-light truncate">Uuid</div>
    </li>
  )
}
