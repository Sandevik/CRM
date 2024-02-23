import Link from 'next/link'
import React, { useContext } from 'react'
import { MdDashboard } from "react-icons/md";
import { FiLogIn } from "react-icons/fi";
import { IoMdHelp } from "react-icons/io";
import { MdPerson2 } from "react-icons/md";
import { RiAdminFill } from "react-icons/ri";
import { AuthContext } from '@/context/AuthContext';
import Text from './Text';

export default function Navbar() {
    const {data} = useContext(AuthContext);

  return (
    <nav className="h-[3em] bg-background-light z-10 text-light-blue flex justify-between items-center px-4 sticky top-0">
        <span className="font-bold text-2xl">Zentre</span>
        <ul className='flex gap-8 items-center '>
            <li><Link href={"/dashboard"} className='flex items-center gap-1 text-light-blue hover:text-light-red transition-colors'> <MdDashboard /> <Text text={{eng: "All Crms", swe: "Alla Crm"}} /> </Link></li>
            <li><Link href={"/dashboard/admin"} className='flex items-center gap-1 text-light-blue hover:text-light-red transition-colors'> <RiAdminFill /> Admin </Link></li>
            <li>
                {data?.user ? 
                <Link href={"/account"} className='flex items-center gap-1 text-light-blue hover:text-light-red transition-colors'> <MdPerson2 /> <Text text={{eng: "Account", swe: "Konto"}} /></Link> :
                <Link href={"/sign-in"} className='flex items-center gap-1 text-light-blue hover:text-light-red transition-colors'><Text text={{eng: "Sign In", swe: "Logga In"}} /><FiLogIn /> </Link>
            }
            </li>
            <li className='flex items-center gap-1 text-light-blue hover:text-light-red transition-colors'> <IoMdHelp /> <Text text={{eng: "Help", swe: "Hjälp"}} /> </li>
        </ul>
    </nav>
  )
}
