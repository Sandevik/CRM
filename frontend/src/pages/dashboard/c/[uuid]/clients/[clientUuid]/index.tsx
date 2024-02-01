import { useParams } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../../Navbar';
import { CurrentCrmContext } from '@/context/CurrentCrmContext';
import fetchClientDetails from '@/utils/fetchClientDetails';
import { FaChevronRight, FaChevronLeft } from "react-icons/fa6";
import Link from 'next/link';
import ClientCard from './ClientCard';
import EditClient from './EditClient';
import Entries from './Entries';
import Button from '@/components/Button';
import QuickInfo from './QuickInfo';
import request from '@/utils/request';
import NewEntryForm from './NewEntryForm';


export default function index() {
  const params = useParams();
  const {crm} = useContext(CurrentCrmContext);
  const [client, setClient] = useState<Client | null>(null);
  const [edit, setEdit] = useState<boolean>(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [newEntryActive, setNewEntryActive] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<"quick" | "entries" | "meetings">("quick");

  useEffect(()=>{
    (async () => {
      if (crm?.crmUuid && params?.clientUuid) {
        const client = await fetchClientDetails(crm?.crmUuid, params?.clientUuid as string);
        setClient(client)
      }
    })();
  },[crm, params])

  useEffect(()=>{
    (async () => {
      await fetchEntries()
    })();
  },[client])

  const fetchEntries = async () => {
    if (crm?.crmUuid && client) {
      let res = await request<Entry[]>(`/entries/all?crmUuid=${crm?.crmUuid}&clientUuid=${client?.uuid}`, {}, "GET");
      if (res.code === 200 && res.data) {
        setEntries(res.data);
      }

    }
  }

  return (
      <div className='relative p-4'>
        <Navbar />
        <Link href={`/dashboard/c/${crm?.crmUuid}/clients`} className="flex gap-2 items-center text-lg bg-light-blue hover:bg-greenish transition-colors absolute top-[4.2em] px-2 text-black rounded-md"><FaChevronLeft /> <div>Clients</div> </Link>
        <main className='h-[calc(100dvh-11em)] rounded-md w-full mt-12 p-4 bg-background-light bg-opacity-50 flex gap-4'>
          <ClientCard client={client} setEdit={setEdit} edit={edit}/>
          <div className="flex-1 w-full relative">

            <nav>
              <ul className="flex gap-1">
                <li onClick={()=>setCurrentView("quick")} className={`${currentView === "quick" ? " bg-light-blue text-background-dark" : "bg-background-dark"} clippath transition-colors font-semibold cursor-pointer px-2 py-1`}>Quick Info</li>
                <li onClick={()=>setCurrentView("entries")} className={`${currentView === "entries" ? " bg-light-blue text-background-dark" : "bg-background-dark"} clippath transition-colors font-semibold cursor-pointer px-2 py-1`}>Entries</li>
                <li onClick={()=>setCurrentView("meetings")} className={`${currentView === "meetings" ? " bg-light-blue text-background-dark" : "bg-background-dark"} clippath transition-colors font-semibold cursor-pointer px-2 py-1`}>Meetings</li>
              </ul>
            </nav>

            {currentView === "entries" && <Button onClick={() => setNewEntryActive(true)} className='absolute top-0 right-0'>New Entry</Button>}

            <div className="mt-3">
            {currentView === "quick" ?
              <QuickInfo />
              : currentView === "entries" ?
              <Entries refetchEntries={fetchEntries} entries={entries} client={client} />
              : 
              <div>meetings</div>
            }
            </div>

          </div>
        </main>
        <NewEntryForm active={newEntryActive} refetchEntries={fetchEntries} close={() => setNewEntryActive(false)} client={client}/>
        <EditClient initialClient={client} active={edit} onSuccessfulSubmit={() => {}} setEdit={setEdit}/>
      </div>
    )
}
