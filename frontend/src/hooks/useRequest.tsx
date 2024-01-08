import { AuthContext } from '@/context/AuthContext';
import request from '@/utils/request';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'

export default function useRequest<T extends {code: number}, U extends Object = Object>(endPoint: string, data: InputData<U>, method: HTTPMETHOD = "GET") {
    const {data: authData, setData: setAuthData} = useContext(AuthContext);
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [result, setResult] = useState<T | null>(null);

    useEffect(() => {
        fetch();
    }, [])

    async function fetch() {
        setLoading(true);
        if (authData?.exp && authData.exp < Number((Date.now() / 1000).toFixed(0))) {
            localStorage.removeItem("auth_token");
            setAuthData(null);
            router.push("/sign-in");
            return;
        } else {
            const result = await request<T>(endPoint, data, method);
            console.log(result)
        if (result.code >= 400) {
            /* setLoading(false);
            router.push("/sign-in"); */
        }else{
            setResult(result)
            setLoading(false);
        }
        }
    }

    return {data: result, loading, refetch: fetch}
}
