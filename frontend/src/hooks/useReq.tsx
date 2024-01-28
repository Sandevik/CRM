import { CurrentCrmContext } from "@/context/CurrentCrmContext";
import request from "@/utils/request";
import { useContext, useEffect, useState } from "react";

interface ReqOptions {
    offset?: number,
    limit?: number,
    fetchUriNoParams: string,
    searchUriNoParams: string,
}

export default function<T extends Object>(initialValue: T[], {offset, limit, fetchUriNoParams, searchUriNoParams}: ReqOptions) {
    const {crm} = useContext(CurrentCrmContext);
    const [result, setResult] = useState<T[]>(initialValue);
    const [requestOptions, setRequestOptions] = useState<{offset: number, limit: number}>({limit: limit || 20, offset: offset || 0});
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchResult, setSearchResult] = useState<T[] | undefined>(undefined);
    const [cached, setCached] = useState<(T[])[]>([]);
    const [prefetch, setPrefetch] = useState<number>(0);

    console.log(cached);

    useEffect(()=>{
        (async () => {
            const arr = cached;
            if (requestOptions.offset / requestOptions.limit >= cached.length){
                let res = await refetch();
                if (res && res.length > 0) {
                    console.log("r")
                    arr.push(res)
                }
                let preFetch = await refetch(true);
                if (preFetch && preFetch.length > 0) {
                    arr.push(preFetch)
                    setPrefetch(preFetch.length);
                } else {
                    setPrefetch(0);
                }
                setCached(arr)
            } else {
                setResult(cached[requestOptions.offset / requestOptions.limit])
            }
        })();
    },[initialValue, requestOptions])
  
    const refetch = async (preFetch?: boolean) => {
        if(crm?.crmUuid){
          const res = await request<T[]>(`${fetchUriNoParams}?crmUuid=${crm?.crmUuid}&limit=${requestOptions.limit}&offset=${preFetch ? requestOptions.offset + requestOptions.limit : requestOptions.offset}`, {}, "GET");
          if (res.code === 200) {
            !preFetch && setResult(res.data || []);
            return res.data;
          }
        }
    }
  
    const search = async () => {
        if(crm?.crmUuid && searchQuery !== "") {
          const res = await request<T[]>(`${searchUriNoParams}?crmUuid=${crm?.crmUuid}&q=${searchQuery}`, {}, "GET");
          if (res.code === 200) {
            setSearchResult(res.data && res.data.length > 0 ? res.data : undefined);
          }
        } else {
          setSearchResult(undefined);
        }
    }
  
    useEffect(()=>{
       search();
    },[searchQuery])


    const prevResult = () => {
        console.log("current " + requestOptions.offset + ", next " + (requestOptions.offset - requestOptions.limit) )
        if(requestOptions.offset - requestOptions.limit >= 0) {
          setRequestOptions({...requestOptions, offset: requestOptions.offset - requestOptions.limit});
        }
    }
  
    const nextResult = () => {
        if (result.length > 0) {
          setRequestOptions({...requestOptions, offset: requestOptions.offset += requestOptions.limit});
        }
    }


    return {data: searchResult && searchResult.length > 0 ? searchResult : result || [], nextResult, prevResult, setSearchQuery, refetch, searchQuery, searchResult, currentPage: (requestOptions.offset / requestOptions.limit) + 1, thereIsMore: prefetch > 0 && (requestOptions.offset / requestOptions.limit) < cached.length}
}