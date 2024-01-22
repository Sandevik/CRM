import React, { useContext } from 'react'
import Navbar from '../Navbar'
import Button from '@/components/Button'
import { CurrentCrmContext } from '@/context/CurrentCrmContext';
import request from '@/utils/request';
import { useRouter } from 'next/router';

export default function index() {
    const router = useRouter();
    const {crm} = useContext(CurrentCrmContext);
    const removeCrm = async () => {
        if (crm?.crmUuid) {
          const res = await request(`/crm?crmUuid=${crm?.crmUuid}`, {}, "DELETE");
          alert(JSON.stringify(res));
          if (res.code === 200) {
            router.push("/dashboard");
          }
        }
    }
  
  
  
    return (
    <div>
        <Navbar />
        Settings
        <Button onClick={() => removeCrm()}>Remove crm</Button>  

    </div>
  )
}
