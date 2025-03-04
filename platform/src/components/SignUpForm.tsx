import Link from 'next/link'
import {ImSpinner2} from "react-icons/im";
import { HiOutlineExclamation } from "react-icons/hi";
import React, { useContext, useEffect, useState } from 'react'
import request from '@/utils/request';
import { useRouter } from 'next/navigation';
import { AuthContext, JWTData, decodeJWTPayload } from '@/context/AuthContext';
import Button from './Button';
import Spinner from "./Spinner"

interface Credentials {
    email: string,
    firstName: string,
    lastName: string,
    phoneNumber: string,
    password: string,
    retypedPassword: string,
    language: string
}
interface SignInData {
    code: number,
    message: string,
    token: string,
    user: User,
}

export default function SignInForm() {

    const router = useRouter();
    const {setData} = useContext(AuthContext);
    const [credetials, setCredentials] = useState<Credentials>({email: "", firstName: "", lastName: "", phoneNumber: "", password: "", retypedPassword: "", language: "eng"});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<number | null>(null);

    const handleSignUp = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            let res = await request<SignInData>("/auth/sign-up", credetials, "POST")
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
                setIsLoading(false);
                console.log(res.message)
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
        <h1 className="text-3xl mb-20 flex justify-center font-semibold text-accent-color">SIGN UP</h1>
        <div className="h-14 flex gap-4 justify-center w-full items-center">
        {((credetials.password != credetials.retypedPassword) || error) && 
        <div className={`flex justify-center gap-8 items-center}`}>
            <HiOutlineExclamation className="text-light-red text-4xl mt-1 w-24" /> 
            <p className="text-light-red px-2 flex items-center">{(!(credetials.password && credetials.retypedPassword) && error) ? "No password given!" : credetials.password != credetials.retypedPassword ? "Passwords do not match." : error ? "Email or phone number invalid or already in use." : "Passwords do not match."}</p>
        </div>
        }
        </div>
        <input type="text" required value={credetials.firstName} onChange={(e) => setCredentials({...credetials, firstName: e.target.value})} placeholder='First name' className={`p-2 text-lg text-gray-700 rounded-md ${error ? "ring-2 ring-light-red": ""}`}/>
        <input type="text" required value={credetials.lastName} onChange={(e) => setCredentials({...credetials, lastName: e.target.value})} placeholder='Last name' className={`p-2 text-lg text-gray-700 rounded-md ${error ? "ring-2 ring-light-red": ""}`}/>
        <input type="email" required value={credetials.email} onChange={(e) => setCredentials({...credetials, email: e.target.value})} placeholder='Email' className={`p-2 text-lg text-gray-700 rounded-md ${error ? "ring-2 ring-light-red": ""}`}/>
        <input type="tel" required value={credetials.phoneNumber} onChange={(e) => setCredentials({...credetials, phoneNumber: e.target.value})} placeholder='Phone number' className={`p-2 text-lg text-gray-700 rounded-md ${error ? "ring-2 ring-light-red": ""}`}/>
        <input type="password" required value={credetials.password} onChange={(e) => setCredentials({...credetials, password: e.target.value})} placeholder='Password'  className={`p-2 text-lg text-gray-700 rounded-md ${(!(credetials.password && credetials.retypedPassword) && error) ? "ring-2 ring-light-red": ""}`}/>
        <input type="password" required value={credetials.retypedPassword} onChange={(e) => setCredentials({...credetials, retypedPassword: e.target.value})} placeholder='Retype password' className={`p-2 text-lg text-gray-700 rounded-md ${credetials.password !== credetials.retypedPassword && credetials.retypedPassword != "" || (!(credetials.password && credetials.retypedPassword) && error) ? "ring-2 ring-light-red": ""}`}/>
        <select name="language" value={credetials.language as string} onChange={(e) => setCredentials({...credetials, language: e.target.value})} >
            <option value="eng">English</option>
            <option value="swe">Svenska</option>
        </select>
        <Button type='submit' className="p-2 rounded-md h-9 flex items-center justify-center font-semibold mt-7 " onClick={(e) => handleSignUp(e)}>{isLoading ? <Spinner /> : "Sign up"}</Button>
        <div className="flex flex-col items-center justify-center gap-6 w-full">
            <div className="flex w-full justify-between">
                <Link href={"#"} className="text-accent-color underline">Forgot password</Link>
                <Link href={"/sign-in"} className="text-accent-color underline">Sign in</Link>
            </div>
        </div>
       </div>
    </form>
  )
}
