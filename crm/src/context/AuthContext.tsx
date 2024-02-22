import request from "@/utils/request";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

interface Context {
    data: JWTData | null,
    setData: React.Dispatch<React.SetStateAction<JWTData | null>> | (() => void),
}

export interface JWTData {
    user: User | null,
    exp: number,
    token: string | null
}


export const AuthContext = React.createContext<Context>({data: {user: null, exp: 0, token: null}, setData: () => {}});

export const AuthContextProvider = ({children}: {children: React.ReactNode}) => {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<JWTData | null>(null);

    //read and set user from JWT in localStorage
    useEffect(()=>{
        (async () => {
            setLoading(true);
            const jwtString = decodeJWTPayload();
            if (!jwtString) {
                setLoading(false);
                return setData(null)
            };
            const data = JSON.parse(jwtString) as JWTData;
            data.token = localStorage.getItem("auth_token");
            if (data.exp < Number((Date.now() / 1000).toFixed(0))){
                localStorage.removeItem("auth_token");
                setData(null);
            }else{
                setData(data);
            }
            await validateToken();
            setLoading(false);
        })();
    },[])


    const validateToken = async () => {
        let res = await request<User>("/auth/validate-token", {}, "POST");
        if (res.code !== 200) {
            localStorage.removeItem("auth_token");
            setData(null);
            router.push("/sign-in")
        }
    }


    return (
        <AuthContext.Provider value={{data, setData}}>
            {children}
        </AuthContext.Provider>
    )
}


/**
 * 
 * @param jwt String JWT token
 * @returns the decoded payload of a jwt
 */
export function decodeJWTPayload(jwt?: string): string | null {
    if (jwt) {
        return atob(jwt.split(".")[1]);
    } else {
        const ls = localStorage.getItem("auth_token");
        if (!ls) return null;
        return atob(ls.split(".")[1]);
    }
    
}