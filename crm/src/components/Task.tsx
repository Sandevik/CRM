import Button from '@/components/Button';
import { CurrentCrmContext } from '@/context/CurrentCrmContext';
import fetchCustomerDetails from '@/utils/fetchCustomerDetails';
import request from '@/utils/request';
import Link from 'next/link';
import React, { useContext, useEffect, useState } from 'react'
import { FaTriangleExclamation, FaCircleCheck } from "react-icons/fa6";
import { RiRestartLine } from "react-icons/ri";
import { TiCog } from "react-icons/ti";


export default function Task({task, refetchTasks, focusTask, showCustomer}: {showCustomer: boolean, task: Task, refetchTasks: () => Promise<void>, focusTask: (task: Task | null) => void}) {
  const {crm} = useContext(CurrentCrmContext);
  const percentage: number = (task?.percentage || 0) > 100 ? 100 : (task?.percentage || 0) < 0 ? 0 : (task?.percentage || 0);

  const [customer, setCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    (async () => {
        if (task.customerUuid && crm?.crmUuid){
          setCustomer(await fetchCustomerDetails(crm.crmUuid, task.customerUuid));
        }
      })();
  },[crm, task, showCustomer])

  const completeTask = async () => {
    if(crm?.crmUuid) {
      const res = await request("/tasks/complete", {crmUuid: crm.crmUuid, taskUuid: task.uuid}, "POST")
      if (res.code === 200) {
        await refetchTasks();
      } 
    }
  }


  return (
    <li className="h-11 hover:z-30 z-0 min-w-40 sm:w-full max-w-72">

    <div className={`min-w-40 sm:w-full max-w-72 rounded-sm bg-background-light p-2 relative overflow-hidden h-11 task ${task.recurrence === null && !task.percentage ? "hover:h-32" :task.status === "Completed" ? "hover:h-24" : "hover:h-44"} transition-all flex flex-col items-center hover:items-start gap-2 `}>
      {task.deadline !== null && <LoadingBar completed={task.status === "Completed" || (task.recurrence !== null && Date.now() < new Date(task.start || "").getTime())} percentage={percentage} />}
      <div className='flex justify-between w-full items-center gap-6 capitalize'>
        <div className="truncate font-semibold flex gap-2 items-center">{task.recurrence !== null && <RiRestartLine className="text-gray-400" />} <span>{task.title}</span></div>
        {task.status === "Completed" || (task.recurrence !== null && Date.now() < new Date(task.start || "").getTime()) ? <FaCircleCheck className="text-green-200"/> : task.deadline !== null && percentage !== 0 && (percentage >= 85 && <FaTriangleExclamation className={`${percentage === 100 ? "text-light-red" : "text-yellow-200"}`} />)}
      </div>

      <div className='flex-col h-full w-full task-content'>
        
        {!(task.status === "Completed") && (percentage >= 85 && <div className={`${percentage === 100 ? "text-light-red" : "text-yellow-200"}`}>{percentage === 100 ? "This task has exceeded its deadline" : "This task is about to exceed deadline"}</div>)}
        {task.recurrence !== null && <div className="">This task reccurs <span className="underline">{task.recurrence}</span></div>}
        <div>{(task.recurrence !== null && Date.now() < new Date(task.start || "").getTime()) && "Task completed this period, reccurs: " + new Date(task.start || "").toLocaleDateString()}</div>
        
        <div className={`absolute ${task.status === "Completed" || (task.recurrence !== null && Date.now() < new Date(task.start || "").getTime()) ? "bottom-0" : "bottom-9"} flex flex-col h-12 w-[95%] gap-2`}>
          <div className='w-full flex justify-between items-center'>
            {showCustomer && <div><Link className="text-greenish" href={`/dashboard/c/${crm?.crmUuid}/customers/${customer?.uuid}`}>{customer?.firstName} {customer?.lastName}</Link></div>}
            <TiCog onClick={() => focusTask(task)} className="text-3xl hover:rotate-45 transition-all hover:text-light-blue cursor-pointer"/>
          </div>
          {(!(task.status === "Completed") && !(task.recurrence !== null && Date.now() < new Date(task.start || "").getTime())) && <Button onClick={()=>completeTask()}>Complete</Button>}
        </div>


      </div>


    </div>
    </li>  
  )
}

const LoadingBar = ({percentage, completed}: {percentage: number, completed: boolean}) => {
  return (
    <div className={`absolute bottom-2 h-1 bg-white w-full -m-2 `}>
      <div style={{"--percentage": percentage.toString()+"%"} as any} className={`h-1 w-full ${completed ? "rounded-none bg-green-200 left-0" : percentage === 100 ? "rounded-none bg-light-red left-0" : percentage >= 85 ? "rounded-none bg-yellow-200 left-0 translate-x-[calc(-100%+var(--percentage))]" : "rounded-r-md bg-blue-500 left-0 translate-x-[calc(-100%+var(--percentage))]"} absolute bottom-0 after:content `}></div>
    </div>
  )
}