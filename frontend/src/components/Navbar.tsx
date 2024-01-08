import Link from 'next/link'
import React from 'react'

export default function Navbar() {
  return (
    <nav className="h-[3em] bg-[var(--blue)] z-10 flex justify-between items-center px-4">
        <span className="font-bold text-2xl">CRM</span>
        <ul className='flex gap-8 items-center '>
            <li>Dashboard</li>
            <li>Help</li>
            <li><Link href={"/sign-in"}>Sign in</Link></li>
        </ul>
    </nav>
  )
}
