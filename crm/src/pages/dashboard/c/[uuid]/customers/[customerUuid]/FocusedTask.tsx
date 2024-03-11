import Input from '@/components/Input';
import React, { useState } from 'react'
import { IoClose } from 'react-icons/io5';

export default function FocusedTask({task: _task, setTask: _setTask, refetchTasks}: {task: Task | null, setTask: React.Dispatch<React.SetStateAction<Task | null>>, refetchTasks: () => Promise<void>}) {
    const [task, setTask] = useState<Omit<Task, "added" | "updated" | "recurrenceCount" | "uuid" | "employeeUuid"> | null>(_task);
   
    const close = () => {
        setTask(null);
    }
 
    return (
        <></>
  )
}
