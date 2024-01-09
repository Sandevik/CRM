import { AuthContext } from '@/context/AuthContext';
import request from '@/utils/request';
import { useRouter } from 'next/navigation';
import React, { useContext, useEffect, useState } from 'react'

export default function useRequest<T extends Object, U extends Object = Object>(endPoint: string, data: InputData<U>, method: HTTPMETHOD = "GET"): {data: T | null, loading: boolean, refetch: () => void} {

    const {data: authData, setData: setAuthData} = useContext(AuthContext);
    const router = useRouter();
    const [loading, setLoading] = useState<boolean>(false);
    const [result, setResult] = useState<T | null>(null);

    useEffect(() => {
        fetch();
    }, [endPoint, data, method])

    async function fetch() {
        setLoading(true);
        if (authData?.exp && authData.exp < Number((Date.now() / 1000).toFixed(0))) {
            localStorage.removeItem("auth_token");
            setAuthData(null);
            router.push("/sign-in");
            return;
        } else {
            const result = await request<T>(endPoint, data, method);
            if (result.code >= 400) {
                /* setLoading(false);
                router.push("/sign-in"); */
            }else{
                setResult(result as T);
                setLoading(false);
            }
        }
    }

    return {data: result, loading, refetch: fetch}
}
