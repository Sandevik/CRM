import React from 'react'
import Task from './Task'
import Text from './Text'
import EmptyPage from './EmptyPage'

export default function TaskList({tasks, focusTask, refetchTasks, showCustomers}: {showCustomers: boolean, tasks: Task[], focusTask: React.Dispatch<React.SetStateAction<Task | null>>, refetchTasks: () => Promise<void>}) {
  return (
    <ul className="flex flex-wrap items-start sm:items-center md:items-start justify-center sm:justify-start gap-4 min-h-72 overflow-hidden ">
        {tasks.map(task => (<Task key={task.added} focusTask={focusTask} task={task} refetchTasks={refetchTasks} showCustomer={showCustomers}/>))}
        {tasks.length === 0 && <EmptyPage text={{swe: "Inga uppgifter hittade", eng: "No tasks found"}} />}
    </ul>
  )
}
