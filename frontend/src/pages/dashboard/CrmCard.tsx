import Link from 'next/link'
import React from 'react'

export default function CrmCard({crm}: {crm: Crm}) {
  return (
    <Link href={`/dashboard/c/${crm.crmUuid}`} className='h-[128px] bg-[var(--dark-green)] text-[var(--light-green)] rounded flex flex-col p-2 justify-between'>
          <span className="text-xl capitalize">{crm.name}</span>
          <div className="text-sm flex justify-between"><span>Created: </span> <span>{new Date(crm.added).toLocaleString()}</span></div>
    </Link>
  )
}
