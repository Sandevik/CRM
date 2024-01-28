import Button from '@/components/Button'
import Input from '@/components/Input'
import { CurrentCrmContext } from '@/context/CurrentCrmContext';
import React, { useContext, useEffect, useRef, useState } from 'react'
import { FaCircleChevronDown } from "react-icons/fa6";

export default function EditClient({active, setEdit, onSuccessfulSubmit, initialClient}: {initialClient: Client | null, active: boolean, onSuccessfulSubmit: () => void, setEdit: React.Dispatch<React.SetStateAction<boolean>>}) {
    const {crm} = useContext(CurrentCrmContext);
    const [client, setClient] = useState<Client>(initialClient || {
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
    } as Client);
    const [same, setSame] = useState<boolean>(clientsAreTheSame(client, initialClient || client))

    useEffect(()=>{
        setClient(initialClient || {
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
        } as Client)
    },[initialClient])

    useEffect(()=>{
        setSame(clientsAreTheSame(client, initialClient || client));
    },[initialClient, client])

    function clientsAreTheSame (edit: Client, initialClient: Client): boolean {
        let same = true;
        Object.keys(edit).forEach( editKey => {
            if (edit[editKey as keyof Client] !== initialClient[editKey as keyof Client]) same = false
        })
        return same
    }
    
    const ref = useRef<any>(undefined);

    const submit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (crm?.crmUuid) {
            
        }
    }
  
    return (
    <form ref={ref} method='POST' action={""} className={`${active ? "opacity-100 pointer-events-auto translate-x-0" : "opacity-0 pointer-events-none translate-x-8 "} bg-background-light transition-all h-[calc(100dvh-5em)] overflow-y-scroll scrollthumb rounded-md absolute top-2 right-2 w-[25em] flex flex-col gap-6 p-4 z-10`}>
        <Button type='button' onClick={() => setEdit(!active)} className="absolute right-4 top-4 z-20">{active ? "Close" : "Edit"}</Button>
        <FaCircleChevronDown className="absolute bottom-2 right-2 text-xl animate-pulse"/>
        <h3 className="text-xl font-semibold">Edit client</h3>
        <div className="grid grid-cols-2 gap-2">
            <div className=" flex flex-col gap-2">
                <label htmlFor="first name">First name</label>
                <Input className="bg-light-blue font-semibold" name="first name" value={client.firstName || ""} onChange={(e) => setClient({...client, firstName: e.target.value})}/>
            </div>

            <div className=" flex flex-col gap-2">
                <label htmlFor="last name">Last name</label>
                <Input className="bg-light-blue font-semibold" name="last name"  value={client.lastName || ""} onChange={(e) => setClient({...client, lastName: e.target.value})}/>
            </div>
        </div>
        <div className=" flex flex-col gap-2">
            <label htmlFor="date of birth">Date of birth</label>
            <Input className="bg-light-blue font-semibold" type='date' name="date of birth" value={client.dateOfBirth || ""} onChange={(e) => setClient({...client, dateOfBirth: e.target.value})}/>
        </div>
        
        <div className=" flex flex-col gap-2">
            <label htmlFor="email">Email</label>
            <Input className="bg-light-blue font-semibold" name="email" value={client.email || ""} onChange={(e) => setClient({...client, email: e.target.value})}/>
        </div>

        <div className='border-b-2'></div>

        <div className="grid grid-cols-2 gap-2">
            <div className=" flex flex-col gap-2">
                <label htmlFor="address">Addess</label>
                <Input className="bg-light-blue font-semibold" name="address" value={client.address || ""} onChange={(e) => setClient({...client, address: e.target.value})}/>
            </div>

            <div className=" flex flex-col gap-2">
                <label htmlFor="zip code">Zip code</label>
                <Input className="bg-light-blue font-semibold" name="zip code" value={client.zipCode || ""} onChange={(e) => setClient({...client, zipCode: e.target.value})}/>
            </div>

            <div className=" flex flex-col gap-2">
                <label htmlFor="city">City</label>
                <Input className="bg-light-blue font-semibold" name="city" value={client.city || ""} onChange={(e) => setClient({...client, city: e.target.value})}/>
            </div>

            <div className=" flex flex-col gap-2">
                <label htmlFor="country">Country</label>
                <Input className="bg-light-blue font-semibold" name="country" value={client.country || ""} onChange={(e) => setClient({...client, country: e.target.value})}/>
            </div>
        </div>

        <div className='border-b-2'></div>
        
        <div className=" flex flex-col gap-2">
            <label htmlFor="company">Company</label>
            <Input className="bg-light-blue font-semibold" name="company" value={client.company || ""} onChange={(e) => setClient({...client, company: e.target.value})}/>
        </div>
        
        <div className=" flex flex-col gap-2">
            <label htmlFor="phone number">Phone number</label>
            <Input className="bg-light-blue font-semibold" name="phone number" value={client.phoneNumber || ""} onChange={(e) => setClient({...client, phoneNumber: e.target.value})}/>
        </div>
        
        <div className=" flex gap-2 items-center">
            <label htmlFor="news letter">News Letter</label>
            <Input name="news letter" type='checkbox' className="h-5 w-5" checked={client.newsLetter || false} onChange={(e) => setClient({...client, newsLetter: e.target.checked})}/>
        </div>
        
        <Button type='submit' disabled={same} className={`${same ? "opacity-50 cursor-not-allowed hover:bg-light-blue" : "opacity-100 cursor-pointer"} transition-opacity`} onClick={(e) => submit(e)}>Done</Button>
    </form>
  )
}
