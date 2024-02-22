import Link from 'next/link'
import React from 'react'

export default function CrmCard({crm}: {crm: Crm}) {
  return (
    <Link href={`/dashboard/c/${crm.crmUuid}`} className='h-[128px] bg-background-light text-light-blue hover:text-background-dark hover:bg-light-purple transition-colors rounded flex flex-col p-2 justify-between'>
          <span className="text-xl capitalize font-semibold">{crm.name}</span>
          <div className="text-sm flex justify-between">
            <span>Created</span>
            <span>{new Date(crm.added).toLocaleDateString()}</span>
          </div>
    </Link>
  )
}
