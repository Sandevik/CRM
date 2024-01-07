import Link from 'next/link'
import React, { useState } from 'react'

export default function SignInFrom() {

    const [credetials, setCredentials] = useState<{email: string, password: string}>({email: "", password: ""});

    const handleSignIn = async () => {

        let res = await fetch("http://localhost:8081/auth/sign-in", {
            method: "POST",
            body: JSON.stringify({
                email: credetials.email,
                password: credetials.password,
            }),
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        })
        let t = await res.text();
        alert(t);

    }





  return (
    <div className="bg-[var(--dark-green)] w-full h-full justify-center items-center relative p-4">
        <h1 className="text-3xl absolute w-full top-40 flex justify-center font-semibold text-[var(--light-green)]">SIGN IN</h1>
       <div className='max-w-[20em] m-auto flex flex-col gap-6 justify-center h-full mt-4'>
       <input type="text" value={credetials.email} onChange={(e) => setCredentials({...credetials, email: e.target.value})} placeholder='Email' className="p-2 text-lg rounded-md"/>
        <input type="password" value={credetials.password} onChange={(e) => setCredentials({...credetials, password: e.target.value})} placeholder='Password'  className="p-2 text-lg rounded-md"/>
        <button className="bg-[var(--blue)] p-2 rounded-md px-5 font-semibold mt-7" onClick={() => handleSignIn()}>Sign in</button>
        <div className="flex flex-col items-center justify-center gap-6 w-full">
            <div className="flex w-full justify-between">
                <Link href={"#"} className="text-[var(--light-green)] underline">Forgot password</Link>
                <Link href={"/sign-up"} className="text-[var(--light-green)] underline">Sign up</Link>
            </div>
        </div>
       </div>
    </div>
  )
}
