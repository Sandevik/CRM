import { CurrentCrmContext } from '@/context/CurrentCrmContext';
import Link from 'next/link';
import { usePathname } from 'next/navigation'
import React, { useContext } from 'react'
import { MdChevronRight } from "react-icons/md";
import Text from './Text';

export default function BreadCrumb() {
    const {crm} = useContext(CurrentCrmContext);
    const pathName = usePathname();

    const parsePathNames = (pathName?: string): string[] => {
        let list = pathName?.split("/").filter(part => part !== "");
        const indexOfC = list?.indexOf("c");
        list = list?.filter((part, index) => index !== indexOfC);
        list = list?.filter((part, index) => index !== indexOfC);
        
        return list || [];
    }

    const matchPart = (part: string): React.JSX.Element | null => {
      switch (part) {
        case "customers":
          return <Text text={{swe: "kunder", eng: "customers"}}/>
        case "dashboard":  
          return <Text text={{swe: "panel", eng: "dashboard"}}/>
        case "employees":
          return <Text text={{swe: "anställda", eng: "employees"}}/>
        case "schedule":
          return <Text text={{swe: "schema", eng: "schedule"}}/>
        case "vehicles":
          return <Text text={{swe: "fordon", eng: "vehicles"}}/>
        case "inventory":
          return <Text text={{swe: "lager", eng: "inventory"}}/>
        case "files":
          return <Text text={{swe: "filer", eng: "files"}}/>
        case "admin":
          return <Text text={{swe: "admin", eng: "admin"}}/>
        case "calendar":
          return <Text text={{swe: "kalender", eng: "calendar"}}/>
        case "c":
          return null;
        
          
        default:
          /* if (part.length === 36) return null; */
          return <Text text={{eng: part, swe: part}}/>
      }
    }

  return (
    <ul className='flex items-center translate-y-[2px]'>
        {pathName?.split("/")?.map((part, index) => (
          matchPart(part) != null && index !== 3 && <li key={part} className="flex items-center text-[18px] gap-1 font-normal">
            {index !== 0 && <MdChevronRight className="text-xl ml-1"/>}
            <Link href={pathName === "/dashboard" ? "/dashboard" : pathName?.split("/").filter((_, i) => index > i-1).join("/") === "/dashboard" ? `/dashboard/c/${crm?.crmUuid}` : pathName?.split("/").filter((_, i) => index > i-1).join("/")}>{matchPart(part)}</Link>
        </li>
        ))}
    </ul>
  )
}
