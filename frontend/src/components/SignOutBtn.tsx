import { AuthContext } from '@/context/AuthContext'
import React, { useContext } from 'react'

export default function SignOutBtn() {
  const {setData} = useContext(AuthContext);

  const handleSignOut = () => {
    localStorage.removeItem("auth_token");
    setData(null);
  }
  
    return (
    <button className="bg-[var(--pink)] text-white p-2 rounded-md hover:bg-red-600 transition-colors" onClick={() => handleSignOut()}>Sign out</button>
  )
}
