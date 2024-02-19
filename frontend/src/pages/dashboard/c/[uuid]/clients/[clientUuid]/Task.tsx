import Button from '@/components/Button';
import { CurrentCrmContext } from '@/context/CurrentCrmContext';
import request from '@/utils/request';
import React, { useContext } from 'react'
import { FaTriangleExclamation, FaCircleCheck } from "react-icons/fa6";
import { RiRestartLine } from "react-icons/ri";
import { TiCog } from "react-icons/ti";


export default function Task({task, refetchTasks, focusTask}: {task: Task, refetchTasks: () => Promise<void>, focusTask: (task: Task) => void}) {
  const {crm} = useContext(CurrentCrmContext);
  const percentage: number = (task?.percentage || 0) > 100 ? 100 : (task?.percentage || 0) < 0 ? 0 : (task?.percentage || 0);

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

    <div className='min-w-40 sm:w-full max-w-72 rounded-sm bg-background-light p-2 relative overflow-hidden h-11 task hover:h-44 transition-all flex flex-col items-center hover:items-start gap-2 '>
      {task.deadline !== null && <LoadingBar completed={task.status === "Completed" || (task.recurrence !== null && Date.now() < new Date(task.start || "").getTime())} percentage={percentage} />}
      <div className='flex justify-between w-full items-center gap-6 capitalize'>
        <div className="truncate font-semibold flex gap-2 items-center">{task.recurrence !== null && <RiRestartLine className="text-gray-400" />} <span>{task.title}</span></div>
        {task.status === "Completed" || (task.recurrence !== null && Date.now() < new Date(task.start || "").getTime()) ? <FaCircleCheck className="text-green-200"/> : task.deadline !== null && percentage !== 0 && (percentage >= 90 && <FaTriangleExclamation className={`${percentage === 100 ? "text-light-red" : "text-yellow-200"}`} />)}
      </div>

      <div className=' flex-col justify-between h-full w-full task-content'>
        {(percentage >= 90 && <div className={`${percentage === 100 ? "text-light-red" : "text-yellow-200"}`}>{percentage === 100 ? "This task has exceeded its deadline" : "This task is about to exceed its deadline"}</div>)}
        {task.recurrence !== null && <div className="">This task reccurs <span className="underline">{task.recurrence}</span></div>}
        <div>{(task.recurrence !== null && Date.now() < new Date(task.start || "").getTime()) && "This task has been completed for this period, reaccurs: " + new Date(task.start || "").toLocaleDateString()}</div>
        <div className='w-full flex justify-between items-center'>
          {(!(task.status === "Completed")  && !(task.recurrence !== null && Date.now() < new Date(task.start || "").getTime())) && <Button onClick={()=>completeTask()}>Complete</Button>}
          <TiCog onClick={() => focusTask(task)} className="text-3xl hover:rotate-45 transition-all hover:text-light-blue cursor-pointer"/>
        </div>
      </div>


    </div>
    </li>  
  )
}

const LoadingBar = ({percentage, completed}: {percentage: number, completed: boolean}) => {
  return (
    <div className={`absolute bottom-2 h-1 bg-white w-full -m-2 `}>
      <div style={{"--percentage": percentage.toString()+"%"} as any} className={`h-1 w-full ${completed ? "rounded-none bg-green-200 left-0" : percentage === 100 ? "rounded-none bg-light-red left-0" : percentage >= 90 ? "rounded-none bg-yellow-200 left-0 translate-x-[calc(-100%+var(--percentage))]" : "rounded-r-md bg-blue-500 left-0 translate-x-[calc(-100%+var(--percentage))]"} absolute bottom-0  `}></div>
    </div>
  )
}