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
    const [requestOptions, setRequestOptions] = useState<{offset: number, limit: number}>({limit: 20, offset: 0});
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [searchResult, setSearchResult] = useState<Client[] | undefined>(undefined);

    useEffect(()=>{
        refetch();
      },[initialValue, requestOptions])
  
      const refetch = async () => {
        if(crm?.crmUuid){
          const res = await request<T[]>(`${fetchUriNoParams}?crmUuid=${crm?.crmUuid}&limit=${requestOptions.limit}&offset=${requestOptions.offset}`, {}, "GET");
          if (res.code === 200) {
            setResult(res.data || []);
          }
        }
      }
  
      const search = async () => {
        if(crm?.crmUuid && searchQuery !== "") {
          const res = await request<Client[]>(`${searchUriNoParams}?crmUuid=${crm?.crmUuid}&q=${searchQuery}`, {}, "GET");
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
        if(requestOptions.offset - requestOptions.limit >= 0) {
          setRequestOptions({...requestOptions, offset: requestOptions.offset -= requestOptions.limit});
  
        }
      }
  
      const nextResult = () => {
        if (result.length > 0) {
          setRequestOptions({...requestOptions, offset: requestOptions.offset += requestOptions.limit});
        }
      }


    return {data: searchResult && searchResult.length > 0 ? searchResult : result, nextResult, prevResult, setSearchQuery, refetch, searchQuery, searchResult, currentPage: (requestOptions.offset / requestOptions.limit) + 1}
}