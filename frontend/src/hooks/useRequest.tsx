import request from '@/utils/request';
import React, { useCallback, useEffect, useState } from 'react'

export default function useRequest<T extends Object, U extends Object = Object>(endPoint: string, data: InputData<U>, method: HTTPMETHOD = "GET") {
    const [loading, setLoading] = useState<boolean>(false);
    const [result, setResult] = useState<T | null>(null);

    useCallback(() => {
        (async () => {
            setLoading(true);
            setResult(await request<T>(endPoint, data, method))
            setLoading(false);
        })();
    }, [endPoint, data, method])

    return {data}
}
