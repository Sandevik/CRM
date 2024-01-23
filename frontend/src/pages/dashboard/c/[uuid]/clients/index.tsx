import React, { useContext, useState } from 'react'
import Navbar from '../Navbar'
import { CurrentCrmContext } from '@/context/CurrentCrmContext'
import Button from '@/components/Button';
import NewClientForm from './NewClientForm';
import request from '@/utils/request';

export default function index() {
    const {crm} = useContext(CurrentCrmContext);
    const [createClientActive, setCreateClientActive] = useState<boolean>(false);

    const onSuccessfullSubmit = () => {
      setCreateClientActive(false);

    }

    const refetchClients = async () => {
      const res = await request<Client[]>(`/clients?crmUuid=${crm?.crmUuid}`, {}, "GET");
      
    }

  return (
    <main className='relative'>
        <Navbar />
        <Button onClick={() => setCreateClientActive(!createClientActive)} className='absolute right-2 top-20'>{createClientActive ? "Close" : "New client"}</Button>
        <NewClientForm onSuccessfulSubmit={onSuccessfullSubmit} active={createClientActive}/>
        <ul>
            {crm?.clients?.map(client => (<li>{client.firstName}</li>))}
        </ul>
    </main>
  )
}
