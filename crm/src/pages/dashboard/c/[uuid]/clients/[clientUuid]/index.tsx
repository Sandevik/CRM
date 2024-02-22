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
import EditMeeting from './EditMeeting';
import AddTask from './AddTask';
import FocusedTask from './FocusedTask';

export interface Statistics {
  meetings_count: number,
  entries_count: number,
  task_count: number,
  tasks_todo_count: number,
}


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
  const [editMeeting, setEditMeeting] = useState<Meeting | null>(null);
  const [statistics, setStatistics] = useState<Statistics>({meetings_count: 0, entries_count: 0, task_count: 0, tasks_todo_count: 0});
  const [addTask, setAddTask] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [focusedTask, setFocusedTask] = useState<Task | null>(null);

  useEffect(()=>{
    (async () => {
      await fetchClient();
    })();
  },[crm, params])

  useEffect(()=>{
    (async () => {
      await fetchEntries();
      await fetchMeetings();
      await fetchTasks();
      await fetchStatistics();
    })();
  },[client])

  const fetchStatistics = async () => {
    if (crm?.crmUuid && client) {
      let res = await request<Statistics>(`/clients/statistics?crmUuid=${crm.crmUuid}&clientUuid=${client.uuid}`, {}, "GET");
      if (res.code === 200 && res.data) {
        setStatistics(res.data);
      }
    }
  }

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
        await fetchStatistics();
      }
    }
  }
  const fetchMeetings = async () => {
    if (crm?.crmUuid && client) {
      let res = await request<Meeting[]>(`/meetings/by-client?crmUuid=${crm?.crmUuid}&clientUuid=${client?.uuid}`, {}, "GET");
      if (res.code === 200 && res.data) {
        setMeetings(res.data);
        await fetchStatistics();
      }
    }
  }
  const fetchTasks = async () => {
    if (crm?.crmUuid && client) {
      let res = await request<Task[]>(`/tasks/by-client?crmUuid=${crm?.crmUuid}&clientUuid=${client?.uuid}`, {}, "GET");
      if (res.code === 200 && res.data) {
        setTasks(res.data);
        await fetchStatistics();
      }
    }
  }

  
  

  useEffect(()=>{
    setNewEntryActive(false);
    setNewMeetingActive(false);
    setEditMeeting(null);
    setAddTask(false);
    setFocusedTask(null);
  },[currentView])

  return (
      <div className='relative'>
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
              <QuickInfo focusTask={setFocusedTask} client={client} statistics={statistics} addingTask={addTask} setAddTask={setAddTask} tasks={tasks} refetchTasks={fetchTasks}/>
              : currentView === "entries" ?
              <Entries refetchEntries={fetchEntries} entries={entries} client={client} />
              : 
              <Meetings refetchMeetings={fetchMeetings} setEditMeeting={setEditMeeting} meetings={meetings}/>
            }
            </div>

          </div>
        </main>
        <div className='absolute bottom-0 right-[15dvh]'>
          <AddMeeting closePopup={() => setNewMeetingActive(false)} active={newMeetingActive} onSuccessfulSubmit={fetchMeetings} withClientUuid={client?.uuid} />
          <EditMeeting closePopup={() => setEditMeeting(null)} _meeting={editMeeting} onSuccessfulSubmit={fetchMeetings} />
        </div>
        {/* <FocusedTask setTask={setFocusedTask} task={focusedTask} refetchTasks={fetchTasks} /> */}
        <AddTask active={addTask} setActive={setAddTask} client={client} refetchTasks={fetchTasks} />
        <NewEntryForm active={newEntryActive} refetchEntries={fetchEntries} close={() => setNewEntryActive(false)} client={client}/>
        <EditClient initialClient={client} active={edit} _setClient={setClient} setEdit={setEdit}/>
      </div>
    )
}
