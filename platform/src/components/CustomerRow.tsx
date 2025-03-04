import { CurrentCrmContext } from '@/context/CurrentCrmContext';
import Link from 'next/link';
import React, { useContext, useState } from 'react'
import { BsClipboard2CheckFill, BsClipboard2Fill } from "react-icons/bs";


export default function CustomerRow({customer}: {customer: Customer}) {
    const {crm} = useContext(CurrentCrmContext);
    const [hasCopied, setHasCopied] = useState<boolean>(false);
    const copyToClipBoard = (text: String | number) => {
      navigator.clipboard.writeText(text.toString());
      setHasCopied(true);
    }

  return (
    <li className="grid grid-cols-2 md:grid-cols-5 bg-background-dark text-lg bg-opacity-60 border border-background-light rounded-md hover:bg-background-light transition-colors">
        <Link href={`/dashboard/c/${crm?.crmUuid}/customers/${customer.uuid}`} className="p-2 pl-4 truncate">{customer.firstName} {customer.lastName}</Link>
        <Link href={`/dashboard/c/${crm?.crmUuid}/customers/${customer.uuid}`} className=" p-2 pl-4 border-background-light truncate">{customer.email}</Link>
        <Link href={`/dashboard/c/${crm?.crmUuid}/customers/${customer.uuid}`} className="hidden md:block  p-2 pl-4 border-background-light truncate">{customer.phoneNumber || "-"}</Link>
        <Link href={`/dashboard/c/${crm?.crmUuid}/customers/${customer.uuid}`} className="hidden md:block  p-2 pl-4 border-background-light truncate">{customer.city}</Link>
        <div className=" p-2 pl-4 border-background-light truncate gap-2 items-center hidden md:flex"> <div className="truncate">{customer.company || "-"}</div></div>
    </li>
  )
}
