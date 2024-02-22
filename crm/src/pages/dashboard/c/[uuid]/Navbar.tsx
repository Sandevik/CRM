import BreadCrumb from '@/components/BreadCrumb';
import { CurrentCrmContext } from '@/context/CurrentCrmContext'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React, { useContext } from 'react'

export default function Navbar() {
  const pathName = usePathname();
  const {crm} = useContext(CurrentCrmContext);
  
  return (
    <nav className="w-full p-2 text-light-blue border-b-2 border-background-light pr-4 sticky top-12 bg-background-dark">
        {/* <BreadCrumb /> */}
        <ul className='flex justify-between items-center text-xl font-semibold'>
            <li className='text-2xl font-bold capitalize truncate'>
              <span>{crm?.name}</span>
            </li>
            <li className="flex gap-8 items-center text-lg">
                <Link href={`/dashboard/c/${crm?.crmUuid}`} className={`${pathName?.split("/").length === 4 && "text-black px-2 clippath bg-light-blue"} transition-colors hover:text-greenish`}>Dashboard</Link>
                <Link href={`/dashboard/c/${crm?.crmUuid}/calendar`} className={`${(/.+\/calendar.*/).test(pathName) && "text-black px-2 clippath bg-light-blue"} transition-colors hover:text-greenish `}>Calendar</Link>
                <Link href={`/dashboard/c/${crm?.crmUuid}/clients`} className={`${(/.+\/clients.*/).test(pathName) && "text-black px-2 clippath bg-light-blue"} transition-colors hover:text-greenish `}>Clients</Link>
                <Link href={`/dashboard/c/${crm?.crmUuid}`} className={`${(/.+\/employees.*/).test(pathName) && "text-black px-2 clippath bg-light-blue"} transition-colors hover:text-greenish `}>Employees</Link>
                <Link href={`/dashboard/c/${crm?.crmUuid}`} className={`${(/.+\/deals.*/).test(pathName) && "text-black px-2 clippath bg-light-blue"} transition-colors hover:text-greenish `}>Deals</Link>
                <Link href={`/dashboard/c/${crm?.crmUuid}/settings`} className={`${(/.+\/settings.*/).test(pathName) && "text-black px-2 clippath bg-light-blue"} transition-colors hover:text-greenish `}>Settings</Link>
            </li>
        </ul>
    </nav>
  )
}
