import { CurrentCrmContext } from '@/context/CurrentCrmContext'
import Link from 'next/link'
import React, { useContext } from 'react'

export default function Navbar() {
  const {crm} = useContext(CurrentCrmContext);
  
  return (
    <nav className="w-full p-2">
        <ul className='flex justify-between text-xl font-semibold'>
            <li className='text-2xl font-bold'>{crm?.name}</li>
            <li className="flex gap-8">
                <Link href="#" className="hover:text-orange-400">Calendar</Link>
                <Link href={`${crm?.crmUuid}/clients`} className="hover:text-orange-400">Clients</Link>
                <Link href="#" className="hover:text-orange-400">Archive</Link>
                <Link href="#" className="hover:text-orange-400">Services</Link>
                <Link href="#" className="hover:text-orange-400">Settings</Link>
            </li>
        </ul>
    </nav>
  )
}
