import Button from '@/components/Button';
import request from '@/utils/request';
import { useParams } from 'next/navigation'
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react'
import Meetings from './Meetings';
import Navbar from './Navbar';
import { CacheType, cache } from '@/utils/cache';

export default function index() {
  const params = useParams();
  const router = useRouter();

  const [crm, setCrm] = useState<Crm | null>(null);
  useEffect(()=>{
    (async () => {

      if (params?.uuid !== undefined) {
        const res = await request<Crm>(`/crm?uuid=${params?.uuid}`, {}, "GET");
        setCrm(res.data || null);
        if (res.data && res.data.clients) {
          cache(res.data.clients, CacheType.Client);
        }
      }

    })();
  },[params])


  const removeCrm = async () => {
    const res = await request(`/crm?uuid=${params?.uuid}`, {}, "DELETE");
    alert(JSON.stringify(res));
    if (res.code === 200) {
      router.push("/dashboard");
    }
  }

  return (
    <div className='flex gap-4 h-[calc(100vh-3em)]'>
      <main className="p-2 flex-grow">
        <Navbar crmName={crm?.name} />
        <Button onClick={() => removeCrm()}>Remove crm</Button>  
      </main>
      <Meetings meetings={crm?.meetings}/>
    </div>
  )
}
