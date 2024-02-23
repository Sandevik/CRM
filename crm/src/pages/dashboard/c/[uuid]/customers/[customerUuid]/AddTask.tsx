import Button from '@/components/Button'
import Input from '@/components/Input';
import Text from '@/components/Text';
import { CurrentCrmContext } from '@/context/CurrentCrmContext';
import request from '@/utils/request';
import React, { useContext, useEffect, useState } from 'react'
import { IoClose, IoCalendar } from 'react-icons/io5';

interface Props {
    active: boolean, 
    customer: Customer | null, 
    setActive: React.Dispatch<React.SetStateAction<boolean>>, 
    refetchTasks: () => Promise<void>
}


export default function AddTask({active, setActive, customer, refetchTasks}: Props) {
    const {crm} = useContext(CurrentCrmContext);
    const [form, setForm] = useState<Omit<Task, "added" | "updated" | "recurrenceCount" | "uuid" | "employeeUuid">>({
        deadline: null,
        crmUuid: crm?.crmUuid || "" ,
        title: null,
        start: null,
        status: "ongoing",
        recurrence: null,
        customerUuid: customer?.uuid || null,
    })
    const [deadline, setDeadline] = useState<1|0>(0);
    const [customStart, setCustomStart] = useState<1|0>(0);

    useEffect(()=>{setForm({...form, customerUuid: customer?.uuid || null})},[customer])
    useEffect(()=>{setForm({...form, crmUuid: crm?.crmUuid || ""})},[crm])
    

    const close = () => {
        setActive(false);
        setForm({
            deadline: null,
            crmUuid: crm?.crmUuid || "" ,
            title: null,
            status: "ongoing",
            start: null,
            recurrence: null,
            customerUuid: customer?.uuid || null,
        })
    }

    const addTask = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (crm?.crmUuid && customer) {
            const res = await request("/tasks/create", {...form, deadline: new Date(form.deadline || "").getTime(), start: new Date(form.start || "").getTime()}, "POST");
            if (res.code == 201) {
                close();
                await refetchTasks();
            }   
        }

    }
  
    return (
        <div className={`${active ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} transition-opacity absolute top-0 left-0 h-full w-full bg-background-dark bg-opacity-40 backdrop-blur-md grid place-items-center`}>
        <form className=" w-[40em] bg-background-light p-4 rounded-md relative flex flex-col gap-5">
            <h3 className="text-2xl font-semibold"><Text text={{eng: "Create a new task with", swe: "Skapa en ny uppgift för"}} /> {customer?.firstName || <Text text={{eng: "unknown customer", swe: "okänd kund"}} />}</h3>
            <IoClose onClick={() => close()} className="absolute top-2 right-2 text-4xl cursor-pointer"/>
            
            <div className="flex flex-col gap-2">
                <label htmlFor="title" className="text-lg"><Text text={{eng: "Title", swe: "Titel"}} /></label>
                <Input required name="title" value={form.title || ""} onChange={(e) => setForm({...form, title: e.target.value})} className="w-full flex-1 rounded-md overflow-y-scroll scrollthumb transition-all relative p-2 bg-background-dark text-white" placeholder='Schedule a call...'></Input>   
            </div>
            <div className="flex flex-col gap-2">
                <label htmlFor="deadline-select" className="text-lg">Deadline</label>
                <select value={deadline}  onChange={(e) => {setDeadline(+e.target.value as 0|1); if (+e.target.value === 0) setForm({...form, deadline: null})}} name="deadline-select" className="w-full flex-1 rounded-md overflow-y-scroll scrollthumb transition-all relative p-2 bg-background-dark text-white">
                    <option value={0}><Text text={{eng: "No", swe: "Nej"}} /></option>
                    <option value={1}><Text text={{eng: "Yes", swe: "Ja"}} /></option>
                </select>   
            </div>

            {deadline === 1 && <div className="flex flex-col gap-2">
                <label htmlFor="datetime" className="text-lg"><Text text={{eng: "Date and Time", swe: "Datum och Tid"}} /></label>
                <div className='relative'>
                    <Input name="datetime" type='datetime-local' value={form.deadline || ""} onChange={(e) => setForm({...form, deadline: e.target.value})} className="w-full flex-1 rounded-md overflow-y-scroll scrollthumb transition-all relative p-2 bg-background-dark text-white" placeholder='Schedule a call...'></Input>   
                    <IoCalendar className="text-white absolute right-2 top-3 text-lg pointer-events-none" />
                </div>
            </div>}

            <div className="flex flex-col gap-2">
                <label htmlFor="status-select" className="text-lg"><Text text={{eng: "Recurrencing", swe: "Återkommande"}} /></label>
                <select value={form.recurrence || "none"} disabled={deadline === 0 || form.deadline === null}  onChange={(e) => {setForm({...form, recurrence: e.target.value === "none" ? null : e.target.value as TaskRecurrence})}} name="deadline-select" className={` ${deadline === 0 || form.deadline === null ? "opacity-50" : "opacity-100" } w-full flex-1 rounded-md overflow-y-scroll scrollthumb transition-all relative p-2 bg-background-dark text-white`}>
                    <option value={"none"}><Text text={{eng: "No", swe: "Nej"}} /></option>
                    <option value={"dayly"}><Text text={{eng: "Dayly", swe: "Dagligen"}} /></option>
                    <option value={"weekly"}><Text text={{eng: "Weekly", swe: "Veckovis"}} /></option>
                    <option value={"monthly"}><Text text={{eng: "Monthly", swe: "Månadsvis"}} /></option>
                    <option value={"yearly"}><Text text={{eng: "Yearly", swe: "Årligen"}} /></option>
                    <option value={"everyOtherWeek"}><Text text={{eng: "Every Other Week", swe: "Varannan Vecka"}} /></option>
                    <option value={"everyOtherMonth"}><Text text={{eng: "Every Other Month", swe: "Varannan Månad"}} /></option>
                </select>   
            </div>

            <div className="flex flex-col gap-2">
                <label htmlFor="custom_start"><Text text={{eng: "Custom Start Date", swe: "Anpassat Start Datum"}} /></label>
                <select value={customStart}  onChange={(e) => {setCustomStart(+e.target.value as 0|1); if (+e.target.value === 0) setForm({...form, start: null})}} name="custom_start" className="w-full flex-1 rounded-md overflow-y-scroll scrollthumb transition-all relative p-2 bg-background-dark text-white">
                    <option value={0}><Text text={{eng: "No", swe: "Nej"}} /></option>
                    <option value={1}><Text text={{eng: "Yes", swe: "Ja"}} /></option>
                </select>  
            </div>

            {customStart === 1 && <div className="flex flex-col gap-2">
                <label htmlFor="custom_start"><Text text={{eng: "Start Time", swe: "Starttid"}} /></label>
                <div className='relative'>
                    <Input name="custom_start" type='datetime-local' value={form.start || ""} onChange={(e) => setForm({...form, start: e.target.value})} className="w-full flex-1 rounded-md overflow-y-scroll scrollthumb transition-all relative p-2 bg-background-dark text-white" placeholder='Schedule a call...'></Input>   
                    <IoCalendar className="text-white absolute right-2 top-3 text-lg pointer-events-none" />
                </div>
            </div>}

            <div className="flex flex-col gap-2">
                <label htmlFor="status-select" className="text-lg">Status</label>
                <select value={form.status || "none"}  onChange={(e) => {setForm({...form, status: e.target.value === "none" ? null : e.target.value as TaskStatus})}} name="deadline-select" className="w-full flex-1 rounded-md overflow-y-scroll scrollthumb transition-all relative p-2 bg-background-dark text-white">
                    <option value={"none"}><Text text={{eng: "None", swe: "Ingen"}} /></option>
                    <option value={"ongoing"}><Text text={{eng: "Ongoing", swe: "Pågående"}} /></option>
                    <option value={"completed"}><Text text={{eng: "Complete", swe: "Avklarad"}} /></option>
                </select>   
            </div>

            <Button onClick={(e) => addTask(e)}><Text text={{eng: "Add", swe: "Skapa"}} /></Button>
        </form>
        </div>
  )
}
