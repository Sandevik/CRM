import { CurrentCrmContext } from '@/context/CurrentCrmContext';
import Link from 'next/link';
import React, { useContext, useState } from 'react'
import { BsClipboard2CheckFill, BsClipboard2Fill } from "react-icons/bs";


export default function ClientRow({client}: {client: Client}) {
    const {crm} = useContext(CurrentCrmContext);
    const [hasCopied, setHasCopied] = useState<boolean>(false);
    const copyToClipBoard = (text: String | number) => {
      navigator.clipboard.writeText(text.toString());
      setHasCopied(true);
    }

  return (
    <li className="grid grid-cols-5 bg-background-light text-lg bg-opacity-60">
        <Link href={`/dashboard/c/${crm?.crmUuid}/clients/${client.uuid}`} className="p-2 pl-4 truncate">{client.firstName} {client.lastName}</Link>
        <Link href={`/dashboard/c/${crm?.crmUuid}/clients/${client.uuid}`} className="border-l-2 p-2 pl-4 border-background-light truncate">{client.email}</Link>
        <Link href={`/dashboard/c/${crm?.crmUuid}/clients/${client.uuid}`} className="border-l-2 p-2 pl-4 border-background-light truncate">{client.phoneNumber || "-"}</Link>
        <Link href={`/dashboard/c/${crm?.crmUuid}/clients/${client.uuid}`} className="border-l-2 p-2 pl-4 border-background-light truncate">{client.city}</Link>
        <Link href={`/dashboard/c/${crm?.crmUuid}/clients/${client.uuid}`} className="border-l-2 p-2 pl-4 border-background-light truncate flex gap-2 items-center">{ hasCopied ? <BsClipboard2CheckFill className="text-3xl cursor-pointer" onClick={() => copyToClipBoard(client.uuid)} /> : <BsClipboard2Fill className="text-3xl cursor-pointer" onClick={() => copyToClipBoard(client.uuid)} />} <div className="truncate">{client.uuid}</div></Link>
    </li>
  )
}
