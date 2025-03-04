import Link from 'next/link'
import {ImSpinner2} from "react-icons/im";
import { HiOutlineExclamation } from "react-icons/hi";
import React, { useContext, useEffect, useState } from 'react'
import request from '@/utils/request';
import { useRouter } from 'next/navigation';
import { AuthContext, JWTData, decodeJWTPayload } from '@/context/AuthContext';
import Button from './Button';
import Spinner from "./Spinner"
import Text from './Text';
import text from '@/utils/text';

interface Credentials {
    emailOrPhoneNumber: string,
    password: string,
}
interface SignInData {
    code: number,
    message: string,
    token: string,
    user: User,
}



export default function SignInForm() {

    const router = useRouter();
    const {data, setData} = useContext(AuthContext);
    const [credetials, setCredentials] = useState<Credentials>({emailOrPhoneNumber: "", password: ""});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<number | null>(null);

    const handleSignIn = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            let res = await request<SignInData>("/auth/sign-in", {
                emailOrPhoneNumber: credetials.emailOrPhoneNumber,
                password: credetials.password
            }, "POST")
            if (res.code === 200) {
                localStorage.setItem("auth_token", res.data?.token || "");
                const payloadData = decodeJWTPayload(res.data?.token);
                if (!payloadData) {
                    setData(null);
                } else {
                    const parsed = JSON.parse(payloadData)
                    setData(parsed as JWTData);
    
                }
                router.push("/dashboard")
            }
            if (res.code >= 400) {
                setError(res.code);
            }
        } catch {
            setError(400);
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <form className="bg-background-light bg-opacity-30 w-full h-full justify-center items-center p-4 custom-shadow-right z-10">
        <div className='max-w-[20em] m-auto flex flex-col gap-6 justify-center h-full mt-4'>
        <h1 className="text-3xl flex justify-center font-semibold text-accent-color"><Text text={{eng: "Sign In", swe: "Logga In"}} /></h1>
        <div className="h-14 flex gap-4 justify-center w-full items-center">
        {error && 
        <div className={`flex justify-center gap-8 items-center}`}>
            <HiOutlineExclamation className="text-light-red text-4xl mt-1 w-24" /> 
            <p className="text-light-red px-2 flex items-center"><Text text={{eng: "Invalid email, phone number or password, try again.", swe: "Felaktig email, telefonnummer eller lösenord, försök igen."}} /></p>
        </div>
        }
        </div>
        <input type="text" value={credetials.emailOrPhoneNumber} onChange={(e) => setCredentials({...credetials, emailOrPhoneNumber: e.target.value})} placeholder={text({eng:'Email or phone number', swe: "Email eller telefonnummer"}, data)} className={`p-2 text-lg text-gray-700 rounded-md ${error ? "ring-2 ring-light-red": ""}`}/>
        <input type="password" value={credetials.password} onChange={(e) => setCredentials({...credetials, password: e.target.value})} placeholder={text({eng:"Password", swe: "Lösenord"}, data)}  className={`p-2 text-lg text-gray-700 rounded-md ${error ? "ring-2 ring-light-red": ""}`}/>
        <Button type='submit' className=" p-2 rounded-md h-9 flex items-center justify-center font-semibold mt-7 " onClick={(e) => handleSignIn(e)}>{isLoading ? <Spinner /> : "Sign in"}</Button>
        <div className="flex flex-col items-center justify-center gap-6 w-full">
            <div className="flex w-full justify-between">
                <Link href={"#"} className="text-accent-color underline">Forgot password</Link>
                <Link href={"/sign-up"} className="text-accent-color underline">Sign up</Link>
            </div>
        </div>
       </div>
    </form>
  )
}
