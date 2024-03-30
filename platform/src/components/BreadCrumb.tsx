import { CurrentCrmContext } from '@/context/CurrentCrmContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import React, { useContext } from 'react'
import { MdChevronRight } from "react-icons/md";

export default function BreadCrumb() {
    const {crm} = useContext(CurrentCrmContext);
    const pathName = usePathname();

    const parsePathNames = (pathName?: string) => {
        let list = pathName?.split("/").filter(part => part !== "");
        const indexOfC = list?.indexOf("c");
        list = list?.filter((part, index) => index !== indexOfC);
        list = list?.filter((part, index) => index !== indexOfC);
        
        return list;
    }




  return (
    <ul className='flex gap-2 text-sm capitalize'>
        {parsePathNames(pathName)?.map((part, index) => (
        <li key={part} className="flex items-center">
            {index !== 0 && <MdChevronRight className="text-lg"/>}
            <Link  href="#">{part}</Link>
        </li>
        ))}
    </ul>
  )
}
