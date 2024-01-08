import React from 'react'
import SignInForm from './SignInForm'
import { usePathname } from 'next/navigation'
import SignUpForm from './SignUpForm';

export default function SignInUpPage() {
  const pathname = usePathname();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-[100vh] place-items-center">
        {pathname === "/sign-in" ? 
        <>
          <SignInForm />
          <div className="hidden md:flex w-full h-full"></div>
        </>
        :
        <>
          <div className="hidden md:flex w-full h-full"></div>
          <SignUpForm />
        </>
        }
    </div>
  )
}
