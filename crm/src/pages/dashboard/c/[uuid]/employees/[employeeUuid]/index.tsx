import { useParams } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import { FaUser } from "react-icons/fa";
import Navbar from '../../Navbar';
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
import { BsChevronRight } from 'react-icons/bs';
import Input from '@/components/Input';
import text from '@/utils/text';


export default function Index() {
  const {crm} = useContext(CurrentCrmContext);
  const [employee, setEmployee] = useState<Employee>({} as Employee);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [focusTask, setFocusTask] = useState<Task | null>(null);
  const [addTask, setAddTask] = useState<boolean>(false);
  const params = useParams();
  const [edit, setEdit] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [expand, setExpand] = useState<boolean>(false);

  useEffect(()=>{
    fetchEmployee();
  }, [crm, params])

  useEffect(()=>{
    if (employee){
      fetchTasks();
    }
  },[employee])

  useEffect(()=>{fetchEmployee()},[])

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

  const connectEmployeeToAccount = () => {
    alert("todo")
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
    <main className="px-2  max-w-[1800px] m-auto">
      <Navbar />

      <div className="grid grid-cols-3 bg-background-dark my-2 gap-2">
        <div className=" p-2 min-h-20 flex items-center">
          <FaUser className="w-[30%] text-6xl"/>
          <div className="flex flex-col flex-1">
            <span className="text-xl font-semibold truncate">{employee?.firstName} {employee?.lastName}</span>
            <span className={`text-lg ${!employee?.role && "italic"} truncate`}>{employee?.role || <Text text={{eng:"No role was found", swe: "Ingen roll hittades"}} />}</span>
          </div>
        </div>
        <div className=" p-2 px-6 min-h-20 flex justify-between items-center gap-2 border-r-2 pr-4 border-l-2 pl-4">
          <div className='flex flex-col gap-2 '>
            {edit ? <Input className='bg-background-light w-full' placeholder={"john.doe@email.com"} value={employee?.email || ""} onChange={(e) => setEmployee({...employee, email: e.target.value})}/> : employee?.email ? <Link href={`mailto:${employee.email}`} className={`text-md truncate text-light-blue flex gap-2 items-center`}><MdEmail className="translate-y-[2px]"/>{employee.email}</Link> : <span className="truncate italic"><Text text={{eng:"No email was found", swe: "Ingen e-postadress hittades"}} /></span>}
            {edit ? <Input className='bg-background-light w-full' value={employee?.phoneNumber || ""} onChange={(e) => setEmployee({...employee, phoneNumber: e.target.value})}/> : employee?.phoneNumber ? <Link href={`tel:${employee.phoneNumber}`} className={`text-md truncate text-light-blue flex gap-2 items-center`}><MdLocalPhone className="translate-y-[2px]" />{employee.phoneNumber}</Link> : <span className="truncate italic"><Text text={{eng:"No phone number was found", swe: "Inget telefonnummer hittades"}} /></span>}
          </div>
          <div className="flex flex-col gap-2  ">
            <span className='text-md text-right'><Text text={{eng: "User Account", swe: "Användarkonto"}} /></span>
            <span className={`text-lg ${!employee?.userUuid && "italic"} w-full flex justify-between gap-2 items-center`}>{!employee?.userUuid ? <PiPlugsFill className="text-light-red text-2xl" /> : <PiPlugsConnectedFill className="text-green-300 text-2xl" />}{!employee?.userUuid ? <Button onClick={() => connectEmployeeToAccount()}><Text text={{eng: "Connect", swe: "Anslut"}} /></Button> : <Text text={{eng: "Connected", swe: "Ansluten"}} />}</span>
          </div>
        </div>
        <div className=" p-2 min-h-20 flex justify-between items-center gap-2">
          <div className="flex flex-col gap-2">
            <span><Text text={{eng: "Contract", swe: "Kontrakt"}} /></span>
            <span className='flex gap-2 items-center'> {employee?.contract_uuid ? <Link href={`/dashboard/c/${crm?.crmUuid}/employees/${employee?.uuid}/contract`} className='flex gap-2 items-center text-lg'><span className="underline text-light-blue"><Text text={{eng: "Active", swe: "Aktivt"}} /></span> </Link> : <Button onClick={()=>alert("todo")}><Text text={{eng: "Write", swe: "Skriv"}} /></Button>} <ImProfile className={`text-2xl translate-y-[1px] ${employee?.contract_uuid ? "text-green-300" : "text-light-red"}`} /></span>
          </div>
          <div className='flex flex-col gap-2'>
            <button onClick={() => handleEdit()} className="flex gap-2 items-center hover:text-light-blue transition-colors"><FaPen /><Text text={edit ? {eng: "Save", swe: "Spara"} : {eng:"Edit", swe:"Ändra"}} /></button>
          </div>
        </div>
        
      </div>

      <div>
        <button onClick={() => setExpand(!expand)} className="flex gap-2 items-center text-light-blue"><BsChevronRight className={expand ? "rotate-90" : "rotate-0" + " transition-transform"}/><Text text={expand ? {eng: "View Less", swe: "Visa Mindre"}:{eng: "View More", swe: "Visa Mer"}}/></button>
        <div className={`${expand ? "h-20 pointer-events-auto opacity-100": "h-0 pointer-events-none opacity-0"} transition-all p-4 grid grid-cols-3`}>
          
          <div>
            <div className="grid grid-cols-2">
              <span className={`${!employee?.address && "italic"}`}>{employee?.address || <Text text={{eng:"No address was found", swe: "Ingen address hittades"}} />}</span>
              <span className={`${!employee?.zipCode && "italic"}`}>{employee?.zipCode || <Text text={{eng:"No zip code was found", swe: "Ingen postkod hittades"}} />}</span>
            </div>
            <div className="grid grid-cols-2">
              <span className={`${!employee?.country && "italic"}`}>{employee?.country || <Text text={{eng:"No country was found", swe: "Inget land hittades"}} />}</span>
              <span className={`${!employee?.city && "italic"}`}>{employee?.city || <Text text={{eng:"No city was found", swe: "Ingen stad hittades"}} />}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-2">
            <div className="flex flex-col ">
              <span className={`${!employee?.ssn && "italic"}`}>{employee?.ssn || <Text text={{eng:"No social security number was found", swe: "Inget personnummer hittades"}} />}</span>
              <span className={`${!employee?.dateOfBirth && "italic"}`}>{employee?.dateOfBirth || <Text text={{eng:"No date of birth was found", swe: "Inget födelsedagsdatum hittades"}} />}</span>
            </div>
            <span className={`${!employee?.accessLevel && "italic"}`}>{employee?.accessLevel || <Text text={{eng:"No access level was found", swe: "Ingen access nivå hittades"}} />}</span>

          </div>
          
          <div>
            <div className="grid grid-cols-2">
              <div className="flex flex-col">
                <span className={`${!employee?.drivingLicenseClass && "italic"}`}>{employee?.drivingLicenseClass || <Text text={{eng:"No driving license class was found", swe: "Ingen körkortsklass hittades"}} />}</span>
                <span className={`${!employee?.periodOfValidity && "italic"}`}>{employee?.periodOfValidity || <Text text={{eng:"No period of validity was found", swe: "Ingen valitetsperiod hittades"}} />}</span>
              </div>
            
              <div className="flex flex-col ">
                <span>added {new Date(employee?.added || "").toLocaleDateString() + " " + new Date(employee?.added || "").toLocaleTimeString() || ""}</span>
                <span>updated {new Date(employee?.updated || "").toLocaleDateString() + " " + new Date(employee?.updated || "").toLocaleTimeString() || ""}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      
      <div className={`my-4 p-2 rounded-md`}>
        <div className="flex justify-between items-center w-full mb-1">
          <span className='font-semibold'>{tasks.length > 0 &&<Text text={{eng: "Tasks", swe: "Uppgifter"}} />}</span>
          <Button onClick={() => setAddTask(true)}><Text text={{eng: "Add Task", swe: "Ny Uppgift"}} /></Button>
        </div>
        <TaskList loading={loading} focusTask={setFocusTask} showCustomers={false} tasks={tasks} refetchTasks={fetchTasks} />
      </div>
      <AddTask active={addTask} setActive={setAddTask} refetchTasks={fetchTasks} employee={employee} />
    </main>
  )
}
