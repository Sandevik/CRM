import Link from 'next/link'
import React from 'react'
import { MdDashboard } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";
import { IoMdHelp } from "react-icons/io";

export default function Navbar() {
  return (
    <nav className="h-[3em] bg-[var(--blue)] z-10 flex justify-between items-center px-4">
        <span className="font-bold text-2xl">CRM</span>
        <ul className='flex gap-8 items-center '>
            <li><Link href={"/dashboard"} className='flex items-center gap-1 text-[var(--dark-green)] hover:text-[var(--pink)] transition-colors'> <MdDashboard /> Dashboard </Link></li>
            <li className='flex items-center gap-1 text-[var(--dark-green)] hover:text-[var(--pink)] transition-colors'>Help <IoMdHelp /></li>
            <li><Link href={"/sign-in"} className='flex items-center gap-1 text-[var(--dark-green)] hover:text-[var(--pink)] transition-colors'> Sign in <FiLogIn /> </Link></li>
        </ul>
    </nav>
  )
}
