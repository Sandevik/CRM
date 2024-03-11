import { CurrentCrmContext } from '@/context/CurrentCrmContext';
import request from '@/utils/request';
import React, { useContext, useEffect, useState } from 'react'
import { FaPen } from 'react-icons/fa';
import Button from '@/components/Button';
import TaskList from '../../../../../../components/TaskList';
import Text from '@/components/Text';
import { Statistics } from '.';



export default function QuickInfo({loading, customer, statistics, addingTask, setAddTask, tasks, refetchTasks, focusTask}: {loading: boolean, customer: Customer | null, statistics: Statistics, addingTask: boolean, setAddTask: React.Dispatch<React.SetStateAction<boolean>>, tasks: Task[], refetchTasks: () => Promise<void>, focusTask: React.Dispatch<React.SetStateAction<Task | null>>}) {
  const {crm} = useContext(CurrentCrmContext);
  const [currentNote, setCurrentNote] = useState<string>(customer?.note || "");
  const [editing, setEditing] = useState<boolean>(false);

  useEffect(()=>{setCurrentNote(customer?.note || "")},[customer])

  const handleSaveNote = async (editing: boolean) => {
    if (!editing) {
      setEditing(true);
      return;
    }
    if (crm?.crmUuid && customer){
      setEditing(false);
      const res = await request(`/customers/note?crmUuid=${crm.crmUuid}`, {uuid: customer.uuid, note: currentNote}, "PUT")
      if (res.code !== 200) {
        setEditing(true);
      }
    }
  }

  return (
    <div className='flex gap-4 flex-col md:flex-row h-[calc(100dvh-16em)] w-full overflow-y-scroll scrollthumb pr-6'>
      <div className="flex flex-col w-full gap-2 flex-1 ml-2">
        <div className='flex justify-between w-full'>
          <label htmlFor="note" ><Text text={{eng: "About", swe: "Om"}} /></label>
          <button onClick={() => handleSaveNote(editing)} className="flex gap-2 items-center hover:text-light-blue" >< FaPen /> {!editing ? <Text text={{eng: "Edit", swe: "Ändra"}} /> : <Text text={{eng: "Save", swe: "Spara"}} />}</button>
        </div>
        <textarea name="note" disabled={!editing} className={`min-h-52 ${editing ? "ring-light-purple" : "ring-background-dark"} scrollthumb resize-none ring-2 tranition-all rounded-md relative p-2 bg-background-light text-white  w-full `} value={currentNote} onChange={(e) => setCurrentNote(e.target.value)}></textarea>
      
        <div className='relative mt-2 p-1'>

          <div className="h-full flex flex-col gap-6">
            <div className="flex justify-between items-end">
              <span><Text text={{eng: "Tasks", swe: "Uppgifter"}} /></span>
              <Button className='' onClick={()=>setAddTask(true)}><Text text={{eng: "New Task", swe: "Ny Uppgift"}} /></Button>
            </div>
            <TaskList loading={loading} showCustomers={false} tasks={tasks} refetchTasks={refetchTasks} focusTask={focusTask}/>
          </div>

        </div>

      </div>

      <div className="w-full md:w-[17em] bg-background-light p-2 rounded-md flex justify-between flex-col mt-8">
        <div className="flex flex-col gap-4">
          <h3 className="text-lg font-semibold"><Text text={{eng: "Customer Statistics", swe: "Kundstatistik"}} /></h3>
          <div className="flex justify-between text-lg ">
            <div className=''><Text text={{eng: "Meetings", swe: "Möten"}} /></div>
            <div>{statistics.meetings_count}</div>
          </div>
          <div className="flex justify-between text-lg ">
            <div><Text text={{eng: "Entries", swe: "Anteckningar"}} /></div>
            <div>{statistics.entries_count}</div>
          </div>
          <div className="flex justify-between text-lg ">
            <div><Text text={{eng: "Ongoing Tasks", swe: "Pågående Uppgifter"}} /></div>
            <div>{statistics.tasks_todo_count}</div>
          </div>
          <div className="flex justify-between text-lg ">
            <div><Text text={{eng: "Tasks", swe: "Uppgifter"}} /></div>
            <div>{statistics.task_count}</div>
          </div>
        </div>
      </div>

        
    </div>
  )
}
