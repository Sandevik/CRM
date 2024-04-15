import Text from '@/components/Text';
import { CurrentCrmContext } from '@/context/CurrentCrmContext';
import Link from 'next/link';
import React, { useContext, useState } from 'react'
import { BsClipboard2CheckFill, BsClipboard2Fill } from "react-icons/bs";


export default function EmployeeRow({employee}: {employee: Employee}) {
    const {crm} = useContext(CurrentCrmContext);
    const [hasCopied, setHasCopied] = useState<boolean>(false);
    const copyToClipBoard = (text: String | number) => {
      navigator.clipboard.writeText(text.toString());
      setHasCopied(true);
    }

  return (
    <li className="grid grid-cols-2 md:grid-cols-5 bg-background-light text-lg bg-opacity-60 hover:bg-background-light transition-colors">
        <Link href={`/dashboard/c/${crm?.crmUuid}/employees/${employee.uuid}`} className="p-2 pl-4 truncate">{employee.firstName} {employee.lastName}</Link>
        <Link href={`/dashboard/c/${crm?.crmUuid}/employees/${employee.uuid}`} className="border-l-2 p-2 pl-4 border-background-light truncate">{employee.email}</Link>
        <Link href={`/dashboard/c/${crm?.crmUuid}/employees/${employee.uuid}`} className="hidden md:block border-l-2 p-2 pl-4 border-background-light truncate">{employee.phoneNumber || "-"}</Link>
        <Link href={`/dashboard/c/${crm?.crmUuid}/employees/${employee.uuid}`} className="hidden md:block border-l-2 p-2 pl-4 border-background-light truncate">{employee.userUuid ? <Text text={{eng:"Yes", swe: "Ja"}} /> : <Text text={{eng: "No", swe: "Nej"}}/>}</Link>
        <Link href={`/dashboard/c/${crm?.crmUuid}/employees/${employee.uuid}`} className="hidden md:block border-l-2 p-2 pl-4 border-background-light truncate">{employee.role}</Link>
    </li>
  )
}
