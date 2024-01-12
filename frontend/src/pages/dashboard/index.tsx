import { AuthContext } from '@/context/AuthContext';
import useRequest from '@/hooks/useRequest'
import request from '@/utils/request';
import React, { useContext, useEffect, useState } from 'react'
import CrmCard from './CrmCard';

interface FetchResult {
  crms: Crm[]
}

export default function index() {
  const [data, setData] = useState<ResultData<FetchResult>>()

  const fetchCrms = async () => {
    const crmsRes = await request<FetchResult>("/crm", {}, "GET");
    setData(crmsRes);
    if (crmsRes.code == 401) {
      alert(crmsRes.message);
    }
  }

  useEffect(()=>{
    fetchCrms();
  },[])

  return (
    <div className="h-[calc(100vh-4em)]">
      <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5 max-w-[1440px] m-auto justify-center px-2 py-8 ">
        <li onClick={()=> alert("Add functionality to create new crm")} className="w-full h-[128px] cursor-pointer border-transparent bg-gray-200 hover:border-[var(--light-green)] hover:bg-gray-500 hover:text-[var(--light-green)] border-2 rounded-md text-gray-400 font-bold text-xl flex justify-center items-center transition-colors">
          <div>Create CRM</div>
        </li>
        {data?.data?.crms.map(crm => (<CrmCard crm={crm}/>))}
      </ul>      
    </div>
  )
}
