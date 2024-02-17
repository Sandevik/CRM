import React, { useEffect, useLayoutEffect, useState } from 'react'

export default function Task({task}: {task: Task}) {
  console.log(task)
  return (
    <li className='min-w-20 bg-background-light p-2 capitalize relative overflow-hidden'>
      <div className="truncate">{task.title}</div>
      
      {task.deadline !== null && <LoadingBar task={task} />}
    </li>
  )
}

const LoadingBar = ({task}: {task: Task}) => {
  


  return (
    <div className={`absolute bottom-2 h-1 bg-white w-full -m-2 overflolw-hidden`}>
      <div style={{"--percentage": (100-(task?.percentage || 100)).toString()+"%"} as any} className={`h-1 w-full ${(task.percentage || 100) === 100 ? "rounded-r-md" : "rounded-none"} bg-blue-500 absolute bottom-0 -left-[var(--percentage)] `}></div>
    </div>
  )
}