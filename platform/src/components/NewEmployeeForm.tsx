import Button from '@/components/Button'
import Input from '@/components/Input'
import Text from '@/components/Text';
import { CurrentCrmContext } from '@/context/CurrentCrmContext';
import { MenuContext } from '@/context/MenuContext';
import checkIfScrollable from '@/utils/checkIfScrollable';
import request from '@/utils/request';
import React, { FormEvent, useContext, useEffect, useRef, useState } from 'react'
import { FaCircleChevronDown } from "react-icons/fa6";
import { IoClose } from 'react-icons/io5';

export default function NewEmployeeForm({active, setCreateEmployeeActive, onSuccessfulSubmit}: {active: boolean, onSuccessfulSubmit: () => void, setCreateEmployeeActive: React.Dispatch<React.SetStateAction<boolean>>}) {
    const {crm} = useContext(CurrentCrmContext);
    const {open} = useContext(MenuContext);
    const [error, setError] = useState<string | null>(null);
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
        email: null,
        contract_uuid: null,
        accessLevel: null,
    } as Employee);
    const ref = useRef<any>(undefined);

    useEffect(()=>{
        setEmployee({...employee, crmUuid: crm?.crmUuid || ""})
    },[crm])

    const submit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (employee.email === null || employee.email === "" || employee.phoneNumber === null || employee.phoneNumber === "") {
            setError("Email or phone number not found")
            return;
        }
        if (crm?.crmUuid) {
            const res = await request("/employees/create", {...employee, crmUuid: crm?.crmUuid}, "POST");
            if (res.code === 201) {
                onSuccessfulSubmit();
                setError(null);
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
                    email: null,
                    contract_uuid: null,
                    accessLevel: null,  
                } as Employee)
            }
        }
    }
    return (
    <div className={`${active ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} transition-all z-10 absolute top-0 left-0 h-full ${open ? "w-[calc(100dvw-23em)] " : "w-[100vw]"} bg-background-dark bg-opacity-40 backdrop-blur-md grid place-items-center`}>
        <form ref={ref} method='POST' action={""} className={`${active ? "opacity-100 pointer-events-auto translate-x-0" : "opacity-0 pointer-events-none translate-x-8 "} bg-background-light transition-all  rounded-md mt-12 flex flex-col gap-6 p-4 z-10`}>
        <IoClose onClick={() => setCreateEmployeeActive(false)} className="text-4xl absolute top-4 right-4 cursor-pointer"/>
        
        <h3 className="text-xl font-semibold"><Text text={{eng: "Create a new employee", swe: "Skapa en ny anställd"}}/></h3>
            <div className="flex">
                <div>
                    <div className="border-r px-6 border-b pb-6">
                        <div className="grid grid-cols-2 gap-x-2">
                            <div className=" flex flex-col gap-2">
                                <label htmlFor="first name"><Text text={{eng: "First name", swe: "Förnamn"}} /></label>
                                <Input className="bg-accent-color font-semibold" name="first name" value={employee.firstName || ""} onChange={(e) => setEmployee({...employee, firstName: e.target.value})}/>
                            </div>

                            <div className=" flex flex-col gap-2">
                                <label htmlFor="last name"><Text text={{eng: "Last name", swe: "Efternamn"}} /></label>
                                <Input className="bg-accent-color font-semibold" name="last name"  value={employee.lastName || ""} onChange={(e) => setEmployee({...employee, lastName: e.target.value})}/>
                            </div>
                        </div>
                        <div className=" flex flex-col gap-2">
                            <label htmlFor="date of birth"><Text text={{eng: "Date of birth", swe: "Födelsedatum"}} /></label>
                            <Input className="bg-accent-color font-semibold" type='date' name="date of birth" value={employee.dateOfBirth || ""} onChange={(e) => setEmployee({...employee, dateOfBirth: e.target.value})}/>
                        </div>

                        <div className=" flex flex-col gap-2">
                            <label htmlFor="ssn"><Text text={{eng: "Social Security Number", swe: "Personnummer"}} /></label>
                            <Input className="bg-accent-color font-semibold" name="ssn" value={employee.ssn || ""} onChange={(e) => setEmployee({...employee, ssn: e.target.value})}/>
                        </div>
                    </div>

                    

                    <div className='border-r px-6   py-6'>
                        <div className=" flex flex-col gap-2">
                            <div className={`flex justify-between ${error && (employee.email === "" || employee.email === null) ? "text-red-400" : ""}`}>
                                <label htmlFor="email">Email *</label>
                                {error && (employee.email === "" || employee.email === null) && <Text text={{swe: "Detta fält är nödvändigt!", eng: "This field is required!"}} />}
                            </div>
                            <Input type='email' className={`bg-accent-color font-semibold ${ error && (employee.email === "" || employee.email === null) ? "ring-2 ring-red-400" : ""}`} name="email" value={employee.email || ""} onChange={(e) => setEmployee({...employee, email: e.target.value})}/>
                        </div>

                        <div className=" flex flex-col gap-2">
                            <div className={`flex justify-between ${error && (employee.phoneNumber === "" || employee.phoneNumber === null) ? "text-red-400" : ""}`}>
                                <label htmlFor="phone number"><Text text={{eng: "Phone number *", swe: "Telefonnummer *"}} /></label>
                                {error && (employee.phoneNumber === "" || employee.phoneNumber === null) && <Text text={{swe: "Detta fält är nödvändigt!", eng: "This field is required!"}} />}
                            </div>
                            <Input required type='tel' className={`bg-accent-color font-semibold ${ error && (employee.phoneNumber === "" || employee.phoneNumber === null) ? "ring-2 ring-red-400" : ""}`} name="phone number" value={employee.phoneNumber || ""} onChange={(e) => setEmployee({...employee, phoneNumber: e.target.value})}/>
                        </div>
                    </div>
                </div>

                <div className="">
                    <div className="border-l px-6  border-b pb-6">
                    <div className="grid grid-cols-2 gap-x-2">

                            <div className=" flex flex-col gap-2">
                                <label htmlFor="address"><Text text={{eng: "Address", swe: "Adress"}} /></label>
                                <Input className="bg-accent-color font-semibold" name="address" value={employee.address || ""} onChange={(e) => setEmployee({...employee, address: e.target.value})}/>
                            </div>

                            <div className=" flex flex-col gap-2">
                                <label htmlFor="zip code"><Text text={{eng: "Zip code", swe: "Postkod"}} /></label>
                                <Input className="bg-accent-color font-semibold" name="zip code" value={employee.zipCode || ""} onChange={(e) => setEmployee({...employee, zipCode: e.target.value})}/>
                            </div>

                            <div className=" flex flex-col gap-2">
                                <label htmlFor="city"><Text text={{eng: "City", swe: "Stad"}} /></label>
                                <Input className="bg-accent-color font-semibold" name="city" value={employee.city || ""} onChange={(e) => setEmployee({...employee, city: e.target.value})}/>
                            </div>

                            <div className=" flex flex-col gap-2">
                                <label htmlFor="country"><Text text={{eng: "Country", swe: "Land"}} /></label>
                                <Input className="bg-accent-color font-semibold" name="country" value={employee.country || ""} onChange={(e) => setEmployee({...employee, country: e.target.value})}/>
                            </div>
                        </div>
                    </div>

                    <div className="border-l px-6   py-6">
                        <div className=" flex flex-col gap-2">
                            <label htmlFor="role"><Text text={{eng: "Role", swe: "Roll"}} /></label>
                            <Input className="bg-accent-color font-semibold" name="role" value={employee.role || ""} onChange={(e) => setEmployee({...employee, role: e.target.value})}/>
                        </div>


                        <div className=" flex flex-col gap-2">
                            <label htmlFor="drivingLicenseClass"><Text text={{eng: "Driving License Class", swe: "Körkortsklass"}} /></label>
                            <Input className="bg-accent-color font-semibold" name="drivingLicenseClass" value={employee.drivingLicenseClass || ""} onChange={(e) => setEmployee({...employee, drivingLicenseClass: e.target.value})}/>
                        </div>

                        <div className=" flex flex-col gap-2">
                            <label htmlFor="periodOfValidity"><Text text={{eng: "Period Of Validity", swe: "Giltighetsperiod"}} /></label>
                            <Input className="bg-accent-color font-semibold" name="periodOfValidity" value={employee.periodOfValidity || ""} onChange={(e) => setEmployee({...employee, periodOfValidity: e.target.value})}/>
                        </div>
                    </div>
                </div>
            </div>
            <Button type='submit' onClick={(e) => submit(e)}><Text text={{eng: "Create", swe: "Skapa"}} /></Button>
        </form>
    </div>
  )
}
