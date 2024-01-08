import Link from 'next/link'
import React, { useContext } from 'react'
import { MdDashboard } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";
import { IoMdHelp } from "react-icons/io";
import { MdPerson2 } from "react-icons/md";
import { AuthContext } from '@/context/AuthContext';

export default function Navbar() {
    const {data} = useContext(AuthContext);

  return (
    <nav className="h-[3em] bg-[var(--blue)] z-10 flex justify-between items-center px-4">
        <span className="font-bold text-2xl">CRM</span>
        <ul className='flex gap-8 items-center '>
            <li><Link href={"/dashboard"} className='flex items-center gap-1 text-[var(--dark-green)] hover:text-[var(--pink)] transition-colors'> <MdDashboard /> Dashboard </Link></li>
            <li>
                {data?.user ? 
                <Link href={"/account"} className='flex items-center gap-1 text-[var(--dark-green)] hover:text-[var(--pink)] transition-colors'> <MdPerson2 /> Account</Link> :
                <Link href={"/sign-in"} className='flex items-center gap-1 text-[var(--dark-green)] hover:text-[var(--pink)] transition-colors'>Sign in <FiLogIn /> </Link>
            }
            </li>
            <li className='flex items-center gap-1 text-[var(--dark-green)] hover:text-[var(--pink)] transition-colors'> <IoMdHelp /> Help </li>
        </ul>
    </nav>
  )
}
