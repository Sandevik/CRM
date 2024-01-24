import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../Navbar'
import { CurrentCrmContext } from '@/context/CurrentCrmContext'
import Button from '@/components/Button';
import NewClientForm from './NewClientForm';
import request from '@/utils/request';
import ClientRow from './ClientRow';
import Input from '@/components/Input';

export default function index() {
    const {crm} = useContext(CurrentCrmContext);
    const [createClientActive, setCreateClientActive] = useState<boolean>(false);
    const [clients, setClients] = useState<Client[]>(crm?.clients || []);

    const onSuccessfullSubmit = () => {
      setCreateClientActive(false);
      refetchClients();

    }

    useEffect(()=>{
      refetchClients();
    },[crm])

    const refetchClients = async () => {
      if(crm?.crmUuid){
        const res = await request<Client[]>(`/clients/all?crmUuid=${crm?.crmUuid}`, {}, "GET");
        if (res.code === 200) {
          setClients(res.data || []);
        }
      }
    }

  return (
    <main className='relative'>
        <Navbar />
        <div className='sticky mt-2  flex justify-center top-[130px]'>
          {/* Search bar */}
          <div className="flex gap-2 bg-background-dark bg-opacity-60">
            <Input placeholder="Search" className="w-[30em]"/>
            <Button>Search</Button>
          </div>
          <Button onClick={() => setCreateClientActive(!createClientActive)} className="absolute right-4 top-0">{createClientActive ? "Close" : "New client"}</Button>
        </div>
        <NewClientForm onSuccessfulSubmit={onSuccessfullSubmit} active={createClientActive}/>
        <ul className="p-4 mr-28 flex flex-col gap-2 ">
            {clients.map(client => (<ClientRow key={client.uuid} client={client}/>))}
        </ul>
    </main>
  )
}
