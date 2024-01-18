import Button from '@/components/Button';
import request from '@/utils/request';
import { useParams } from 'next/navigation'
import { useRouter } from 'next/router';
import React from 'react'
import Meetings from './Meetings';
import Navbar from './Navbar';

export default function index() {
  const params = useParams();
  const router = useRouter();
  
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
        <Navbar />
        <Button onClick={() => removeCrm()}>Remove crm</Button>  
      </main>
      <Meetings />
    </div>
  )
}
