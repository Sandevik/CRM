import Link from 'next/link'
import React, { useContext } from 'react'
import { MdDashboard } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";
import { IoMdHelp } from "react-icons/io";
import { MdPerson2 } from "react-icons/md";
import { RiAdminFill } from "react-icons/ri";
import { AuthContext } from '@/context/AuthContext';

export default function Navbar() {
    const {data} = useContext(AuthContext);

  return (
    <nav className="h-[3em] bg-background-light z-10 text-light-blue flex justify-between items-center px-4">
        <span className="font-bold text-2xl">CRM</span>
        <ul className='flex gap-8 items-center '>
            <li><Link href={"/dashboard"} className='flex items-center gap-1 text-light-blue hover:text-light-red transition-colors'> <MdDashboard /> All Crms </Link></li>
            <li><Link href={"/dashboard/admin"} className='flex items-center gap-1 text-light-blue hover:text-light-red transition-colors'> <RiAdminFill /> Admin </Link></li>
            <li>
                {data?.user ? 
                <Link href={"/account"} className='flex items-center gap-1 text-light-blue hover:text-light-red transition-colors'> <MdPerson2 /> Account</Link> :
                <Link href={"/sign-in"} className='flex items-center gap-1 text-light-blue hover:text-light-red transition-colors'>Sign in <FiLogIn /> </Link>
            }
            </li>
            <li className='flex items-center gap-1 text-light-blue hover:text-light-red transition-colors'> <IoMdHelp /> Help </li>
        </ul>
    </nav>
  )
}
