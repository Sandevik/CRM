import Link from 'next/link'
import React from 'react'

export default function Navbar({crmName}: {crmName: string | undefined}) {
  return (
    <nav className="w-full ">
        <ul className='flex justify-between text-xl font-semibold'>
            <li className='text-2xl font-bold'>{crmName}</li>
            <li className="flex gap-8">
                <Link href="#" className="hover:text-orange-400">Calendar</Link>
                <Link href="#" className="hover:text-orange-400">Clients</Link>
                <Link href="#" className="hover:text-orange-400">Archive</Link>
                <Link href="#" className="hover:text-orange-400">Services</Link>
                <Link href="#" className="hover:text-orange-400">Settings</Link>
            </li>
        </ul>
    </nav>
  )
}
