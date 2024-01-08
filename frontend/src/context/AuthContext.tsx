import React, { useEffect, useState } from "react";

interface Context {
    data: JWTData | null,
    setData: React.Dispatch<React.SetStateAction<JWTData | null>> | (() => void),
}

export interface JWTData {
    user: User | null,
    exp: number,
}


export const AuthContext = React.createContext<Context>({data: {user: null, exp: 0}, setData: () => {}});

export const AuthContextProvider = ({children}: {children: React.ReactNode}) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<JWTData | null>(null);

    //read and set user from JWT in localStorage
    useEffect(()=>{
        (() => {
            setLoading(true);
            const jwtString = decodeJWTPayload();
            if (!jwtString) {
                setLoading(false);
                return setData(null)
            };
            const data = JSON.parse(jwtString) as JWTData;
            if (data.exp < Number((Date.now() / 1000).toFixed(0))){
                localStorage.removeItem("auth_token");
                setData(null);
            }else{
                setData(data);
            }
            setLoading(false);
            
        })();
    },[])



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