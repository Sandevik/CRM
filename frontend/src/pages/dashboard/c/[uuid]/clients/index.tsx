import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../Navbar'
import { CurrentCrmContext } from '@/context/CurrentCrmContext'
import Button from '@/components/Button';
import NewClientForm from './NewClientForm';
import request from '@/utils/request';
import ClientRow from './ClientRow';
import Input from '@/components/Input';
import ClientRowHeading from './ClientRowHeading';
import { GiAstronautHelmet } from "react-icons/gi";
import Image from 'next/image';

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
    <main className='relative p-4'>
        <Navbar />
        {clients.length > 0 ? 
        <div className='sticky mt-2  flex justify-center top-[130px]'>
          <div className="flex gap-2 bg-background-dark bg-opacity-60">
            <Input placeholder="Search" className="w-[30em]"/>
            <Button>Search</Button>
          </div> 
          <Button onClick={() => setCreateClientActive(!createClientActive)} className="absolute right-4 top-14 md:top-0 z-20">{createClientActive ? "Close" : "New client"}</Button>
        </div>
        : ""}
        <NewClientForm setCreateClientActive={setCreateClientActive} onSuccessfulSubmit={onSuccessfullSubmit} active={createClientActive}/>
        {clients.length > 0 ? 
        <ul className="p-4 mr-28 flex flex-col gap-2 ">
            <ClientRowHeading />
            {clients.map(client => (<ClientRow key={client.uuid} client={client}/>))}
        </ul>
        : <div className="flex justify-center items-center text-2xl mt-16 h-full flex-col gap-4">
            <span>Oops, it seems like you do not yet have any clients. Create one</span>
            <Image className="" src={"/astronaut.svg"} alt="astronaut" width={200} height={200}/>
          </div>}
    </main>
  )
}
