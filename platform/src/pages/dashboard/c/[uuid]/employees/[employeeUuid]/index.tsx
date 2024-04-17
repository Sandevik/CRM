import { useParams } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import { FaTasks, FaUser } from "react-icons/fa";
import Navbar from '../../../../../../components/Navbar';
import TaskList from '@/components/TaskList';
import { CurrentCrmContext } from '@/context/CurrentCrmContext';
import request from '@/utils/request';
import Text from '@/components/Text';
import Button from '@/components/Button';
import AddTask from '@/components/AddTask';
import { PiPlugsFill, PiPlugsConnectedFill  } from "react-icons/pi";
import { ImProfile } from "react-icons/im";
import Link from 'next/link';
import { MdEmail, MdLocalPhone  } from "react-icons/md";
import { FaPen } from 'react-icons/fa';
import { BsChevronRight, BsQuestionCircle } from 'react-icons/bs';
import Input from '@/components/Input';
import text from '@/utils/text';
import { AuthContext } from '@/context/AuthContext';
import Switch from '@/components/Switch';
import Screen from '@/components/Screen';
import { IoIosTimer, IoMdSettings } from 'react-icons/io';
import AdditionalEmployeeDetails from '@/components/AdditionalEmployeeDetails';
import EmployeeSettings from '@/views/EmployeeSettings';
import EmployeeTasks from '@/views/EmployeeTasks';
import EmployeeTimeReports from '@/views/EmployeeTimeReports';


export default function Index() {
  const {crm} = useContext(CurrentCrmContext);
  const {data} = useContext(AuthContext);
  const [employee, setEmployee] = useState<Employee>({} as Employee);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [focusTask, setFocusTask] = useState<Task | null>(null);
  const [addTask, setAddTask] = useState<boolean>(false);
  const params = useParams();
  const [edit, setEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [expand, setExpand] = useState<boolean>(false);
  const [selectedTab, setSelectedTab] = useState<"time" | "settings" | "tasks">("tasks");

 


  useEffect(()=>{
    fetchEmployee();
  }, [crm, params])

  useEffect(()=>{
    if (employee && employee.uuid){
      fetchTasks();
    }
  },[employee])

  useEffect(()=>{fetchEmployee()},[params])

  const createEmployeeUser = async () => {
    if (crm?.crmUuid && params?.employeeUuid) {
      const res = await request<string>(`/employees/create-user-account`, {crmUuid: crm.crmUuid, employeeUuid: params?.employeeUuid}, "POST");
      if (res.code === 200) {
        fetchEmployee();
        alert(res.data != null ? text({swe: "Nytt konto skapades, kom ihåg följande lösenord - det kommer inte visas igen: ", eng: "A new account was created, remember the following password - it will not be shown again: "}, data) + res.data : text({swe: "Existerande konto länkades", eng: "Existing account successfully linked"}, data));
      }
    }
  }

  const fetchEmployee = async () => {
    if (crm?.crmUuid && params?.employeeUuid) {
      const res = await request<Employee>(`/employees?crmUuid=${crm.crmUuid}&employeeUuid=${params.employeeUuid}`, {}, "GET");
      if (res.code === 200) {
        setEmployee(res.data || {} as Employee)
      }
    }
  }

  const fetchTasks = async () => {
    if (crm?.crmUuid && employee && !edit) {
      let res = await request<Task[]>(`/tasks/by-employee?crmUuid=${crm?.crmUuid}&employeeUuid=${employee?.uuid}`, {}, "GET");
      if (res.code === 200 && res.data) {
        setTasks(res.data);
        setLoading(false);
      }
    }
  }

  const handleEdit = async () => {
    if (edit) {
      if (crm?.crmUuid) {
        let res = await request("/employees/update", {...employee, crmUuid: crm?.crmUuid}, "POST"); 
        if (res.code == 200) {
          setEdit(!edit);
        } else {
          alert(res.message);
        }
      }
    } else {
      setExpand(true);
    }
    setEdit(!edit);
  }

  

  return (
    <Screen>

      <div className="flex flex-col items-center lg:grid lg:grid-cols-3 bg-background-dark my-2 gap-2">
        <div className=" p-2 min-h-20 flex items-center min-w-[90vw] lg:min-w-full">
          <FaUser className="w-[30%] text-6xl"/>
          <div className="flex flex-col flex-1">
            <span className="text-xl font-semibold truncate">{employee?.firstName} {employee?.lastName}</span>
            <div className={`text-lg truncate flex justify-between gap-2 pr-1`}>{employee?.role || <span className={`${!employee?.role && "italic text-md"}`}><Text text={{eng:"No role was found", swe: "Ingen roll hittades"}} /></span>} {employee.isAdmin && <span><Text text={{swe:"Administratör", eng: "Administrator"}}/></span>}</div>
          </div>
        </div>
        <div className=" p-2 px-6 min-h-20 flex justify-between items-center gap-2 border-r-2 pr-4 border-l-2 pl-4 min-w-[90vw] lg:min-w-full">
          <div className='flex flex-col gap-2'>
            {edit ? <Input className='bg-background-light w-full' placeholder={"john.doe@email.com"} value={employee?.email || ""} onChange={(e) => setEmployee({...employee, email: e.target.value})}/> : employee?.email ? <Link href={`mailto:${employee.email}`} className={`text-md truncate text-accent-color flex gap-2 items-center`}><MdEmail className="translate-y-[2px]"/>{employee.email}</Link> : <span className="truncate italic"><Text text={{eng:"No email was found", swe: "Ingen e-postadress hittades"}} /></span>}
            {edit ? <Input className='bg-background-light w-full' value={employee?.phoneNumber || ""} onChange={(e) => setEmployee({...employee, phoneNumber: e.target.value})}/> : employee?.phoneNumber ? <Link href={`tel:${employee.phoneNumber}`} className={`text-md truncate text-accent-color flex gap-2 items-center`}><MdLocalPhone className="translate-y-[2px]" />{employee.phoneNumber}</Link> : <span className="truncate italic"><Text text={{eng:"No phone number was found", swe: "Inget telefonnummer hittades"}} /></span>}
          </div>
          <div className="flex flex-col gap-2">
            <span className='text-md text-right'><Text text={{eng: "User Account", swe: "Användarkonto"}} /> </span>
            <span className={`text-lg ${!employee?.userUuid && "italic text-md"} w-full flex justify-between gap-2 items-center relative`}>{!employee?.userUuid ? <PiPlugsFill className="text-light-red text-2xl" /> : <PiPlugsConnectedFill className="text-green-300 text-2xl" />}{!employee?.userUuid ? <Button disabled={!employee.email || !employee.phoneNumber} onClick={() => createEmployeeUser()}><Text text={{eng: "Connect", swe: "Anslut"}} /></Button> : <Text text={{eng: "Connected", swe: "Anslutet"}} />}</span>
          </div>
        </div>
        <div className=" p-2 min-h-20 flex justify-between items-center gap-2 min-w-[90vw] lg:min-w-full">
          <div className="flex flex-col gap-2">
            <span><Text text={{eng: "Contract", swe: "Kontrakt"}} /></span>
            <span className='flex gap-2 items-center'> {employee?.contract_uuid ? <Link href={`/dashboard/c/${crm?.crmUuid}/employees/${employee?.uuid}/contract`} className='flex gap-2 items-center text-lg'><span className="underline text-accent-color"><Text text={{eng: "Active", swe: "Aktivt"}} /></span> </Link> : <Button onClick={()=>alert("todo")}><Text text={{eng: "Write", swe: "Skriv"}} /></Button>} <ImProfile className={`text-2xl translate-y-[1px] ${employee?.contract_uuid ? "text-green-300" : "text-light-red"}`} /></span>
          </div>
          <div className='flex flex-col gap-2'>
            <button onClick={() => handleEdit()} className="flex gap-2 items-center hover:text-accent-color transition-colors"><FaPen /><Text text={edit ? {eng: "Save", swe: "Spara"} : {eng:"Edit", swe:"Ändra"}} /></button>
          </div>
        </div>
        
      </div>

      <AdditionalEmployeeDetails expand={expand} setExpand={setExpand} employee={employee} />

      <nav className="flex gap-2 ">
        <button className={`${selectedTab === "tasks" && "text-black clippath bg-accent-color z-10 "} gap-2 px-4 pb-1 pt-0.5 text-lg font-semibold cursor-pointer transition-colors hover:text-greenish flex  items-center`} onClick={() => setSelectedTab("tasks")}><FaTasks /><Text text={{swe: "Uppgifter", eng: "Tasks"}}/></button>
        <button className={`${selectedTab === "time" && "text-black clippath bg-accent-color z-10 "} gap-2 px-4 pb-1 pt-0.5 text-lg font-semibold cursor-pointer transition-colors hover:text-greenish flex items-center `} onClick={() => setSelectedTab("time")}><IoIosTimer /><Text text={{swe: "Tidsrapporteringar", eng: "Time Reports"}}/></button>
        <button className={`${selectedTab === "settings" && "text-black clippath bg-accent-color z-10 "} gap-2 px-4 pb-1 pt-0.5 text-lg font-semibold cursor-pointer transition-colors hover:text-greenish flex items-center`} onClick={() => setSelectedTab("settings")}><IoMdSettings /><Text text={{swe: "Anställningsinställningar", eng: "Employee Settings"}}/></button>
      </nav>

      <div className={`relative ${expand ? "h-[calc(100dvh-23.15em)]" : "h-[calc(100dvh-16.65em)]"} `}>
        <EmployeeTasks tasks={tasks} selectedTab={selectedTab} loading={loading} fetchTasks={fetchTasks} setFocusTask={setFocusTask} setAddTask={setAddTask} />
        <EmployeeTimeReports selectedTab={selectedTab} />
        <EmployeeSettings employee={employee} fetchEmployee={fetchEmployee} selectedTab={selectedTab}/>
      </div>
      
      <AddTask active={addTask} setActive={setAddTask} refetchTasks={fetchTasks} employee={employee} />

      
      </Screen>
  )
}
