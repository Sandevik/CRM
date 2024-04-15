import Button from '@/components/Button';
import Text from '@/components/Text';
import { CurrentCrmContext } from '@/context/CurrentCrmContext';
import request from '@/utils/request';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext } from 'react'
import { FaChevronLeft, FaUser } from "react-icons/fa";


export default function CustomerCard({customer, edit, setEdit}: {customer: Customer | null, edit: boolean, setEdit: React.Dispatch<React.SetStateAction<boolean>>}) {
    const {crm} = useContext(CurrentCrmContext);
    const router = useRouter();
    const deleteCustomer = async () => {
        if (crm?.crmUuid && customer?.uuid) {
            const res = await request(`/customers?crmUuid=${crm?.crmUuid}&uuid=${customer?.uuid}`, {}, "DELETE");
            if (res.code === 200) {
                router.push(`/dashboard/c/${crm.crmUuid}/customers`);
            }
        }
    }
  
    return (
    <div className="lg:w-[30%] xl:w-[30em] h-full bg-background-dark p-2 rounded-md flex flex-col justify-between relative">
        <Link href={`/dashboard/c/${crm?.crmUuid}/customers`} className="flex gap-2 items-center text-lg bg-accent-color hover:bg-greenish transition-colors absolute top-3 left-3 px-2 text-black rounded-md font-semibold"><FaChevronLeft /> <div><Text text={{eng: "Customers", swe: "Kunder"}} /></div> </Link>
        <div className="lg:hidden flex gap-8 h-full justify-between m-auto items-center">
            <div className="flex flex-col lg:h-[20%] my-10 gap-4">
                <FaUser className="text-7xl flex justify-center m-auto bg-background-light rounded-full p-4"/>
                <span className="m-auto flex justify-center text-2xl font-semibold">{customer?.firstName} {customer?.lastName}</span>
                <span className="mx-auto flex justify-center ">{customer?.dateOfBirth}</span>
            </div>

            <div className="flex flex-col gap-4 justify-center">
                <span className="mx-auto flex justify-center ">{customer?.address}</span>
                <span className="mx-auto flex justify-center ">{customer?.zipCode} {customer?.city}</span>
                <span className="mx-auto flex justify-center ">{customer?.country}</span>
            </div>
        </div>

            <div className="lg:flex flex-col h-[40%] lg:h-[20%] mt-10 hidden">
                <FaUser className="text-8xl flex justify-center m-auto bg-background-light rounded-full p-4"/>
                <span className="m-auto flex justify-center text-2xl font-semibold">{customer?.firstName} {customer?.lastName}</span>
                <span className="mx-auto flex justify-center ">{customer?.dateOfBirth}</span>
            </div>

            <div className="lg:flex flex-col gap-4 h-[30%] justify-center hidden">
                <span className="mx-auto flex justify-center ">{customer?.address}</span>
                <span className="mx-auto flex justify-center ">{customer?.zipCode} {customer?.city}</span>
                <span className="mx-auto flex justify-center ">{customer?.country}</span>
            </div>

        <div className="flex flex-col justify-center w-full gap-2 lg:h-[20%] mb-6 lg:mb-0">
            <div className="flex justify-between w-[70%] m-auto">
                <span>Email</span>
                {customer?.email ? <Link className="text-greenish" href={`mailto:${customer.email}`}>{customer?.email}</Link> : <span>-</span>}
            </div>
            <div className="flex justify-between w-[70%] m-auto">
                <span><Text text={{eng: "Phone", swe: "Telefon"}} /></span>
                {customer?.phoneNumber ? <Link className="text-greenish" href={`mailto:${customer.phoneNumber}`}>{customer?.phoneNumber}</Link> : <span>-</span>}
            </div>
            <div className="flex justify-between w-[70%] m-auto">
                <span><Text text={{eng: "Company", swe: "Företag"}} /></span>
                <span>{customer?.company || "-"}</span>
            </div>
            <div className="flex justify-between w-[70%] m-auto">
                <span><Text text={{eng: "Wants news letter", swe: "Vill ha nyhetsbrev"}} /></span>
                <span>{customer?.newsLetter ? "Yes" : "No"}</span>
            </div>
        </div>

        <div className="flex-1 justify-center gap-6 flex py-2 items-end">
            <Button onClick={() => setEdit(!edit)}>{edit ? <Text text={{eng: "Close", swe: "Stäng"}} /> : <Text text={{eng: "Edit", swe: "Ändra"}} />}</Button>
            <Button onClick={() => deleteCustomer()}><Text text={{eng: "Delete", swe: "Ta bort"}} /></Button>
        </div>

    </div>
  )
}
