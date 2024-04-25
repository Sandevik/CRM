import Button from '@/components/Button'
import Input from '@/components/Input'
import Text from '@/components/Text';
import { CurrentCrmContext } from '@/context/CurrentCrmContext';
import { MenuContext } from '@/context/MenuContext';
import request from '@/utils/request';
import React, { useContext, useRef, useState } from 'react'
import { IoClose } from 'react-icons/io5';

export default function NewCustomerForm({active, setCreateCustomerActive, onSuccessfulSubmit}: {active: boolean, onSuccessfulSubmit: () => void, setCreateCustomerActive: React.Dispatch<React.SetStateAction<boolean>>}) {
    const {crm} = useContext(CurrentCrmContext);
    const {open} = useContext(MenuContext);

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
        <div className={`${active ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"} transition-all z-10 absolute top-0 left-0 h-full ${open ? "w-[calc(100dvw-23em)] " : "w-[100vw]"} bg-background-dark bg-opacity-40 backdrop-blur-md grid place-items-center z-20`}>
        <form ref={ref} method='POST' action={""} className={`${active ? "opacity-100 pointer-events-auto translate-x-0" : "opacity-0 pointer-events-none translate-x-8 "} bg-background-light transition-all  rounded-md mt-12 flex flex-col gap-6 p-4 z-10`}>
        <IoClose onClick={() => setCreateCustomerActive(false)} className="text-4xl absolute top-4 right-4 cursor-pointer"/>
        
        <h3 className="text-xl font-semibold"><Text text={{eng: "Create a new customer", swe: "Skapa en ny kund"}}/></h3>
            <div className="flex">
                <div>
                    <div className="border-r px-6 border-b pb-6">
                        <div className="grid grid-cols-2 gap-x-2">
                            <div className=" flex flex-col gap-2">
                                <label htmlFor="first name"><Text text={{eng: "First name", swe: "Förnamn"}} /></label>
                                <Input className="bg-accent-color font-semibold" name="first name" value={customer.firstName || ""} onChange={(e) => setCustomer({...customer, firstName: e.target.value})}/>
                            </div>

                            <div className=" flex flex-col gap-2">
                                <label htmlFor="last name"><Text text={{eng: "Last name", swe: "Efternamn"}} /></label>
                                <Input className="bg-accent-color font-semibold" name="last name"  value={customer.lastName || ""} onChange={(e) => setCustomer({...customer, lastName: e.target.value})}/>
                            </div>
                        </div>
                        <div className=" flex flex-col gap-2">
                            <label htmlFor="date of birth"><Text text={{eng: "Date of birth", swe: "Födelsedatum"}} /></label>
                            <Input className="bg-accent-color font-semibold" type='date' name="date of birth" value={customer.dateOfBirth || ""} onChange={(e) => setCustomer({...customer, dateOfBirth: e.target.value})}/>
                        </div>

                        <div className=" flex flex-col gap-2">
                            <label htmlFor="email">Email</label>
                            <Input className="bg-accent-color font-semibold" name="email" value={customer.email || ""} onChange={(e) => setCustomer({...customer, email: e.target.value})}/>
                        </div>
                    </div>

                    

                    <div className='border-r px-6   py-6'>
                        <div className="grid grid-cols-2 gap-x-2">
                            <div className=" flex flex-col gap-2">
                                <label htmlFor="address"><Text text={{eng: "Address", swe: "Adress"}} /></label>
                                <Input className="bg-accent-color font-semibold" name="address" value={customer.address || ""} onChange={(e) => setCustomer({...customer, address: e.target.value})}/>
                            </div>
                            <div className=" flex flex-col gap-2">
                                <label htmlFor="zip code"><Text text={{eng: "Zip code", swe: "Postkod"}} /></label>
                                <Input className="bg-accent-color font-semibold" name="zip code" value={customer.zipCode || ""} onChange={(e) => setCustomer({...customer, zipCode: e.target.value})}/>
                            </div>
                            <div className=" flex flex-col gap-2">
                                <label htmlFor="city"><Text text={{eng: "City", swe: "Stad"}} /></label>
                                <Input className="bg-accent-color font-semibold" name="city" value={customer.city || ""} onChange={(e) => setCustomer({...customer, city: e.target.value})}/>
                            </div>
                            <div className=" flex flex-col gap-2">
                                <label htmlFor="country"><Text text={{eng: "Country", swe: "Land"}} /></label>
                                <Input className="bg-accent-color font-semibold" name="country" value={customer.country || ""} onChange={(e) => setCustomer({...customer, country: e.target.value})}/>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="">
                    <div className=" px-6  border-b pb-6">
                        <div className=" flex flex-col gap-2">
                            <label htmlFor="company"><Text text={{eng: "Company", swe: "Företag"}} /></label>
                            <Input className="bg-accent-color font-semibold" name="company" value={customer.company || ""} onChange={(e) => setCustomer({...customer, company: e.target.value})}/>
                        </div>
                        <div className=" flex flex-col gap-2">
                            <label htmlFor="phone number"><Text text={{eng: "Phone number", swe: "Telefonnummer"}} /></label>
                            <Input className="bg-accent-color font-semibold" name="phone number" value={customer.phoneNumber || ""} onChange={(e) => setCustomer({...customer, phoneNumber: e.target.value})}/>
                        </div>
                    </div>

                    <div className=" px-6 py-6">    
                        <div className=" flex gap-2 items-center">
                            <label htmlFor="news letter"><Text text={{eng: "News letter", swe: "Nyhetsbrev"}} /></label>
                            <Input name="news letter" type='checkbox' className="h-5 w-5" checked={customer.newsLetter || false} onChange={(e) => setCustomer({...customer, newsLetter: e.target.checked})}/>
                        </div>
                    </div>
                </div>
            </div>
            <Button type='submit' onClick={(e) => submit(e)}><Text text={{eng: "Create", swe: "Skapa"}} /></Button>
        </form>
    </div>

  )
}
