import React, { useContext } from 'react'
import Navbar from '../../../../../components/Navbar'
import Button from '@/components/Button'
import { CurrentCrmContext } from '@/context/CurrentCrmContext';
import request from '@/utils/request';
import { useRouter } from 'next/router';
import Screen from '@/components/Screen';

export default function Index() {
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
    <Screen>
        Settings
        <Button onClick={() => removeCrm()}>Remove crm</Button>  
        <Button onClick={() => alert("create function")}>Clear cache</Button>

    </Screen>
  )
}
