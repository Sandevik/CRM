import { CurrentCrmContext } from '@/context/CurrentCrmContext';
import { MenuContext } from '@/context/MenuContext';
import React, { useContext, useEffect, useState } from 'react'
import { IoCalendar, IoClose, IoTrash } from 'react-icons/io5';
import Text from './Text';
import request from '@/utils/request';
import Input from './Input';
import Button from './Button';
import { matchWeekDay } from '@/utils/matchWeekDay';
import { MdAddAlarm } from "react-icons/md";
import TimeReportBreak from './TimeReportBreak';
import timeStringFromMs from '@/utils/timeStringFromMs';

interface Props {
    timeReport: TimeReport | null,
    setExpandedTimeReport: React.Dispatch<React.SetStateAction<TimeReport | null>>,
    employee: Employee,
    refetchTimeReport: () => Promise<void>,
}


export default function ExpandedTimeReport({timeReport, employee, setExpandedTimeReport, refetchTimeReport}: Props) {
    const {crm} = useContext(CurrentCrmContext);
    const {open} = useContext(MenuContext);
    const [addingBreak, setAddingBreak] = useState<boolean>(false);
    const [newBreak, setNewBreak] = useState<{startDateTime: string, endDateTime: string, note: string}>({startDateTime: (new Date().getHours() < 10 ? "0" : "") + new Date().getHours() + ":" + (new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes()), endDateTime: (((new Date().getMinutes() + 30) % 60 < new Date().getMinutes()) ? (new Date().getHours() + 1) < 10 ? "0" + (new Date().getHours() + 1) : (new Date().getHours() + 1).toString() : new Date().getHours() < 10 ? "0" + new Date().getHours() : new Date().getHours().toString()) + ":" + ((new Date().getMinutes() + 30) % 60 < 10 ? "0" : "") + (new Date().getMinutes() + 30) % 60, note: ""});
    const [totalBreakTime, setTotalBreakTime] = useState<number>(0);
    const [totalWorkTime, setTotalWorkTime] = useState<number>(0);
    const [editingTime, setEditingTime] = useState<boolean>(false);
    const [currentTime, setCurrentTime] = useState<{startTime: string, endTime: string, note: string}>({startTime: timeReport?.startDateTime ? `${new Date(timeReport.startDateTime).getHours() < 10 ? "0" + new Date(timeReport.startDateTime).getHours() : new Date(timeReport.startDateTime).getHours()}:${new Date(timeReport.startDateTime).getMinutes() < 10 ? "0" + new Date(timeReport.startDateTime).getMinutes() : new Date(timeReport.startDateTime).getMinutes()}` : "--:--", endTime: timeReport?.endDateTime ? `${new Date(timeReport.endDateTime).getHours() < 10 ? "0" + new Date(timeReport.endDateTime).getHours() : new Date(timeReport.endDateTime).getHours()}:${new Date(timeReport.endDateTime).getMinutes() < 10 ? "0" + new Date(timeReport.endDateTime).getMinutes() : new Date(timeReport.endDateTime).getMinutes()}` : "--:--", note: ""})
    const [isSame, setIsSame] = useState<boolean>(true);

    useEffect(() => {
        if (currentTime.startTime !== "--:--" && currentTime.endTime !== "--:--") setTotalWorkTime((new Date(timeReport?.scheduleDate + "T" + currentTime.endTime).getTime() - new Date(timeReport?.scheduleDate + "T" + currentTime.startTime).getTime()) / 1000 / 60)
        if (currentTime.startTime === timeReport?.startDateTime && currentTime.endTime === timeReport.endDateTime && currentTime.note === timeReport.note) {
            setIsSame(true);
        } else {
            setIsSame(false);
        }
    }, [currentTime])

    useEffect(() => {
        setCurrentTime({startTime: timeReport?.startDateTime ? `${new Date(timeReport?.startDateTime.substring(0, timeReport.startDateTime.length - 1) || "").getHours() < 10 ? "0" + new Date(timeReport?.startDateTime.substring(0, timeReport.startDateTime.length - 1) || "").getHours() : new Date(timeReport?.startDateTime.substring(0, timeReport.startDateTime.length - 1) || "").getHours()}:${new Date(timeReport?.startDateTime.substring(0, timeReport.startDateTime.length - 1) || "").getMinutes() < 10 ? "0" + new Date(timeReport?.startDateTime.substring(0, timeReport.startDateTime.length - 1) || "").getMinutes() : new Date(timeReport?.startDateTime.substring(0, timeReport.startDateTime.length - 1) || "").getMinutes()}` : "--:--", endTime: timeReport?.endDateTime ? `${new Date(timeReport?.endDateTime.substring(0, timeReport.endDateTime.length - 1) || "").getHours() < 10 ? "0" + new Date(timeReport?.endDateTime.substring(0, timeReport.endDateTime.length - 1) || "").getHours() : new Date(timeReport?.endDateTime.substring(0, timeReport.endDateTime.length - 1) || "").getHours()}:${new Date(timeReport?.endDateTime.substring(0, timeReport.endDateTime.length - 1) || "").getMinutes() < 10 ? "0" + new Date(timeReport?.endDateTime.substring(0, timeReport.endDateTime.length - 1) || "").getMinutes() : new Date(timeReport?.endDateTime.substring(0, timeReport.endDateTime.length - 1) || "").getMinutes()}` : "--:--", note: ""});
    },[timeReport])

    useEffect(()=>{
        (async () => {
            if (!editingTime && !isSame && crm?.crmUuid && timeReport?.uuid) {
                let res = await request(`/time-reports/${timeReport.uuid}`, {
                    crmUuid: crm.crmUuid,
                    employeeUuid: employee.uuid,
                    startDateTime: new Date(timeReport?.scheduleDate + "T" + currentTime.startTime).getTime(),
                    endDateTime: new Date(timeReport?.scheduleDate + "T" + currentTime.endTime).getTime(),
                    note: currentTime.note,
                    timeReportUuid: timeReport.uuid,
                    scheduleDate: timeReport.scheduleDate
                }, "PUT");

                if (res.code === 200) {
                    refetchTimeReport();
                } else {
                    alert(res.message);
                }
            }
        })();
    },[editingTime])

    useEffect(()=>{
        let totalBreakTime = 0;
        timeReport?.breaks?.forEach(b => {
          totalBreakTime += (new Date(b.endDateTime).getTime() - new Date(b.startDateTime).getTime()) / 1000 / 60; 
        })
        setTotalBreakTime(totalBreakTime);
        setCurrentTime({startTime: timeReport?.startDateTime ? `${new Date(timeReport.startDateTime).getHours() < 10 ? "0" + new Date(timeReport.startDateTime).getHours() : new Date(timeReport.startDateTime).getHours()}:${new Date(timeReport.startDateTime).getMinutes() < 10 ? "0" + new Date(timeReport.startDateTime).getMinutes() : new Date(timeReport.startDateTime).getMinutes()}` : "--:--", endTime: timeReport?.endDateTime ? `${new Date(timeReport.endDateTime).getHours() < 10 ? "0" + new Date(timeReport.endDateTime).getHours() : new Date(timeReport.endDateTime).getHours()}:${new Date(timeReport.endDateTime).getMinutes() < 10 ? "0" + new Date(timeReport.endDateTime).getMinutes() : new Date(timeReport.endDateTime).getMinutes()}` : "--:--", note: ""})
    },[timeReport])

    const close = () => {
        setExpandedTimeReport(null);
    }

    const clearTimeReport = async () => {
        if (crm?.crmUuid && timeReport?.uuid) {
            let res = await request(`/time-reports/${timeReport.uuid}?crmUuid=${crm.crmUuid}&employeeUuid=${employee.uuid}`, {}, "DELETE");
            if (res.code === 200) {
                refetchTimeReport();
                close();
            } else {
                alert(res.message);
            }
        }
    }

    const addBreak = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (crm?.crmUuid && employee.uuid && newBreak) {
            const res = await request("/time-reports/break", {
                crmUuid: crm.crmUuid,
                employeeUuid: employee.uuid,
                timeReportUuid: timeReport?.uuid,
                startDateTime: new Date(timeReport?.scheduleDate+"T"+newBreak.startDateTime).getTime(),
                endDateTime: new Date(timeReport?.scheduleDate+"T"+newBreak.endDateTime).getTime(),
                note: newBreak.note,
                scheduleDate: timeReport?.scheduleDate,
            }, "POST");
            if (res.code == 201) {
                setAddingBreak(false);
                setNewBreak({startDateTime: (new Date().getHours() < 10 ? "0" : "") + new Date().getHours() + ":" + (new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes()), endDateTime: (((new Date().getMinutes() + 30) % 60 < new Date().getMinutes()) ? (new Date().getHours() + 1) < 10 ? "0" + (new Date().getHours() + 1) : (new Date().getHours() + 1).toString() : new Date().getHours() < 10 ? "0" + new Date().getHours() : new Date().getHours().toString()) + ":" + ((new Date().getMinutes() + 30) % 60 < 10 ? "0" : "") + (new Date().getMinutes() + 30) % 60, note: ""});
                refetchTimeReport();
                close()
            }   
        }
    }

    return (
        <div className={`${timeReport !== null ? "opacity-100 pointer-events-auto z-10" : "opacity-0 pointer-events-none -z-10"} transition-all z-10 absolute top-0 left-0 h-full ${open ? "w-[calc(100dvw-23em)] " : "w-[100vw]"} bg-background-dark bg-opacity-40 backdrop-blur-md grid place-items-center`}>
            <div className=" w-[40em] bg-background-light rounded-md relative flex flex-col gap-5 p-3">
                <h3 className="text-2xl font-semibold"><Text text={{eng: "Time reported by ", swe: "Tid rapporterad av "}} /> {employee?.firstName || <Text text={{eng: "unknown", swe: "okänd"}} />}</h3>
                <IoClose onClick={() => close()} className="absolute top-2 right-2 text-4xl cursor-pointer"/>

                <div className="flex justify-between">
                    <span className="text-2xl">
                        {timeReport?.scheduleDate && matchWeekDay(new Date(timeReport?.scheduleDate).getDay())}
                    </span>
                    <span className="text-xl">
                        {timeReport?.scheduleDate}
                    </span>
                </div>

                <div className="flex justify-between">
                    <div className="flex flex-col gap-4">
                        <span><Text text={{swe: "Tidssummering", eng: "Time sum"}} /></span>
                        <div className="flex gap-4 w-[50%]">
                            <div className='flex gap-0.5 items-center'>
                                <input type="time" onChange={(e) => setCurrentTime({...currentTime, startTime: e.target.value})} disabled={!editingTime} className={`w-full rounded-md px-1 py-1 ${editingTime ? "bg-background-dark" :"bg-background-light"} transition-colors text-background-white text-lg `} value={currentTime.startTime} />
                                -
                                <input type="time" onChange={(e) => setCurrentTime({...currentTime, endTime: e.target.value})} disabled={!editingTime} className={`w-full rounded-md px-1 py-1 ${editingTime ? "bg-background-dark" :"bg-background-light"} transition-colors text-background-white text-lg `} value={currentTime.endTime} />
                                <div className="flex gap-2 ml-2">
                                    <button onClick={() => setEditingTime(!editingTime)}>{editingTime ? isSame ? <Text text={{swe: "Klar", eng: "Done"}}/> : <Text text={{eng: "Save", swe: "Spara"}} /> : <Text text={{swe: "Ändra", eng: "Edit"}} />}</button>
                                    <button className="hover:text-light-red text-lg" onClick={() => clearTimeReport()}><IoTrash /></button>
                                </div>
                            </div>
                        </div>
                        <div className='flex flex-col justify-between gap-2 h-full'>
                            <div className='flex flex-col gap-2'>
                                <span><Text text={{swe: "Total arbetstid", eng: "Total work time"}}/>: {totalWorkTime < 0 ? "0h 0 min" : timeStringFromMs(totalWorkTime)}</span>
                                <span><Text text={{swe: "Total rasttid", eng: "Total break time"}}/>: {totalBreakTime < 0 ? "0h 0 min" : timeStringFromMs(totalBreakTime)}</span>
                                <span><Text text={{swe: "Betald tid", eng: "Compensated time"}}/>: {totalWorkTime - totalBreakTime < 0 ? "0h 0 min" : timeStringFromMs((totalWorkTime - totalBreakTime))}</span>
                            </div>
                            <Button><Text text={{eng: "Accept reported time", swe: "Acceptera rapporterad tid"}} /></Button>
                        </div>
                    </div>


                    <div className="w-[50%] flex flex-col gap-2 border-l-2 pl-4">
                        <span className="flex justify-between"><Text text={{swe: "Raster", eng: "Breaks"}}/>  </span>
                        <div className="flex flex-col justify-between h-full">
                            <ul className="flex flex-col gap-2 mb-2">
                                {timeReport?.breaks?.map(b => (
                                    <TimeReportBreak setExpandedTimeReport={setExpandedTimeReport} refetchTimeReport={refetchTimeReport} employee={employee} b={b} />
                                ))}
                                {timeReport?.breaks?.length === 0 && <li><Text text={{eng: "No registered breaks", swe: "Inga registrerade raster"}}/></li>}
                            </ul>
                            <Button type='button' onClick={() => setAddingBreak(!addingBreak)} ><MdAddAlarm className="translate-y-[1px]" /> {!addingBreak ? <Text text={{swe: "Lägg till rast", eng: "Add break"}} /> : <Text text={{swe: "Stäng rasttilläggsrutan ", eng: "Close additional breaks form"}} />}</Button>
                        </div>    
                    </div>
                </div>
                
                <div className={`${addingBreak ? "opacity-100 pointer-events-auto translate-y-0 z-10" : "pointer-events-none h-0 opacity-0 -translate-y-4 -z-20"} border-t p-2 transition-opacity w-full flex flex-col gap-2 bg-background-light`}>
                    <Text text={{swe: "Ny rast", eng: "New break"}} />
                    <div className="w-full flex justify-between gap-4 ">
                        <div className='flex flex-col w-full'>
                            <label htmlFor="start time"><Text text={{swe: "Rast starttid", eng: "Break start time"}}/></label>
                            <input name='start time' type='time' value={newBreak.startDateTime} onChange={(e) => setNewBreak({...newBreak, startDateTime: e.target.value})} className='w-full rounded-md px-1 py-1 bg-background-dark text-background-white text-lg' />
                        </div>
                        <div className='flex flex-col w-full'>
                            <label htmlFor="end time"><Text text={{swe: "Rast sluttid", eng: "Break end time"}}/></label>
                            <input name='end time' type='time' value={newBreak.endDateTime} onChange={(e) => setNewBreak({...newBreak, endDateTime: e.target.value})} className='w-full rounded-md px-1 py-1 bg-background-dark text-background-white text-lg' />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="note"><Text text={{swe: "Anteckning", eng: "Note"}}/></label>
                        <textarea name='note' className='  w-full rounded-md px-1 py-1 bg-background-dark text-background-white text-lg'  value={newBreak?.note} onChange={(e) => setNewBreak({...newBreak, note: e.target.value})}></textarea>
                    </div>
                    <Button type='button' onClick={(e) => addBreak(e)}><Text text={{swe: "Lägg till rast", eng: "Add a break"}}/></Button>    
                </div>
            </div>
        </div>
  )
}

