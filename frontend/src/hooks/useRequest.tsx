import request from '@/utils/request';
import { useRouter } from 'next/navigation';
import React, { useCallback, useEffect, useState } from 'react'

export default function useRequest<T extends {code: number}, U extends Object = Object>(endPoint: string, data: InputData<U>, method: HTTPMETHOD = "GET") {
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [result, setResult] = useState<T | null>(null);

    useCallback(() => {
        (async () => {
            setLoading(true);
            const result = await request<T>(endPoint, data, method);
            if (result.code >= 400) {
                setLoading(false);
                router.push("/auth/sign-in");
            }else{
                setResult(result)
                setLoading(false);
            }
        })();
    }, [endPoint, data, method])


    // check if auth_token exists
    useEffect(()=>{
        (() => {
            if (!localStorage.getItem("auth_token")) router.push("/sign-in");
        })();
    },[])


    // check if auth_token has expired
    // todo!

    return {data}
}
