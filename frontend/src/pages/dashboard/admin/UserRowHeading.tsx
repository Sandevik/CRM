import React from 'react'

export default function UserRowHeading() {
  return (
    <li className='grid grid-cols-6  bg-gray-400 mt-3 p-2 font-semibold gap-4'>
        <div className=''>Uuid</div>
        <div>Email</div>
        <div>Phone number</div>
        <div>Admin</div>
        <div>Joined</div>
        <div>Last sign in</div>
    </li>
  )
}
