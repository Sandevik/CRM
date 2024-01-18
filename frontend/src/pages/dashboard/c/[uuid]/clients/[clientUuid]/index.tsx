import { useParams } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../../Navbar';
import { CurrentCrmContext } from '@/context/CurrentCrmContext';
import fetchClientDetails from '@/utils/fetchClientDetails';

export default function index() {
  const params = useParams();
  const {crm} = useContext(CurrentCrmContext);
  const [client, setClient] = useState<Client | null>(null);

  useEffect(()=>{
    (async () => {
      if (crm?.crmUuid && params?.clientUuid) {
        const client = await fetchClientDetails(crm?.crmUuid, params?.clientUuid as string);
        setClient(client)
      }
    })();
  },[crm, params])


    return (
      <div>
        <Navbar />
        {client?.firstName}    
      </div>
    )
}
