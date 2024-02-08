import { CurrentCrmContext } from '@/context/CurrentCrmContext'
import Link from 'next/link';
import React, { useContext } from 'react'

export default function ClientList({clients}: {clients: Client[]}) {
    const {crm} = useContext(CurrentCrmContext);

  return (
    <div className='flex flex-col gap-1 mt-1'>
        {clients.map((client, i) => (
            i <= 1 
            ? 
            <Link key={client.uuid} href={`/dashboard/c/${crm?.crmUuid}/clients/${client.uuid}`}>
                {client.firstName}
            </Link>
            : "" 
        ))}
        {clients.length - 2 > 0 && <div>
            + {clients.length - 2}
        </div>}
    </div>
  )
}
