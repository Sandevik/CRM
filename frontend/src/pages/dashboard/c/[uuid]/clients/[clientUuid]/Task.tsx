import React from 'react'
import { FaTriangleExclamation } from "react-icons/fa6";


export default function Task({task}: {task: Task}) {
  const percentage:number = (task?.percentage || 100) > 100 ? 100 : (task?.percentage || 100) < 0 ? 0 : (task?.percentage || 100);

  return (
    <li className='min-w-40 rounded-sm bg-background-light p-2 capitalize relative overflow-hidden h-11 hover:h-20 transition-all flex justify-between items-center gap-6'>
      {task.deadline !== null && <LoadingBar percentage={percentage} />}
      <div className="truncate">{task.title}</div>
      {task.deadline !== null && percentage === 100 && <FaTriangleExclamation className="text-light-red" />}
    </li>
  )
}

const LoadingBar = ({percentage}: {percentage: number}) => {
  return (
    <div className={`absolute bottom-2 h-1 bg-white w-full -m-2 `}>
      <div style={{"--percentage": percentage.toString()+"%"} as any} className={`h-1 w-full ${percentage === 100 ? "rounded-r-md bg-light-red left-0" : "rounded-none bg-blue-500 left-0 translate-x-[calc(-100%+var(--percentage))]"} absolute bottom-0  `}></div>
    </div>
  )
}