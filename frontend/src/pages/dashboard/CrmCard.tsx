import React from 'react'

export default function CrmCard({crm}: {crm: Crm}) {
  return (
    <li className='h-[128px] bg-[var(--dark-green)] text-[var(--light-green)] rounded p-2'>
        <span>{crm.name}</span>
    </li>
  )
}
