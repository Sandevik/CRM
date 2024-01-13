import Button from '@/components/Button';
import Input from '@/components/Input';
import React, { useState } from 'react'
import { IoClose } from "react-icons/io5";

export default function CreateCrmPopup({closePopup, active, createCrm}: {closePopup: () => void, active: boolean, createCrm: (name: string) => Promise<ResultData<any>>}) {
    const [name, setName] = useState<string>("");
    const [error, setError] = useState<ResultData<any> | null>(null);

    const handleCreateClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();
        const res = await createCrm(name);
        if (res.code !== 200) {
            setError(res);
        } else {
            setName("");
        }
    }

    return (
    <div className={`${active ? "view-box" : "no-view-box"} absolute top-0 left-0 h-full w-full bg-gray-600 bg-opacity-60 grid place-items-center backdrop-blur-sm z-10`}>
        <div className="relative h-[50%] w-[75%] md:w-[50%] bg-gray-300 rounded-md p-2 z-30">
            <form className="flex flex-col max-w-[70%] h-[70%] m-auto justify-evenly">
                <span className='font-semibold text-xl mt-4'>Create a new CRM system</span>
                <p className="my-4">Please enter the name of the new crm system you wish to create.</p>
                <div className="flex flex-col w-[70%] m-auto gap-4">
                    {error && <span className="flex justify-center text-[var(--pink)] font-bold">CRM name "{name}" already in use!</span>}
                    <Input value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter name' className={`text-xl ${error ? "ring-2 ring-[var(--pink)]" : "ring-2 ring-transparent"}`} />
                    <Button type="submit" onClick={(e) => handleCreateClick(e)}>Create</Button>
                </div>
            </form>
            <IoClose className="absolute top-2 right-2 text-4xl text-gray-600 cursor-pointer" onClick={() => closePopup()}/>
        </div>
    </div>
  )
}
