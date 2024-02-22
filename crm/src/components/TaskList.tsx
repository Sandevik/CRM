import React from 'react'
import Task from '../pages/dashboard/c/[uuid]/clients/[clientUuid]/Task'

export default function TaskList({tasks, focusTask, refetchTasks, showClients}: {showClients: boolean, tasks: Task[], focusTask: React.Dispatch<React.SetStateAction<Task | null>>, refetchTasks: () => Promise<void>}) {
  return (
    <ul className="flex flex-wrap items-center justify-center sm:justify-start  gap-4 ">
        {tasks.map(task => (<Task key={task.added} focusTask={focusTask} task={task} refetchTasks={refetchTasks} showClient={showClients}/>))}
        {tasks.length === 0 && <div>No tasks found</div>}
    </ul>
  )
}
