import { useParams } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../../Navbar';
import { CurrentCrmContext } from '@/context/CurrentCrmContext';
import fetchClientDetails from '@/utils/fetchClientDetails';
import { FaChevronRight, FaChevronLeft } from "react-icons/fa6";
import Link from 'next/link';
import ClientCard from './ClientCard';
import EditClient from './EditClient';


export default function index() {
  const params = useParams();
  const {crm} = useContext(CurrentCrmContext);
  const [client, setClient] = useState<Client | null>(null);
  const [edit, setEdit] = useState<boolean>(false);

  useEffect(()=>{
    (async () => {
      if (crm?.crmUuid && params?.clientUuid) {
        const client = await fetchClientDetails(crm?.crmUuid, params?.clientUuid as string);
        setClient(client)
      }
    })();
  },[crm, params])


    return (
      <div className='relative p-4'>
        <Navbar />
        <Link href={`/dashboard/c/${crm?.crmUuid}/clients`} className="flex gap-2 items-center text-lg bg-light-blue hover:bg-greenish transition-colors absolute top-[4.2em] px-2 text-black rounded-md"><FaChevronLeft /> <div>Clients</div> </Link>
        <main className='h-[calc(100dvh-11em)] rounded-md w-full mt-12 p-4 bg-background-light bg-opacity-50 flex'>
          <ClientCard client={client} setEdit={setEdit} edit={edit}/>
          <div className="flex-1">

          </div>
        </main>
        <EditClient initialClient={client} active={edit} onSuccessfulSubmit={() => {}} setEdit={setEdit}/>
      </div>
    )
}
