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
import Meetings from './Meetings';
import AddMeeting from '@/components/AddMeeting';


export default function index() {
  const params = useParams();
  const {crm} = useContext(CurrentCrmContext);
  const [client, setClient] = useState<Client | null>(null);
  const [edit, setEdit] = useState<boolean>(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [newEntryActive, setNewEntryActive] = useState<boolean>(false);
  const [newMeetingActive, setNewMeetingActive] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<"quick" | "entries" | "meetings">("quick");

  useEffect(()=>{
    (async () => {
      await fetchClient();
    })();
  },[crm, params])

  useEffect(()=>{
    (async () => {
      await fetchEntries()
      await fetchMeetings()
    })();
  },[client])

  const fetchClient = async () => {
    if (crm?.crmUuid && params?.clientUuid) {
      const client = await fetchClientDetails(crm?.crmUuid, params?.clientUuid as string);
      setClient(client)
    }
  }

  const fetchEntries = async () => {
    if (crm?.crmUuid && client) {
      let res = await request<Entry[]>(`/entries/all?crmUuid=${crm?.crmUuid}&clientUuid=${client?.uuid}`, {}, "GET");
      if (res.code === 200 && res.data) {
        setEntries(res.data);
      }
    }
  }
  const fetchMeetings = async () => {
    if (crm?.crmUuid && client) {
      let res = await request<Meeting[]>(`/meetings/by-client?crmUuid=${crm?.crmUuid}&clientUuid=${client?.uuid}`, {}, "GET");
      if (res.code === 200 && res.data) {
        setMeetings(res.data);
      }
    }
  }

  useEffect(()=>{
    setNewEntryActive(false);
    setNewMeetingActive(false);
  },[currentView])

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

            {currentView === "entries" ? 
              <Button onClick={() => setNewEntryActive(true)} className='absolute top-0 right-0'>New Entry</Button>
              : currentView === "meetings" ?
              <Button onClick={() => setNewMeetingActive(true)} className='absolute top-0 right-0'>New Meeting</Button>
              : ""
            }

            <div className="mt-3">
            {currentView === "quick" ?
              <QuickInfo />
              : currentView === "entries" ?
              <Entries refetchEntries={fetchEntries} entries={entries} client={client} />
              : 
              <Meetings meetings={meetings}/>
            }
            </div>

          </div>
        </main>
        <div className='absolute bottom-0 right-[15dvh]'>
          <AddMeeting closePopup={() => setNewMeetingActive(false)} active={newMeetingActive} onSuccessfulSubmit={fetchMeetings} withClientUuid={client?.uuid} />
        </div>
        <NewEntryForm active={newEntryActive} refetchEntries={fetchEntries} close={() => setNewEntryActive(false)} client={client}/>
        <EditClient initialClient={client} active={edit} _setClient={setClient} setEdit={setEdit}/>
      </div>
    )
}
