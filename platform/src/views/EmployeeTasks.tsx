import Button from '@/components/Button'
import TaskList from '@/components/TaskList'
import Text from '@/components/Text'
import React from 'react'
import { FaTasks } from 'react-icons/fa'

export default function EmployeeTasks({selectedTab, tasks, loading, setAddTask, fetchTasks, setFocusTask}: {selectedTab: "tasks" | "settings" | "time", tasks: Task[], loading: boolean, setAddTask: React.Dispatch<React.SetStateAction<boolean>>, fetchTasks: () => Promise<void>, setFocusTask: React.Dispatch<React.SetStateAction<Task | null>>}) {
  return (
    <div className={`p-2 ${selectedTab === "tasks" ? "translate-x-0 opacity-100 pointer-events-auto " : "translate-x-5 opacity-0 pointer-events-none"} absolute top-4 w-full h-full transition-all bg-background-light bg-opacity-50 rounded-md`}>
        <div className="opacity-10 text-background-dark">
          <FaTasks className="absolute h-full w-full top-0 " />
        </div>
        
        <div className=" z-10 flex w-full justify-between items-center ">
            <span className="flex gap-2 items-center"><FaTasks /><Text text={{swe: "Uppgifter", eng: "Tasks"}} /></span>
            <Button onClick={() => setAddTask(true)}><Text text={{eng: "Add Task", swe: "Ny Uppgift"}} /></Button>
        </div>
        <div className="mt-2 h-full">
            <TaskList showEmptyPage={false} heightFull={true} loading={loading} focusTask={setFocusTask} showCustomers={false} tasks={tasks} refetchTasks={fetchTasks} />
        </div>   
    </div>
  )
}
