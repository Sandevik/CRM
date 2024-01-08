import Link from 'next/link'
import {ImSpinner2} from "react-icons/im";
import React, { useEffect, useState } from 'react'
import request from '@/utils/request';
import { useRouter } from 'next/navigation';

interface Credentials {
    email: string,
    phoneNumber: string,
    password: string,
}
interface SignInData {
    code: number,
    message: string,
    token: string,
}



export default function SignUpForm() {

    const router = useRouter();
    const [credetials, setCredentials] = useState<Credentials>({email: "", phoneNumber: "", password: ""});
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const handleSignIn = async () => {
        setIsLoading(true);
        let res = await request<SignInData>("/auth/sign-up", {
            email: credetials.email,
            phoneNumber: credetials.phoneNumber,
            password: credetials.password
        }, "POST")
        if (res.code === 200) {
            localStorage.setItem("auth_token", res.token || "");
            router.push("/")
        }
        if (res.code >= 400) {
            alert(res.message);
        }
        setIsLoading(false);
    }

    useEffect(()=>{
        // let user login if token exists and token is expired or if token does not exist in localStorage 

        //if (!localStorage.getItem("auth_token") || )
        // handle if token exists and is expired
        
        
        //handle if token does not exist
    },[])



  return (
    <div className="bg-[var(--dark-green)] w-full h-full justify-center items-center relative p-4 custom-shadow-left">
        <h1 className="text-3xl absolute w-full top-40 flex justify-center font-semibold text-[var(--light-green)]">SIGN UP</h1>
        <div className='max-w-[20em] m-auto flex flex-col gap-6 justify-center h-full mt-4'>
        <input type="text" value={credetials.email} onChange={(e) => setCredentials({...credetials, email: e.target.value})} placeholder='Email' className="p-2 text-lg rounded-md"/>
        <input type="text" value={credetials.phoneNumber} onChange={(e) => setCredentials({...credetials, phoneNumber: e.target.value})} placeholder='Phone number' className="p-2 text-lg rounded-md"/>
        <input type="password" value={credetials.password} onChange={(e) => setCredentials({...credetials, password: e.target.value})} placeholder='Password'  className="p-2 text-lg rounded-md"/>
        <button className="bg-[var(--blue)] p-2 rounded-md h-9 flex items-center justify-center font-semibold mt-7 " onClick={() => handleSignIn()}>{isLoading ? <ImSpinner2 className="w-full animate-spin text-xl" /> : "Sign up"}</button>
        <div className="flex flex-col items-center justify-center gap-6 w-full">
            <div className="flex w-full justify-between">
                <Link href={"/sign-in"} className="text-[var(--light-green)] underline">Sign in</Link>
                <Link href={"#"} className="text-[var(--light-green)] underline">Forgot password</Link>
            </div>
        </div>
       </div>
    </div>
  )
}
