import SignInFrom from '@/components/SignInFrom'
import React from 'react'

export default function index() {

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-[100vh] place-items-center">
        <SignInFrom />
        <div className="hidden md:flex w-full h-full"></div>
    </div>
  )
}
