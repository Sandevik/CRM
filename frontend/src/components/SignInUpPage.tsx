import React from 'react'
import SignInForm from './SignInForm'
import { usePathname } from 'next/navigation'
import SignUpForm from './SignUpForm';

export default function SignInUpPage() {
  const pathname = usePathname();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 h-[calc(100vh-3em)] place-items-center">
        {pathname === "/sign-in" ? 
        <>
          <SignInForm />
          <div className="hidden md:flex w-full h-full"></div>
        </>
        :
        <>
          <div className="hidden md:grid place-items-center w-full h-full bg-background-light bg-opacity-30">
            <span className="text-white m-auto w-[80%] text-lg">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. 
              Temporibus commodi asperiores, vero veniam, nostrum aut, 
              eius omnis aliquam odit neque iste eaque facere? Iusto tempore 
              repellendus ab sed nulla ipsa?
            </span>
          </div>
          <SignUpForm />
        </>
        }
    </div>
  )
}
