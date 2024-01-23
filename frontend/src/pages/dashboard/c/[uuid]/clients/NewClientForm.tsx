import Button from '@/components/Button'
import Input from '@/components/Input'
import { CurrentCrmContext } from '@/context/CurrentCrmContext';
import request from '@/utils/request';
import React, { FormEvent, useContext, useState } from 'react'

export default function NewClientForm({active, onSuccessfulSubmit}: {active: boolean, onSuccessfulSubmit: () => void}) {
    const {crm} = useContext(CurrentCrmContext);
    const [client, setClient] = useState<Client>({
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

    const submit = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        if (crm?.crmUuid) {
            const res = await request("/clients/create", {...client, crmUuid: crm?.crmUuid}, "POST");
            if (res.code === 201) {
                onSuccessfulSubmit();
            }
        }
    }
  
    return (
    <form method='POST' action={""} className={`${active ? "opacity-100 pointer-events-auto translate-x-0" : "opacity-0 pointer-events-none translate-x-8"} bg-background-light transition-all rounded-md absolute top-32 right-2 w-[20%] flex flex-col gap-6 p-4`}>
        
        <h3 className="text-xl font-semibold">Create a new client</h3>
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
            <Input className="bg-light-blue font-semibold" name="date of birth" value={client.dateOfBirth || ""} onChange={(e) => setClient({...client, dateOfBirth: e.target.value})}/>
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
        
        <Button type='submit' onClick={(e) => submit(e)}>Create</Button>
    </form>
  )
}
