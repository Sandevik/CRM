import Button from '@/components/Button';
import React from 'react'
import { FaTriangleExclamation, FaCircleCheck } from "react-icons/fa6";


export default function Task({task}: {task: Task}) {
  const percentage:number = (task?.percentage || 100) > 100 ? 100 : (task?.percentage || 100) < 0 ? 0 : (task?.percentage || 100);

  return (
    <li className='min-w-40 max-w-72 rounded-sm bg-background-light p-2 relative overflow-hidden h-11 hover:h-32 transition-all flex flex-col items-center hover:items-start gap-2'>
      {task.deadline !== null && <LoadingBar completed={task.status === "Completed"} percentage={percentage} />}
      <div className='flex justify-between w-full items-center gap-6 capitalize'>
        <div className="truncate font-semibold">{task.title}</div>
        {task.status === "Completed" ? <FaCircleCheck className="text-green-200"/> : task.deadline !== null && percentage >= 90 && <FaTriangleExclamation className={`${percentage === 100 ? "text-light-red" : "text-yellow-200"}`} /> }
      </div>
      {percentage >= 90 && <div className={`${percentage === 100 ? "text-light-red" : "text-yellow-200"}`}>{percentage === 100 ? "This task has exceeded its deadline" : "This task is about to exceed its deadline"}</div>}
      {!(task.status === "Completed") && <Button>Complete</Button>}
    </li>
  )
}

const LoadingBar = ({percentage, completed}: {percentage: number, completed: boolean}) => {
  console.log(percentage)
  return (
    <div className={`absolute bottom-2 h-1 bg-white w-full -m-2 `}>
      <div style={{"--percentage": percentage.toString()+"%"} as any} className={`h-1 w-full ${completed ? "rounded-none bg-green-200 left-0" : percentage === 100 ? "rounded-none bg-light-red left-0" : percentage >= 90 ? "rounded-none bg-yellow-200 left-0" : "rounded-r-md bg-blue-500 left-0 translate-x-[calc(-100%+var(--percentage))]"} absolute bottom-0  `}></div>
    </div>
  )
}