import React from 'react'

export default function UserRow({user}: {user: User}) {
  return (
    <li className='grid grid-cols-6 bg-gray-300 p-2 odd:bg-gray-100'>
        <div className=''>{user.uuid}</div>
        <div>{user.email}</div>
        <div>{user.phoneNumber}</div>
        <div>{user.admin ? "Yes" : "No"}</div>
        <div>{new Date(user.joined).toLocaleString()}</div>
        <div>{new Date(user.lastSignIn).toLocaleString()}</div>
    </li>
  )
}
