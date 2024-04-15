import request from '@/utils/request';
import React, { useContext, useEffect, useState } from 'react'
import CrmCard from '../../components/CrmCard';
import CreateCrmPopup from '../../components/CreateCrmPopup';
import Text from '@/components/Text';
import { AuthContext } from '@/context/AuthContext';
import Screen from '@/components/Screen';

interface FetchResult {
  crms: Crm[]
}

export default function Index() {
  const {data} = useContext(AuthContext);
  const [crms, setCrms] = useState<ResultData<FetchResult>>();
  const [popupActive, setPopupActive] = useState<boolean>(false);
  const [employeeCrms, setEmployeeCrms] = useState<ResultData<Crm[]>>();

  const fetchCrms = async () => {
    const crmsRes = await request<FetchResult>("/all-crms", {}, "GET");
    setCrms(crmsRes);
    if (crmsRes.code == 401) {
      alert(crmsRes.message);
    }
    if(data?.user?.uuid) {
      const empCrmsRes = await request<Crm[]>(`/employee/by-employee-user-uuid?employeeUserUuid=${data?.user?.uuid}`, {}, "GET");
      setEmployeeCrms(empCrmsRes);
      if (empCrmsRes.code == 401) {
       alert(empCrmsRes.message);
      }
    }
  }

  useEffect(()=>{
    if(data) {
      fetchCrms();
    }
  },[data])

  const createCrm = async (name: string) => {
    const res = await request("/create-crm", {name}, "POST");
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
    <Screen>
      <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5 max-w-[1440px] m-auto justify-center px-2 py-8 ">
        <li className="w-full h-[128px] cursor-pointer border-dashed border-background-light hover:border-transparent hover:bg-background-light hover:text-[var(--light-green)] border-2 rounded-md text-gray-400 font-bold text-xl flex justify-center items-center transition-colors">
          <button onClick={() => setPopupActive(true)} className="h-full w-full"><Text text={{swe: "Nytt Crm", eng: "New Crm"}} /></button>
        </li>
        {crms?.data?.crms.map(crm => (<CrmCard key={crm.crmUuid} crm={crm}/>))}
        {employeeCrms?.data?.map(crm => (<CrmCard key={crm.crmUuid} crm={crm}/>))}
      </ul>      
      <CreateCrmPopup createCrm={createCrm} active={popupActive} closePopup={closePopup} />
    </Screen>
  )
}
