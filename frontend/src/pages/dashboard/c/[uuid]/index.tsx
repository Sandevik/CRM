import Button from '@/components/Button';
import request from '@/utils/request';
import { useParams } from 'next/navigation'
import { useRouter } from 'next/router';
import React from 'react'

export default function index() {
  const params = useParams();
  const router = useRouter();

  const removeCrm = async () => {
    const res = await request(`/crm/${params?.uuid}`, {}, "DELETE");
    alert(JSON.stringify(res));
    if (res.code === 200) {
      router.push("/dashboard");
    }
  }

  return (
    <div>
      {params?.uuid}
      <Button onClick={() => removeCrm()}>Remove crm</Button>  
    </div>
  )
}
