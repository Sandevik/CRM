import Link from 'next/link'
import {ImSpinner2} from "react-icons/im";
import { HiOutlineExclamation } from "react-icons/hi";
import React, { useContext, useEffect, useState } from 'react'
import request from '@/utils/request';
import { useRouter } from 'next/navigation';
import { AuthContext, JWTData, decodeJWTPayload } from '@/context/AuthContext';

interface Credentials {
    email: string,
    phoneNumber: string,
    password: string,
    retypedPassword: string,
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
    const [credetials, setCredentials] = useState<Credentials>({email: "", phoneNumber: "", password: "", retypedPassword: ""});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<number | null>(null);

    const handleSignUp = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            let res = await request<SignInData>("/auth/sign-in", {
                email: credetials.email,
                phoneNumber: credetials.phoneNumber,
                password: credetials.password
            }, "POST")
            if (res.code === 200) {
                localStorage.setItem("auth_token", res.token || "");
                const payloadData = decodeJWTPayload(res.token);
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
            }
        } catch {
            setError(400);
        } finally {
            setIsLoading(false);
        }
    }

  return (
    <form className="bg-[var(--dark-green)] w-full h-full justify-center items-center p-4 custom-shadow-right z-10">
        <div className='max-w-[20em] m-auto flex flex-col gap-6 justify-center h-full mt-4'>
        <h1 className="text-3xl mb-20 flex justify-center font-semibold text-[var(--light-green)]">SIGN UP</h1>
        <div className="h-14 flex gap-4 justify-center w-full items-center">
        {((credetials.password != credetials.retypedPassword) || error) && 
        <div className={`flex justify-center gap-8 items-center}`}>
            <HiOutlineExclamation className="text-[var(--pink)] text-4xl mt-1 w-24" /> 
            <p className="text-[var(--pink)] px-2 flex items-center">{(!(credetials.password && credetials.retypedPassword) && error) ? "No password given!" : credetials.password != credetials.retypedPassword ? "Passwords do not match." : error ? "Email or phone number invalid or already in use." : "Passwords do not match."}</p>
        </div>
        }
        </div>
        <input type="email" required value={credetials.email} onChange={(e) => setCredentials({...credetials, email: e.target.value})} placeholder='Email' className={`p-2 text-lg rounded-md ${error ? "ring-2 ring-[var(--pink)]": ""}`}/>
        <input type="tel" required value={credetials.phoneNumber} onChange={(e) => setCredentials({...credetials, phoneNumber: e.target.value})} placeholder='Phone number' className={`p-2 text-lg rounded-md ${error ? "ring-2 ring-[var(--pink)]": ""}`}/>
        <input type="password" required value={credetials.password} onChange={(e) => setCredentials({...credetials, password: e.target.value})} placeholder='Password'  className={`p-2 text-lg rounded-md ${(!(credetials.password && credetials.retypedPassword) && error) ? "ring-2 ring-[var(--pink)]": ""}`}/>
        <input type="password" required value={credetials.retypedPassword} onChange={(e) => setCredentials({...credetials, retypedPassword: e.target.value})} placeholder='Retype password' className={`p-2 text-lg rounded-md ${credetials.password !== credetials.retypedPassword && credetials.retypedPassword != "" || (!(credetials.password && credetials.retypedPassword) && error) ? "ring-2 ring-[var(--pink)]": ""}`}/>
        <button type='submit' className="bg-[var(--blue)] p-2 rounded-md h-9 flex items-center justify-center font-semibold mt-7 " onClick={(e) => handleSignUp(e)}>{isLoading ? <ImSpinner2 className="w-full animate-spin text-xl" /> : "Sign up"}</button>
        <div className="flex flex-col items-center justify-center gap-6 w-full">
            <div className="flex w-full justify-between">
                <Link href={"#"} className="text-[var(--light-green)] underline">Forgot password</Link>
                <Link href={"/sign-in"} className="text-[var(--light-green)] underline">Sign in</Link>
            </div>
        </div>
       </div>
    </form>
  )
}
