import { useParams } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import { FaUser } from "react-icons/fa";
import Navbar from '../../Navbar';
import TaskList from '@/components/TaskList';
import { CurrentCrmContext } from '@/context/CurrentCrmContext';
import request from '@/utils/request';
import Text from '@/components/Text';

export default function index() {
  const {crm} = useContext(CurrentCrmContext);
  const [employee, setEmployee] = useState<Employee | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [focusTask, setFocusTask] = useState<Task | null>(null)
  const params = useParams();

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
        setEmployee(res.data || null)
      }
    }
  }

  const fetchTasks = async () => {
    if (crm?.crmUuid && employee) {
      let res = await request<Task[]>(`/tasks/by-employee?crmUuid=${crm?.crmUuid}&employeeUuid=${employee?.uuid}`, {}, "GET");
      if (res.code === 200 && res.data) {
        setTasks(res.data);
      }
    }
  }


  return (
    <main className="px-2">
      <Navbar />

      <div className="grid grid-cols-3 max-w-[1440px] m-auto bg-background-dark p-2 my-4 gap-2">
        <div className=" p-2 min-h-32 flex items-center">
          <FaUser className="w-[30%] text-6xl"/>
          <div className="flex flex-col flex-1">
            <span className="text-xl font-semibold">{employee?.firstName} {employee?.lastName}</span>
            <span className={`text-lg ${!employee?.role && "italic"}`}>{employee?.role || <Text text={{eng:"No role was found", swe: "Ingen roll hittades"}} />}</span>
          </div>
        </div>
        <div className=" p-2 px-6 min-h-32 flex justify-between items-center gap-2">
          <div className='flex flex-col gap-2'>
            <span className={`text-lg ${!employee?.email && "italic"}`}>{employee?.email || <Text text={{eng:"No email was found", swe: "Ingen e-postadress hittades"}} />}</span>
            <span className={`text-lg ${!employee?.phoneNumber && "italic"}`}>{employee?.phoneNumber || <Text text={{eng:"No phone number was found", swe: "Inget telefonnummer hittades"}} />}</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className={`text-lg ${!employee?.accessLevel && "italic"}`}>Access level</span>
            <span></span>
          </div>
        </div>
        <div className=" p-2 px-6 min-h-32 flex justify-between items-center gap-2">
          <div className='flex flex-col gap-2'>
            <span className="text-lg font-semibold">Overdue tasks</span>
            <span className="text-md">Ongoing tasks</span>
          </div>
          <div>Contract</div>
        </div>
        
      </div>

      <TaskList focusTask={setFocusTask} showCustomers={false} tasks={tasks} refetchTasks={fetchTasks} />

    </main>
  )
}
