import { useParams } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../../../../../../components/Navbar';
import { CurrentCrmContext } from '@/context/CurrentCrmContext';
import fetchCustomerDetails from '@/utils/fetchCustomerDetails';
import { FaChevronLeft } from "react-icons/fa6";
import Link from 'next/link';
import Entries from '../../../../../../components/Entries';
import Button from '@/components/Button';
import QuickInfo from '../../../../../../components/QuickInfo';
import request from '@/utils/request';
import NewEntryForm from '../../../../../../components/NewEntryForm';
import Meetings from '../../../../../../components/MeetingsList';
import AddMeeting from '@/components/AddMeeting';
import EditMeeting from '../../../../../../components/EditMeeting';
import AddTask from '../../../../../../components/AddTask';
import FocusedTask from '../../../../../../components/FocusedTask';
import CustomerCard from '../../../../../../components/CustomerCard';
import EditCustomer from '../../../../../../components/EditCustomer';
import Text from '@/components/Text';
import Screen from '@/components/Screen';
import { LuMessageSquarePlus, LuMessagesSquare } from "react-icons/lu";
import { BsFileText, BsPencilSquare } from 'react-icons/bs';
import { GrStatusInfo } from 'react-icons/gr';

export interface Statistics {
  meetings_count: number,
  entries_count: number,
  task_count: number,
  tasks_todo_count: number,
}


export default function Index() {
  const params = useParams();
  const {crm} = useContext(CurrentCrmContext);
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [edit, setEdit] = useState<boolean>(false);
  const [entries, setEntries] = useState<Entry[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [newEntryActive, setNewEntryActive] = useState<boolean>(false);
  const [newMeetingActive, setNewMeetingActive] = useState<boolean>(false);
  const [currentView, setCurrentView] = useState<"info" | "entries" | "meetings">("info");
  const [editMeeting, setEditMeeting] = useState<Meeting | null>(null);
  const [statistics, setStatistics] = useState<Statistics>({meetings_count: 0, entries_count: 0, task_count: 0, tasks_todo_count: 0});
  const [addTask, setAddTask] = useState<boolean>(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [focusedTask, setFocusedTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(()=>{
    (async () => {
      await fetchCustomer();
      setLoading(false);
    })();
  },[crm, params])

  useEffect(()=>{
    (async () => {
      await fetchEntries();
      await fetchMeetings();
      await fetchTasks();
      await fetchStatistics();
    })();
  },[customer])

  const fetchStatistics = async () => {
    if (crm?.crmUuid && customer) {
      let res = await request<Statistics>(`/customers/statistics?crmUuid=${crm.crmUuid}&customerUuid=${customer.uuid}`, {}, "GET");
      if (res.code === 200 && res.data) {
        setStatistics(res.data);
      }
    }
  }

  const fetchCustomer = async () => {
    if (crm?.crmUuid && params?.customerUuid) {
      const customer = await fetchCustomerDetails(crm?.crmUuid, params?.customerUuid as string);
      setCustomer(customer)
    }
  }

  const fetchEntries = async () => {
    if (crm?.crmUuid && customer) {
      let res = await request<Entry[]>(`/entries/all?crmUuid=${crm?.crmUuid}&customerUuid=${customer?.uuid}`, {}, "GET");
      if (res.code === 200 && res.data) {
        setEntries(res.data);
        await fetchStatistics();
      }
    }
  }
  const fetchMeetings = async () => {
    if (crm?.crmUuid && customer) {
      let res = await request<Meeting[]>(`/meetings/by-customer?crmUuid=${crm?.crmUuid}&customerUuid=${customer?.uuid}`, {}, "GET");
      if (res.code === 200 && res.data) {
        setMeetings(res.data);
        await fetchStatistics();
      }
    }
  }
  const fetchTasks = async () => {
    if (crm?.crmUuid && customer) {
      let res = await request<Task[]>(`/tasks/by-customer?crmUuid=${crm?.crmUuid}&customerUuid=${customer?.uuid}`, {}, "GET");
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
      <Screen>
        <div className='h-[calc(100dvh-4em)] rounded-md w-full  p-4 bg-background-light bg-opacity-50 flex flex-col lg:flex-row gap-4 overflow-y-scroll scrollthumb'>
          <CustomerCard customer={customer} setEdit={setEdit} edit={edit}/>
          <div className="flex-1 w-full relative">

            <nav>
              <ul className="flex gap-1">
                <li onClick={()=>setCurrentView("info")} className={`${currentView === "info" ? " bg-accent-color text-background-dark" : "bg-background-dark"} clippath transition-colors font-semibold cursor-pointer px-3 py-1 flex gap-2 items-center`}> <GrStatusInfo />Information</li>
                <li onClick={()=>setCurrentView("entries")} className={`${currentView === "entries" ? " bg-accent-color text-background-dark" : "bg-background-dark"} clippath transition-colors font-semibold cursor-pointer px-3 py-1 flex gap-2 items-center`}><BsFileText /><Text text={{eng: "Entries", swe: "Anteckningar"}} /></li>
                <li onClick={()=>setCurrentView("meetings")} className={`${currentView === "meetings" ? " bg-accent-color text-background-dark" : "bg-background-dark"} clippath transition-colors font-semibold cursor-pointer px-3 py-1 flex gap-2 items-center`}><LuMessagesSquare /><Text text={{eng: "Meetings", swe: "Möten"}} /></li>
              </ul>
            </nav>

            {currentView === "entries" ? 
              <Button onClick={() => setNewEntryActive(true)} className='absolute top-0 right-0 flex gap-2 items-center'><BsPencilSquare /><Text text={{eng: "New Entry", swe: "Ny Anteckning"}} /></Button>
              : currentView === "meetings" ?
              <Button onClick={() => setNewMeetingActive(true)} className='absolute top-0 right-0 flex gap-2 items-center'><LuMessageSquarePlus /><Text text={{eng: "New Meeting", swe: "Nytt Möte"}} /></Button>
              : ""
            }

            <div className="mt-3">
              <div className={`${currentView === "info" ? "translate-x-0 opacity-100 pointer-events-auto h-auto" : "translate-x-5 opacity-0 pointer-events-none h-0"} transition-all`}>
                <QuickInfo loading={loading} focusTask={setFocusedTask} customer={customer} statistics={statistics} addingTask={addTask} setAddTask={setAddTask} tasks={tasks} refetchTasks={fetchTasks}/>
              </div>
              <div className={`${currentView === "entries" ? "translate-x-0 opacity-100 pointer-events-auto h-auto" : "translate-x-5 opacity-0 pointer-events-none h-0"} transition-all`}>
                <Entries refetchEntries={fetchEntries} entries={entries} customer={customer} />
              </div>
              <div className={`${currentView === "meetings" ? "translate-x-0 opacity-100 pointer-events-auto h-auto" : "translate-x-5 opacity-0 pointer-events-none h-0"} transition-all`}>
                <Meetings refetchMeetings={fetchMeetings} setEditMeeting={setEditMeeting} meetings={meetings}/>
              </div>
            </div>

          </div>
        </div>
        <div className='absolute bottom-0 right-[15dvh]'>
          <AddMeeting closePopup={() => setNewMeetingActive(false)} active={newMeetingActive} onSuccessfulSubmit={fetchMeetings} withCustomerUuid={customer?.uuid} />
          <EditMeeting closePopup={() => setEditMeeting(null)} _meeting={editMeeting} onSuccessfulSubmit={fetchMeetings} />
        </div>
        {/* <FocusedTask setTask={setFocusedTask} task={focusedTask} refetchTasks={fetchTasks} /> */}
        <AddTask active={addTask} setActive={setAddTask} customer={customer} refetchTasks={fetchTasks} />
        <NewEntryForm active={newEntryActive} refetchEntries={fetchEntries} close={() => setNewEntryActive(false)} customer={customer}/>
        <EditCustomer initialCustomer={customer} active={edit} _setCustomer={setCustomer} setEdit={setEdit}/>
      </Screen>
    )
}
