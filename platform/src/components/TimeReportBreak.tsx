import { CurrentCrmContext } from '@/context/CurrentCrmContext'
import request from '@/utils/request'
import React, { useContext, useEffect, useState } from 'react'
import Text from './Text';
import { BsTrash2Fill } from 'react-icons/bs';
import { IoTrash } from 'react-icons/io5';

export default function TimeReportBreak({b, employee, refetchTimeReport, setExpandedTimeReport}: {b: Break, employee: Employee, refetchTimeReport: () => Promise<void>, setExpandedTimeReport: React.Dispatch<React.SetStateAction<TimeReport | null>>}) {
    const {crm} = useContext(CurrentCrmContext);
    const [currentBreak, setCurrentBreak] = useState<{startTime: string, endTime: string, note: string}>({startTime: `${new Date(b.startDateTime).getHours() < 10 ? "0" + new Date(b.startDateTime).getHours() : new Date(b.startDateTime).getHours()}:${new Date(b.startDateTime).getMinutes() < 10 ? "0" + new Date(b.startDateTime).getMinutes() : new Date(b.startDateTime).getMinutes()}`, endTime: `${new Date(b.endDateTime).getHours() < 10 ? "0" + new Date(b.endDateTime).getHours() : new Date(b.endDateTime).getHours()}:${new Date(b.endDateTime).getMinutes() < 10 ? "0" + new Date(b.endDateTime).getMinutes() : new Date(b.endDateTime).getMinutes()}`, note: ""});
    const [editingBreak, setEditingBreak] = useState<boolean>(false);
    const [isSame, setIsSame] = useState<boolean>(true);

    const removeBreak = async () => {
        if (crm?.crmUuid && employee.uuid) {
            const res = await request(`/time-reports/break?breakUuid=${b.breakUuid}&crmUuid=${crm.crmUuid}&employeeUuid=${employee.uuid}`, {}, "DELETE");
            if (res.code === 200) {
                refetchTimeReport();
                setExpandedTimeReport(null);
            }
        }   
    }

    useEffect(() => {
        if (`${new Date(b.startDateTime).getHours() < 10 ? "0" + new Date(b.startDateTime).getHours() : new Date(b.startDateTime).getHours()}:${new Date(b.startDateTime).getMinutes() < 10 ? "0" + new Date(b.startDateTime).getMinutes() : new Date(b.startDateTime).getMinutes()}` === currentBreak.startTime && `${new Date(b.endDateTime).getHours() < 10 ? "0" + new Date(b.endDateTime).getHours() : new Date(b.endDateTime).getHours()}:${new Date(b.endDateTime).getMinutes() < 10 ? "0" + new Date(b.endDateTime).getMinutes() : new Date(b.endDateTime).getMinutes()}` === currentBreak.endTime && currentBreak.note === b.note) {
            setIsSame(true);
        } else {
            setIsSame(false);
        }
    }, [currentBreak])

    useEffect(()=>{
        (async () => {
            if (!editingBreak && !isSame && crm?.crmUuid) {
                let res = await request("/time-reports/break", {
                    crmUuid: crm.crmUuid,
                    employeeUuid: employee.uuid,
                    timeReportUuid: b.timeReportUuid,
                    breakUuid: b.breakUuid,
                    startDateTime: new Date(b?.scheduleDate + "T" + currentBreak.startTime).getTime(),
                    endDateTime: new Date(b?.scheduleDate + "T" + currentBreak.endTime).getTime(),
                    note: currentBreak.note,
                }, "PUT");

                if (res.code === 200) {
                    refetchTimeReport();
                } else {
                    //alert(res.message);
                }

            }
        })();
    },[editingBreak])

  return (
    <li key={b.breakUuid} className="flex flex-col gap-2">
        <div className={`flex flex-col border rounded-md p-2 bg-background-dark`}>
            <span className="translate-x-1">
                {b.note}
            </span>
            <div className='flex gap-0.5 items-center'>
                <input type="time" onChange={(e) => setCurrentBreak({...currentBreak, startTime: e.target.value})} disabled={!editingBreak} className={`w-full rounded-md px-1 py-1 ${!editingBreak ? "bg-background-dark" :"bg-background-light"} transition-colors text-background-white text-lg `} value={currentBreak.startTime} />
                -
                <input type="time" onChange={(e) => setCurrentBreak({...currentBreak, endTime: e.target.value})} disabled={!editingBreak} className={`w-full rounded-md px-1 py-1 ${!editingBreak ? "bg-background-dark" :"bg-background-light"} transition-colors text-background-white text-lg `} value={currentBreak.endTime} />
                <div className="flex gap-2 ml-2">
                    <button onClick={() => setEditingBreak(!editingBreak)}>{editingBreak ? isSame ? <Text text={{swe: "Klar", eng: "Done"}}/> : <Text text={{eng: "Save", swe: "Spara"}} /> : <Text text={{swe: "Ändra", eng: "Edit"}} />}</button>
                    <button className="hover:text-light-red text-lg" onClick={() => removeBreak()}><IoTrash /></button>
                </div>
            </div>
        </div>
        
    </li>
  )
}
