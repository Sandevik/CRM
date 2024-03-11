import { CurrentCrmContext } from '@/context/CurrentCrmContext'
import Link from 'next/link';
import React, { useContext } from 'react'

export default function CustomerList({customers}: {customers: Customer[]}) {
    const {crm} = useContext(CurrentCrmContext);

  return (
    <div className='flex flex-col gap-1 mt-1'>
        {customers.map((customer, i) => (
            i <= 1 
            ? 
            <Link key={customer.uuid} href={`/dashboard/c/${crm?.crmUuid}/customers/${customer.uuid}`}>
                {customer.firstName}
            </Link>
            : "" 
        ))}
        {customers.length - 2 > 0 && <div>
            + {customers.length - 2}
        </div>}
    </div>
  )
}
