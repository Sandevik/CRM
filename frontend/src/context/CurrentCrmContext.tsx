import { CacheType, cache } from "@/utils/cache";
import request from "@/utils/request";
import { usePathname } from "next/navigation";
import React, { useEffect, useState } from "react";


export const CurrentCrmContext = React.createContext<{crm: Crm | null, setCrm: (React.Dispatch<React.SetStateAction<Crm | null>> | (() => void))}>({crm: null, setCrm: () => {}});


export const CurrentContextProvider = ({children}: {children: React.ReactNode}) => {
    const pathName = usePathname();
    const [currentUuid, setCurrentUuid] = useState<string | null>(null);
    useEffect(()=>{
        const indexOfC = pathName?.split("/").indexOf("c");
        if (indexOfC) {
            setCurrentUuid(pathName?.split("/")[indexOfC + 1]);
        }
    },[pathName])

    useEffect(()=>{
        (async () => {
            if (currentUuid) {
              const res = await request<Crm>(`/crm?crmUuid=${currentUuid}`, {}, "GET");
              setCrm(res.data || null);
              if (res.data && res.data.clients) {
                cache(res.data.clients, CacheType.Client);
              }
            }
          })();
    }, [currentUuid])

    const [crm, setCrm] = useState<Crm | null>(null);

    return (
    <CurrentCrmContext.Provider value={{crm, setCrm}}>
        {children}
    </CurrentCrmContext.Provider>)
}