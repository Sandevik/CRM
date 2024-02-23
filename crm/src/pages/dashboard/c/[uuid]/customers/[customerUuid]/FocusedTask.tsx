import Input from '@/components/Input';
import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5';

export default function FocusedTask({task: _task, setTask: _setTask, refetchTasks}: {task: Task | null, setTask: React.Dispatch<React.SetStateAction<Task | null>>, refetchTasks: () => Promise<void>}) {
    const [task, setTask] = useState<Omit<Task, "added" | "updated" | "recurrenceCount" | "uuid" | "employeeUuid"> | null>(_task);
   
    const close = () => {
        setTask(null);
    }
 
    return (
        <div className={`${task ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} transition-opacity absolute top-0 left-0 h-full w-full bg-background-dark bg-opacity-40 backdrop-blur-md grid place-items-center`}>
        <form className=" w-[40em] bg-background-light p-4 rounded-md relative flex flex-col gap-5">
            <h3 className="text-2xl font-semibold">Task Options</h3>
            <IoClose onClick={() => close()} className="absolute top-2 right-2 text-4xl cursor-pointer"/>
            
            <div className="flex flex-col gap-2">
                <label htmlFor="title" className="text-lg">Title</label>
                <Input required name="title" value={task?.title || ""} onChange={(e) => setTask({...task, title: e.target.value})} className="w-full flex-1 rounded-md overflow-y-scroll scrollthumb transition-all relative p-2 bg-background-dark text-white" placeholder='Schedule a call...'></Input>   
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="deadline-select" className="text-lg">Deadline</label>
                <select value={deadline}  onChange={(e) => {setDeadline(+e.target.value as 0|1); if (+e.target.value === 0) setTask({...task, deadline: null})}} name="deadline-select" className="w-full flex-1 rounded-md overflow-y-scroll scrollthumb transition-all relative p-2 bg-background-dark text-white">
                    <option value={0}>No</option>
                    <option value={1}>Yes</option>
                </select>   
            </div>

            {deadline === 1 && <div className="flex flex-col gap-2">
                <label htmlFor="datetime" className="text-lg">Date and time</label>
                <div className='relative'>
                    <Input name="datetime" type='datetime-local' value={task.deadline || ""} onChange={(e) => setTask({...task, deadline: e.target.value})} className="w-full flex-1 rounded-md overflow-y-scroll scrollthumb transition-all relative p-2 bg-background-dark text-white" placeholder='Schedule a call...'></Input>   
                    <IoCalendar className="text-white absolute right-2 top-3 text-lg pointer-events-none" />
                </div>
            </div>}

            <div className="flex flex-col gap-2">
                <label htmlFor="status-select" className="text-lg">Recurrence</label>
                <select value={task.recurrence || "none"} disabled={deadline === 0 || task.deadline === null}  onChange={(e) => {setTask({...task, recurrence: e.target.value === "none" ? null : e.target.value as TaskRecurrence})}} name="deadline-select" className={` ${deadline === 0 ? "opacity-50" : "opacity-100" } w-full flex-1 rounded-md overflow-y-scroll scrollthumb transition-all relative p-2 bg-background-dark text-white`}>
                    <option value={"none"}>None</option>
                    <option value={"dayly"}>Dayly</option>
                    <option value={"weekly"}>Weekly</option>
                    <option value={"monthly"}>Monthly</option>
                    <option value={"yearly"}>Yearly</option>
                    <option value={"everyOtherWeek"}>Every Other Week</option>
                    <option value={"everyOtherMonth"}>Every Other Month</option>
                </select>   
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="custom_start">Custom Start Date</label>
                <select value={customStart}  onChange={(e) => {setCustomStart(+e.target.value as 0|1); if (+e.target.value === 0) setTask({...task, start: null})}} name="custom_start" className="w-full flex-1 rounded-md overflow-y-scroll scrollthumb transition-all relative p-2 bg-background-dark text-white">
                    <option value={0}>No, Start today at 00:00 (12am)</option>
                    <option value={1}>Yes</option>
                </select>  
            </div>

            {customStart === 1 && <div className="flex flex-col gap-2">
                <label htmlFor="custom_start">Start Time</label>
                <div className='relative'>
                    <Input name="custom_start" type='datetime-local' value={task.start || ""} onChange={(e) => setTask({...task, start: e.target.value})} className="w-full flex-1 rounded-md overflow-y-scroll scrollthumb transition-all relative p-2 bg-background-dark text-white" placeholder='Schedule a call...'></Input>   
                    <IoCalendar className="text-white absolute right-2 top-3 text-lg pointer-events-none" />
                </div>
            </div>}

            
            <div className="flex flex-col gap-2">
                <label htmlFor="status-select" className="text-lg">Status</label>
                <select value={task.status || "none"}  onChange={(e) => {setTask({...task, status: e.target.value === "none" ? null : e.target.value as TaskStatus})}} name="deadline-select" className="w-full flex-1 rounded-md overflow-y-scroll scrollthumb transition-all relative p-2 bg-background-dark text-white">
                    <option value={"none"}>None</option>
                    <option value={"ongoing"}>Ongoing</option>
                    <option value={"completed"}>Completed</option>
                </select>   
            </div>

            
            

            <Button onClick={(e) => addTask(e)}>Add</Button>
        </form>
        </div>
  )
}
