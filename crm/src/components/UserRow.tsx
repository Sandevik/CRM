import React, { useState } from 'react'
import { MdCopyAll } from "react-icons/md";
import { BsClipboard2CheckFill, BsClipboard2Fill } from "react-icons/bs";

export default function UserRow({user}: {user: User}) {
  const [hasCopied, setHasCopied] = useState<boolean>(false);
  const copyToClipBoard = (text: String | number) => {
    navigator.clipboard.writeText(text.toString());
    setHasCopied(true);
  }

  return (
    <li className='grid grid-cols-6 bg-gray-300 p-2 odd:bg-gray-100 gap-4'>
        <div className="flex gap-2 items-center">{hasCopied ? <BsClipboard2CheckFill onClick={() => copyToClipBoard(user.uuid)} className="flex-grow text-[var(--dark-green)] cursor-pointer text-3xl hover:text-[var(--pink)] transition-colors" /> : <BsClipboard2Fill onClick={() => copyToClipBoard(user.uuid)} className="flex-grow text-[var(--dark-green)] cursor-pointer text-3xl hover:text-[var(--pink)] transition-colors" />}<div className="truncate">{user.uuid}</div></div>
        <div className='truncate'>{user.email}</div>
        <div className='truncate'>{user.phoneNumber}</div>
        <div>{user.admin ? "Yes" : "No"}</div>
        <div className='truncate'>{new Date(user.joined).toLocaleString()}</div>
        <div className='truncate'>{new Date(user.lastSignIn).toLocaleString()}</div>
    </li>
  )
}
