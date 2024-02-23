import Button from '@/components/Button'
import Input from '@/components/Input'
import { CurrentCrmContext } from '@/context/CurrentCrmContext';
import checkIfScrollable from '@/utils/checkIfScrollable';
import request from '@/utils/request';
import React, { FormEvent, useContext, useRef, useState } from 'react'
import { FaCircleChevronDown } from "react-icons/fa6";

export default function NewCustomerForm({active, setCreateCustomerActive, onSuccessfulSubmit}: {active: boolean, onSuccessfulSubmit: () => void, setCreateCustomerActive: React.Dispatch<React.SetStateAction<boolean>>}) {
    const {crm} = useContext(CurrentCrmContext);
    const [customer, setCustomer] = useState<Customer>({
        firstName: null,
        lastName: null,
        dateOfBirth: null,
        email: "",
        address: null,
        zipCode: null,
        city: null,
        country: null,
        company: null,
        phoneNumber: null,
        newsLetter: false,
        
    } as Customer);
    const ref = useRef<any>(undefined);

    const submit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (crm?.crmUuid) {
            const res = await request("/customers/create", {...customer, crmUuid: crm?.crmUuid}, "POST");
            if (res.code === 201) {
                onSuccessfulSubmit();
                setCustomer({
                    firstName: null,
                    lastName: null,
                    dateOfBirth: null,
                    email: "",
                    address: null,
                    zipCode: null,
                    city: null,
                    country: null,
                    company: null,
                    phoneNumber: null,
                    newsLetter: false} as Customer)
            }
        }
    }
  
    return (
    <form ref={ref} method='POST' action={""} className={`${active ? "opacity-100 pointer-events-auto translate-x-0" : "opacity-0 pointer-events-none translate-x-8 "} bg-background-light transition-all h-[calc(100dvh-5em)] overflow-y-scroll scrollthumb rounded-md absolute top-2 right-2 w-[25em] flex flex-col gap-6 p-4 z-10`}>
        <Button type='button' onClick={() => setCreateCustomerActive(!active)} className="absolute right-4 top-4 z-20">{active ? "Close" : "New customer"}</Button>
        <FaCircleChevronDown className="absolute bottom-2 right-2 text-xl animate-pulse"/>
        <h3 className="text-xl font-semibold">Create a new customer</h3>
        <div className="grid grid-cols-2 gap-2">
            <div className=" flex flex-col gap-2">
                <label htmlFor="first name">First name</label>
                <Input className="bg-light-blue font-semibold" name="first name" value={customer.firstName || ""} onChange={(e) => setCustomer({...customer, firstName: e.target.value})}/>
            </div>

            <div className=" flex flex-col gap-2">
                <label htmlFor="last name">Last name</label>
                <Input className="bg-light-blue font-semibold" name="last name"  value={customer.lastName || ""} onChange={(e) => setCustomer({...customer, lastName: e.target.value})}/>
            </div>
        </div>
        <div className=" flex flex-col gap-2">
            <label htmlFor="date of birth">Date of birth</label>
            <Input className="bg-light-blue font-semibold" type='date' name="date of birth" value={customer.dateOfBirth || ""} onChange={(e) => setCustomer({...customer, dateOfBirth: e.target.value})}/>
        </div>
        
        <div className=" flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <Input className="bg-light-blue font-semibold" name="email" value={customer.email || ""} onChange={(e) => setCustomer({...customer, email: e.target.value})}/>
        </div>

        <div className='border-b-2'></div>

        <div className="grid grid-cols-2 gap-2">
            <div className=" flex flex-col gap-2">
                <label htmlFor="address">Addess</label>
                <Input className="bg-light-blue font-semibold" name="address" value={customer.address || ""} onChange={(e) => setCustomer({...customer, address: e.target.value})}/>
            </div>

            <div className=" flex flex-col gap-2">
                <label htmlFor="zip code">Zip code</label>
                <Input className="bg-light-blue font-semibold" name="zip code" value={customer.zipCode || ""} onChange={(e) => setCustomer({...customer, zipCode: e.target.value})}/>
            </div>

            <div className=" flex flex-col gap-2">
                <label htmlFor="city">City</label>
                <Input className="bg-light-blue font-semibold" name="city" value={customer.city || ""} onChange={(e) => setCustomer({...customer, city: e.target.value})}/>
            </div>

            <div className=" flex flex-col gap-2">
                <label htmlFor="country">Country</label>
                <Input className="bg-light-blue font-semibold" name="country" value={customer.country || ""} onChange={(e) => setCustomer({...customer, country: e.target.value})}/>
            </div>
        </div>

        <div className='border-b-2'></div>
        
        <div className=" flex flex-col gap-2">
            <label htmlFor="company">Company</label>
            <Input className="bg-light-blue font-semibold" name="company" value={customer.company || ""} onChange={(e) => setCustomer({...customer, company: e.target.value})}/>
        </div>
        
        <div className=" flex flex-col gap-2">
            <label htmlFor="phone number">Phone number</label>
            <Input className="bg-light-blue font-semibold" name="phone number" value={customer.phoneNumber || ""} onChange={(e) => setCustomer({...customer, phoneNumber: e.target.value})}/>
        </div>
        
        <div className=" flex gap-2 items-center">
            <label htmlFor="news letter">News Letter</label>
            <Input name="news letter" type='checkbox' className="h-5 w-5" checked={customer.newsLetter || false} onChange={(e) => setCustomer({...customer, newsLetter: e.target.checked})}/>
        </div>
        
        <Button type='submit' onClick={(e) => submit(e)}>Create</Button>
    </form>
  )
}
