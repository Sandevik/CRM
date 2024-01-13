import { AuthContext } from '@/context/AuthContext';
import useRequest from '@/hooks/useRequest'
import request from '@/utils/request';
import React, { useContext, useEffect, useState } from 'react'
import CrmCard from './CrmCard';
import CreateCrmPopup from './CreateCrmPopup';

interface FetchResult {
  crms: Crm[]
}

export default function index() {
  const [data, setData] = useState<ResultData<FetchResult>>();
  const [popupActive, setPopupActive] = useState<boolean>(false);

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

  const createCrm = async (name: string) => {
    const res = await request("/crm/create", {name}, "POST");
    if (res.code === 201) {
      setPopupActive(false);
      fetchCrms();
    }
    return res
  }

  const closePopup = () => {
    setPopupActive(false);
  }

  return (
    <div className="h-[calc(100vh-4em)] relative">
      <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5 max-w-[1440px] m-auto justify-center px-2 py-8 ">
        <li className="w-full h-[128px] cursor-pointer border-transparent bg-gray-200 hover:border-[var(--light-green)] hover:bg-gray-500 hover:text-[var(--light-green)] border-2 rounded-md text-gray-400 font-bold text-xl flex justify-center items-center transition-colors">
          <button onClick={() => setPopupActive(true)} className="h-full w-full">Create CRM</button>
        </li>
        {data?.data?.crms.map(crm => (<CrmCard crm={crm}/>))}
      </ul>      
      <CreateCrmPopup createCrm={createCrm} active={popupActive} closePopup={closePopup} />
    </div>
  )
}
