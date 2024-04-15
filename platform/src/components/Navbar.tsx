import Text from '@/components/Text';
import { AuthContext } from '@/context/AuthContext';
import { CurrentCrmContext } from '@/context/CurrentCrmContext'
import { MenuContext } from '@/context/MenuContext';
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import React, { useContext } from 'react'
import { FaBox, FaFileAlt, FaUserTag } from 'react-icons/fa';
import { FaIdCardClip, FaTruckFront } from 'react-icons/fa6';
import { FiLogIn } from 'react-icons/fi';
import { IoMdSettings } from 'react-icons/io';
import { IoCalendarNumber, IoCalendarSharp, IoClose } from 'react-icons/io5';
import { MdDashboard, MdOutlineSettingsSystemDaydream, MdPerson2 } from 'react-icons/md';
import { RiAdminFill, RiMenu3Fill } from 'react-icons/ri';

export default function Navbar() {
  const pathName = usePathname();
  const {crm} = useContext(CurrentCrmContext);
  const {data} = useContext(AuthContext);
  const {open, setOpen} = useContext(MenuContext);
  
  return (
    <nav className="w-full p-2 text-accent-color pr-4 sticky top-0 z-30 bg-background-light">
        {/* <BreadCrumb /> */}
        <ul className='flex justify-between items-center text-xl font-semibold overflow-x-hidden '>
            <li className='text-2xl font-bold capitalize truncate'>
              <span>{crm?.name || "Coneqt"}</span>
            </li>
            <li className={`${open ? "opacity-100 pointer-events-all" : "pointer-events-none translate-x-[15vw] opacity-0 transistion-opacity"} w-[18em] h-[calc(100dvh-3.2em)] absolute right-1 transition-all flex flex-col  top-14 bg-background-light p-5 gap-6`}>
              <IoClose className={`text-3xl absolute top-3 right-4 cursor-pointer `} onClick={() => setOpen(false)}/>
                <div className="flex flex-col justify-between h-[60%] max-w-[80%]">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-3">
                      <h2 className="font-semibold text-xl">Coneqt</h2>
                      <Link href={"/dashboard"} className={`${pathName === "/dashboard" && "z-50 text-black px-6 clippath bg-accent-color"} transition-colors hover:text-greenish flex gap-2 items-center `}> <MdOutlineSettingsSystemDaydream /> <Text text={{eng: "Your Crms", swe: "Dina Crm"}} /> </Link>
                    </div>
                    <div className="flex flex-col gap-3">
                      <Link href={`/dashboard/c/${crm?.crmUuid}`} className={`${pathName?.split("/").length === 4 && "z-50 text-black px-6 clippath bg-accent-color"} transition-colors hover:text-greenish flex gap-2 items-center`}><MdDashboard /><Text text={{swe:"Panel", eng: "Dashboard"}}/></Link>
                      <Link href={`/dashboard/c/${crm?.crmUuid}/calendar`} className={`${(/.+\/calendar.*/).test(pathName) && "z-50 text-black px-6 clippath bg-accent-color"} transition-colors hover:text-greenish flex gap-2 items-center mb-6`}><IoCalendarNumber /><Text text={{swe: "Kalender", eng: "Calendar"}} /></Link>
                      <Link href={`/dashboard/c/${crm?.crmUuid}/schedule`} className={`${(/.+\/schedule/).test(pathName) && "z-50 text-black px-6 clippath bg-accent-color"} transition-colors hover:text-greenish flex gap-2 items-center `}><IoCalendarSharp /><Text text={{swe: "Scheman", eng: "Schedule"}} /></Link>
                      <Link href={`/dashboard/c/${crm?.crmUuid}/employees`} className={`${(/.+\/employees.*/).test(pathName) && "z-50 text-black px-6 clippath bg-accent-color"} transition-colors hover:text-greenish flex gap-2 items-center`}><FaIdCardClip /><Text text={{swe: "Anställda", eng: "Employees"}} /></Link>
                      <Link href={`/dashboard/c/${crm?.crmUuid}/customers`} className={`${(/.+\/customers.*/).test(pathName) && "z-50 text-black px-6 clippath bg-accent-color"} transition-colors hover:text-greenish flex gap-2 items-center mb-6`}><FaUserTag /><Text text={{swe: "Kunder", eng: "Customers"}}/></Link>
                      <Link href={`/dashboard/c/${crm?.crmUuid}/vehicles`} className={`${(/.+\/vehicles.*/).test(pathName) && "z-50 text-black px-6 clippath bg-accent-color"} transition-colors hover:text-greenish flex gap-2 items-center `}><FaTruckFront /><Text text={{swe: "Fordon", eng: "Vehicles"}} /></Link>
                      <Link href={`/dashboard/c/${crm?.crmUuid}/storage`} className={`${(/.+\/storage.*/).test(pathName) && "z-50 text-black px-6 clippath bg-accent-color"} transition-colors hover:text-greenish flex gap-2 items-center `}><FaBox /><Text text={{swe: "Lager", eng: "Storage"}} /></Link>
                      <Link href={`/dashboard/c/${crm?.crmUuid}/files`} className={`${(/.+\/files.*/).test(pathName) && "z-50 text-black px-6 clippath bg-accent-color"} transition-colors hover:text-greenish flex gap-2 items-center `}><FaFileAlt /><Text text={{swe: "Filer", eng: "Files"}} /></Link>
                      {data?.user?.admin && <Link href={"/dashboard/admin"} className={`${(/.+\/admin.*/).test(pathName) && "z-50 text-black px-6 clippath bg-accent-color"} transition-colors hover:text-greenish flex gap-2 items-center `}> <RiAdminFill /> Admin </Link> }
                    </div>
                  </div>
                  
                </div>
                  <div className='absolute bottom-4 flex flex-col gap-3'>
                {!data?.user && <Link href={"/sign-in"} className={`${(/.+\/sign-in.*/).test(pathName) && "z-50 text-black px-4 clippath bg-accent-color"} transition-colors hover:text-greenish flex gap-2 items-center `}><FiLogIn /><Text text={{eng: "Sign In", swe: "Logga In"}} /> </Link>}
              {data?.user && <Link href={"/account"} className={`${(/.+\/account.*/).test(pathName) && "z-50 text-black px-4 clippath bg-accent-color"} transition-colors hover:text-greenish flex gap-2 items-center `}> <MdPerson2 /> <Text text={{eng: "Account", swe: "Konto"}} /></Link>}
                    
                    <Link href={`/dashboard/c/${crm?.crmUuid}/settings`} className={`${(/.+\/settings.*/).test(pathName) && "z-50 text-black px-4 clippath bg-accent-color"} transition-colors hover:text-greenish flex gap-2 items-center `}><IoMdSettings /><Text text={{swe: "Inställningar", eng: "Settings"}} /></Link>
                    <Link href={"/help"} className={`${(/.+\/help.*/).test(pathName) && "z-50 text-black px-4 clippath bg-accent-color"} transition-colors hover:text-greenish flex gap-2 items-center `}> <MdOutlineSettingsSystemDaydream /> <Text text={{eng: "Help", swe: "Hjälp"}} /> </Link>
                  </div>
            </li>
            <li><RiMenu3Fill className={`text-3xl ${open ? "opacity-0 pointer-events-none" : "opacity-100 pointer-events-auto"} transition-opacity cursor-pointer`} onClick={() => setOpen(!open)} /></li>
        </ul>
    </nav>
  )
}
