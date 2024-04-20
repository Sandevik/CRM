import Button from '@/components/Button';
import Switch from '@/components/Switch';
import Text from '@/components/Text';
import { CurrentCrmContext } from '@/context/CurrentCrmContext';
import request from '@/utils/request';
import React, { useContext, useEffect, useState } from 'react'
import { IoMdSettings } from 'react-icons/io';

export default function EmployeeSettings({selectedTab, employee, fetchEmployee}: {selectedTab: "tasks" | "settings" | "time", employee: Employee, fetchEmployee: () => Promise<void>}) {
    const {crm} = useContext(CurrentCrmContext);
    const [isAdmin, setIsAdmin] = useState<boolean>(employee.isAdmin || false);
    const [canReportTime, setCanReportTime] = useState<boolean>(employee.canReportTime || false);
    const [canHandleCustomers, setCanHandleCustomers] = useState<boolean>(employee.canHandleCustomers || false);
    const [canHandleEmployees, setCanHandleEmployees] = useState<boolean>(employee.canHandleEmployees || false);
    const [canHandleVehicles, setCanHandleVehicles] = useState<boolean>(employee.canHandleVehicles || false);
    const [canAccessCrm, setCanAccessCrm] = useState<boolean>(employee.canAccessCrm || false);
    
    useEffect(()=>{
        setCanHandleCustomers(employee.canHandleCustomers || false)
        setCanHandleEmployees(employee.canHandleEmployees || false)
        setCanHandleVehicles(employee.canHandleVehicles || false)
        setCanReportTime(employee.canReportTime || false)
        setIsAdmin(employee.isAdmin || false)
        setCanAccessCrm(employee.canAccessCrm || false);
      },[employee])
    
    const handlePermissionChange = async () => {
        if (employee.userUuid && crm?.crmUuid) {
          let res = await request(`/employees/update-permissions`, {
            userUuid: employee.userUuid,
            crmUuid: crm.crmUuid,
            canReportTime,
            canHandleCustomers,
            canHandleEmployees,
            canHandleVehicles,
            canAccessCrm
          }, "PUT");
          if (res.code === 200) {
            await fetchEmployee();
          } 
        }
      }
    
      const setAdmin = async () => {
        if (employee.uuid && crm?.crmUuid && isAdmin !== null) {
          let res = await request(`/employees/set-admin`, {
            employeeUuid: employee.uuid,
            crmUuid: crm.crmUuid,
            isAdmin
          }, "PUT");
          if (res.code === 200) {
            await fetchEmployee();
          } 
        }
      }
    
      useEffect(()=>{
          setAdmin();
      },[isAdmin])
    
      useEffect(()=>{
        handlePermissionChange();
      }, [canHandleCustomers, canHandleEmployees, canHandleVehicles, canReportTime, canAccessCrm])
    
      const disassociateAccount = async () => {
        alert("(Modal) You are about to disassociate this account")
        if (employee.uuid && crm?.crmUuid) {
          let res = await request(`/employees/disassociate-user-account`, {
            employeeUuid: employee.uuid,
            crmUuid: crm.crmUuid,
          }, "DELETE");
          if (res.code === 200) {
            await fetchEmployee();
          }
        }
      }
    
      const disassociateAndRemoveAccount = async () => {
        alert("(Modal) You are about to disassociate and remove this account")
      } 
  
  
    return (
      <div className={`p-2 ${selectedTab === "settings" ? "translate-x-0 opacity-100 pointer-events-auto " : "translate-x-5 opacity-0 pointer-events-none"} absolute top-4 w-full h-full transition-all bg-background-light bg-opacity-50 rounded-md`}>
        <span className="flex gap-2 items-center mb-2"><IoMdSettings /><Text text={{swe: "Inställningar Och Behörigheter", eng: "Settings And Access"}} /></span>
        <IoMdSettings className="absolute text-background-dark h-full w-full top-0 opacity-10 pointer-events-none" />

        <div className={`flex justify-center gap-10 mt-2 mb-6 bg-background-light p-2 rounded-md bg-opacity-100`}>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Switch disabled={!employee.userUuid}  value={isAdmin} setValue={setIsAdmin} />
              <span className="text-lg font-semibold"><Text text={{swe: "Administratör", eng: "Administrator"}}/></span>
            </div>

            <div className="flex items-center gap-2">
              <Switch disabled={!employee.userUuid} value={canReportTime} setValue={setCanReportTime} />
              <span className="text-lg font-semibold"><Text text={{swe: "Kan tidsrapportera", eng: "Can report time"}}/></span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <Switch disabled={!employee.userUuid} value={canAccessCrm !== null ? canAccessCrm : false} setValue={(val: boolean) => setCanAccessCrm(val || false)} />
              <span className="text-lg font-semibold"><Text text={{swe: "Behörig till crm", eng: "Access to crm"}}/></span>
            </div>

            <div className={"flex flex-col gap-2 "}>
              <div className={`${(!employee.canAccessCrm ? "opacity-50" : "opacity-100")} transition-opacity flex items-center gap-2 `}>
                <Switch disabled={!employee.userUuid || !canAccessCrm} value={canHandleCustomers} setValue={setCanHandleCustomers} />
                <span className="text-lg font-semibold"><Text text={{swe: "Kan hantera kunder", eng: "Can handle customers"}}/></span>
              </div>

              <div className={`${(!employee.canAccessCrm ? "opacity-50" : "opacity-100")} transition-opacity flex items-center gap-2`}>
                <Switch disabled={!employee.userUuid || !canAccessCrm} value={canHandleEmployees} setValue={setCanHandleEmployees} />
                <span className="text-lg font-semibold"><Text text={{swe: "Kan hantera anställda", eng: "Can handle employees"}}/></span>
              </div>

              <div className={`${(!employee.canAccessCrm ? "opacity-50" : "opacity-100")} transition-opacity flex items-center gap-2`}>
                <Switch disabled={!employee.userUuid || !canAccessCrm} value={canHandleVehicles} setValue={setCanHandleVehicles} />
                <span className="text-lg font-semibold"><Text text={{swe: "Kan hantera fordon", eng: "Can handle vehicles"}}/></span>
              </div>
            </div>
          </div>
          
        </div>

        <div className='flex gap-2'>
          <Button red={true} onClick={() => disassociateAccount()}><Text text={{eng: "Disassociate Account", swe: "Avlänka konto"}}/></Button>
          <Button red={true} onClick={() => disassociateAndRemoveAccount()} className='bg-light-red'><Text text={{eng: "Disassociate and remove account", swe: "Avlänka och ta bort konto"}}/></Button>
        </div>
      </div>
  )
}
