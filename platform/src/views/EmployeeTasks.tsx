import AddTask from '@/components/AddTask'
import Button from '@/components/Button'
import TaskList from '@/components/TaskList'
import Text from '@/components/Text'
import React from 'react'

export default function EmployeeTasks({selectedTab, tasks, loading, addTask, setAddTask, employee, fetchTasks, setFocusTask}: {selectedTab: "tasks" | "settings" | "time", tasks: Task[], loading: boolean, addTask: boolean, setAddTask: React.Dispatch<React.SetStateAction<boolean>>, employee: Employee, fetchTasks: () => Promise<void>, setFocusTask: React.Dispatch<React.SetStateAction<Task | null>>}) {
  return (
    <div className={`p-2 ${selectedTab === "tasks" ? "translate-x-0 opacity-100 pointer-events-auto h-auto" : "translate-x-5 opacity-0 pointer-events-none h-0"} transition-all`}>
        <div className={`my-4 p-2 rounded-md`}>
          <div className="flex justify-between items-center w-full mb-1">
            <span className='font-semibold'>{tasks.length > 0 && <Text text={{eng: "Tasks", swe: "Uppgifter"}} />}</span>
            <Button onClick={() => setAddTask(true)}><Text text={{eng: "Add Task", swe: "Ny Uppgift"}} /></Button>
          </div>
          <TaskList loading={loading} focusTask={setFocusTask} showCustomers={false} tasks={tasks} refetchTasks={fetchTasks} />
        </div>
        <AddTask active={addTask} setActive={setAddTask} refetchTasks={fetchTasks} employee={employee} />  
      </div>
  )
}
