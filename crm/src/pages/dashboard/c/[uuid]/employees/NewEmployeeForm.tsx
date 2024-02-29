import Button from '@/components/Button'
import Input from '@/components/Input'
import Text from '@/components/Text';
import { CurrentCrmContext } from '@/context/CurrentCrmContext';
import checkIfScrollable from '@/utils/checkIfScrollable';
import request from '@/utils/request';
import React, { FormEvent, useContext, useEffect, useRef, useState } from 'react'
import { FaCircleChevronDown } from "react-icons/fa6";

export default function NewEmployeeForm({active, setCreateEmployeeActive, onSuccessfulSubmit}: {active: boolean, onSuccessfulSubmit: () => void, setCreateEmployeeActive: React.Dispatch<React.SetStateAction<boolean>>}) {
    const {crm} = useContext(CurrentCrmContext);
    const [employee, setEmployee] = useState<Omit<Employee, "added" | "updated" | "uuid">>({
        crmUuid: crm?.crmUuid || "",
        userUuid: null,
        firstName: null,
        lastName: null,
        dateOfBirth: null,
        ssn: null,
        address: null,
        zipCode: null,
        city: null,
        phoneNumber: null,
        role: null,
        drivingLicenseClass: null,
        periodOfValidity: null,
        bankNumber: null,
        clearingNumber: null,
        bankName: null,
        email: null,
        employmentType: null,
        accessLevel: null,
    } as Employee);
    const ref = useRef<any>(undefined);

    useEffect(()=>{
        setEmployee({...employee, crmUuid: crm?.crmUuid || ""})
    },[crm])

    const submit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (crm?.crmUuid) {
            const res = await request("/employees/create", {...employee, crmUuid: crm?.crmUuid}, "POST");
            if (res.code === 201) {
                onSuccessfulSubmit();
                setEmployee({
                    crmUuid: crm.crmUuid,
                    userUuid: null,
                    firstName: null,
                    lastName: null,
                    dateOfBirth: null,
                    ssn: null,
                    address: null,
                    zipCode: null,
                    city: null,
                    phoneNumber: null,
                    role: null,
                    drivingLicenseClass: null,
                    periodOfValidity: null,
                    bankNumber: null,
                    clearingNumber: null,
                    bankName: null,
                    email: null,
                    employmentType: null,
                    accessLevel: null,  
                } as Employee)
            }
        }
    }
  
    return (
    <form ref={ref} method='POST' action={""} className={`${active ? "opacity-100 pointer-events-auto translate-x-0" : "opacity-0 pointer-events-none translate-x-8 "} bg-background-light transition-all h-[calc(100dvh-5em)] overflow-y-scroll scrollthumb rounded-md absolute top-2 right-2 w-[25em] flex flex-col gap-6 p-4 z-10`}>
        <Button type='button' onClick={() => setCreateEmployeeActive(!active)} className="absolute right-4 top-4 z-20">{active ? "Close" : "New employee"}</Button>
        <FaCircleChevronDown className="absolute bottom-2 right-2 text-xl animate-pulse"/>
        <h3 className="text-xl font-semibold"><Text text={{eng: "Create a new employee", swe: "Skapa en ny anställd"}}/></h3>
        <div className="grid grid-cols-2 gap-2">
            <div className=" flex flex-col gap-2">
                <label htmlFor="first name"><Text text={{eng: "First name", swe: "Förnamn"}} /></label>
                <Input className="bg-light-blue font-semibold" name="first name" value={employee.firstName || ""} onChange={(e) => setEmployee({...employee, firstName: e.target.value})}/>
            </div>

            <div className=" flex flex-col gap-2">
                <label htmlFor="last name"><Text text={{eng: "Last name", swe: "Efternamn"}} /></label>
                <Input className="bg-light-blue font-semibold" name="last name"  value={employee.lastName || ""} onChange={(e) => setEmployee({...employee, lastName: e.target.value})}/>
            </div>
        </div>
        <div className=" flex flex-col gap-2">
            <label htmlFor="date of birth"><Text text={{eng: "Date of birth", swe: "Födelsedatum"}} /></label>
            <Input className="bg-light-blue font-semibold" type='date' name="date of birth" value={employee.dateOfBirth || ""} onChange={(e) => setEmployee({...employee, dateOfBirth: e.target.value})}/>
        </div>
        
        <div className=" flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <Input className="bg-light-blue font-semibold" name="email" value={employee.email || ""} onChange={(e) => setEmployee({...employee, email: e.target.value})}/>
        </div>

        <div className='border-b-2'></div>

        <div className="grid grid-cols-2 gap-2">
            <div className=" flex flex-col gap-2">
                <label htmlFor="address"><Text text={{eng: "Address", swe: "Adress"}} /></label>
                <Input className="bg-light-blue font-semibold" name="address" value={employee.address || ""} onChange={(e) => setEmployee({...employee, address: e.target.value})}/>
            </div>

            <div className=" flex flex-col gap-2">
                <label htmlFor="zip code"><Text text={{eng: "Zip code", swe: "Postkod"}} /></label>
                <Input className="bg-light-blue font-semibold" name="zip code" value={employee.zipCode || ""} onChange={(e) => setEmployee({...employee, zipCode: e.target.value})}/>
            </div>

            <div className=" flex flex-col gap-2">
                <label htmlFor="city"><Text text={{eng: "City", swe: "Stad"}} /></label>
                <Input className="bg-light-blue font-semibold" name="city" value={employee.city || ""} onChange={(e) => setEmployee({...employee, city: e.target.value})}/>
            </div>

            <div className=" flex flex-col gap-2">
                <label htmlFor="country"><Text text={{eng: "Country", swe: "Land"}} /></label>
                <Input className="bg-light-blue font-semibold" name="country" value={employee.country || ""} onChange={(e) => setEmployee({...employee, country: e.target.value})}/>
            </div>
        </div>

        <div className='border-b-2'></div>
        
        <div className=" flex flex-col gap-2">
            <label htmlFor="company"><Text text={{eng: "User Uuid", swe: "Användar Uuid"}} /></label>
            <Input className="bg-light-blue font-semibold" name="company" value={employee.userUuid || ""} onChange={(e) => setEmployee({...employee, userUuid: e.target.value})}/>
        </div>
        
        <div className=" flex flex-col gap-2">
            <label htmlFor="phone number"><Text text={{eng: "Phone number", swe: "Telefonnummer"}} /></label>
            <Input className="bg-light-blue font-semibold" name="phone number" value={employee.phoneNumber || ""} onChange={(e) => setEmployee({...employee, phoneNumber: e.target.value})}/>
        </div>
        
        
        
        <Button type='submit' onClick={(e) => submit(e)}><Text text={{eng: "Create", swe: "Skapa"}} /></Button>
    </form>
  )
}
