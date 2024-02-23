import React from 'react'
import Task from './Task'
import Text from './Text'

export default function TaskList({tasks, focusTask, refetchTasks, showCustomers}: {showCustomers: boolean, tasks: Task[], focusTask: React.Dispatch<React.SetStateAction<Task | null>>, refetchTasks: () => Promise<void>}) {
  return (
    <ul className="flex flex-wrap items-center justify-center sm:justify-start  gap-4 ">
        {tasks.map(task => (<Task key={task.added} focusTask={focusTask} task={task} refetchTasks={refetchTasks} showCustomer={showCustomers}/>))}
        {tasks.length === 0 && <div><Text text={{swe: "Inga uppgifter hittade", eng: "No tasks found"}} /></div>}
    </ul>
  )
}
