import Text from '@/components/Text'
import React from 'react'

export default function CustomerRowHeading() {
  return (
    <li className="grid grid-cols-2 md:grid-cols-5 bg-background-light text-lg bg-opacity-60">
        <div className="border-l-2 p-2 pl-4 border-background-light truncate"><Text text={{eng: "Name", swe: "Namn"}} /></div>
        <div className="border-l-2 p-2 pl-4 border-background-light truncate">Email</div>
        <div className="hidden md:block border-l-2 p-2 pl-4 border-background-light truncate"><Text text={{eng: "Phone number", swe: "Telefonnummer"}} /></div>
        <div className="hidden md:block border-l-2 p-2 pl-4 border-background-light truncate"><Text text={{eng: "City", swe: "Stad"}} /></div>
        <div className="hidden md:block border-l-2 p-2 pl-4 border-background-light truncate"><Text text={{eng: "Company", swe: "Företag"}}/></div>
    </li>
  )
}
