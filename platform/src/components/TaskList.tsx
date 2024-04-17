import React from 'react'
import Task from './Task'
import EmptyPage from './EmptyPage'
import Spinner from './Spinner'

export default function TaskList({loading, tasks, focusTask, refetchTasks, showCustomers, className, heightFull}: {loading: boolean, className?: string, showCustomers: boolean, tasks: Task[], focusTask: React.Dispatch<React.SetStateAction<Task | null>>, refetchTasks: () => Promise<void>, heightFull?: boolean}) {
  return (
      <ul className={`flex relative flex-wrap items-start sm:items-center md:items-start justify-center sm:justify-start gap-4 ${!heightFull ? "min-h-72" : "h-full"} overflow-hidden ${className && className}`}>
        {tasks.map(task => (<Task key={task.added} focusTask={focusTask} task={task} refetchTasks={refetchTasks} showCustomer={showCustomers}/>))}
        {!loading && tasks.length === 0 && <li className="w-full h-full m-auto"><EmptyPage text={{swe: "Inga uppgifter hittades", eng: "No tasks were found"}} /></li>}
        {loading && <Spinner />}
      </ul>
  )
}
