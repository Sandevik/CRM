import React, { useContext, useEffect, useState } from 'react'
import Navbar from '../Navbar'
import { CurrentCrmContext } from '@/context/CurrentCrmContext'
import Button from '@/components/Button';
import NewClientForm from './NewClientForm';
import request from '@/utils/request';
import ClientRow from './ClientRow';
import Input from '@/components/Input';
import ClientRowHeading from './ClientRowHeading';
import Image from 'next/image';
import useReq from '@/hooks/useReq';
import { FaChevronRight, FaChevronLeft } from "react-icons/fa6";

export default function index() {
    const {crm} = useContext(CurrentCrmContext);
    const [createClientActive, setCreateClientActive] = useState<boolean>(false);
    


    const {data, refetch, nextResult, prevResult, setSearchQuery, searchQuery, searchResult, currentPage} = useReq(crm?.clients || [], {
      fetchUriNoParams: "/clients/all",
      searchUriNoParams: "/clients/search"
    })

    const onSuccessfullSubmit = () => {
      setCreateClientActive(false);
      refetch();

    }


  return (
    <main className='relative p-4'>
        <Navbar />
        {data.length > 0 ? 
        <div className='sticky mt-2  flex justify-center top-[130px]'>
          <div className="flex gap-2 bg-background-dark bg-opacity-60">
            <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search" className="w-[30em]"/>
          </div> 
          <Button onClick={() => setCreateClientActive(!createClientActive)} className="absolute right-4 top-14 md:top-0 z-20">{createClientActive ? "Close" : "New client"}</Button>
        </div>
        : ""}
        <NewClientForm setCreateClientActive={setCreateClientActive} onSuccessfulSubmit={onSuccessfullSubmit} active={createClientActive}/>
        {data.length > 0 ? 
        <ul className="p-4 mr-28 flex flex-col gap-2 h-[calc(100dvh-15em)]">
            <ClientRowHeading />
            {!searchResult && data.map(client => (<ClientRow key={client.uuid} client={client}/>))}
            {searchResult && searchResult.length > 0 && searchResult.map(client => (<ClientRow key={client.uuid} client={client} />))}
        </ul>
        : <div className="flex justify-center items-center text-2xl mt-16 h-full flex-col gap-4">
            <span>Oops, it seems like you do not yet have any clients. Create one</span>
            <Image className="" priority src={"/astronaut.svg"} alt="astronaut" width={200} height={200}/>
          </div>}

          <div className="flex gap-2 justify-center items-center">
            <Button onClick={() => prevResult()}><FaChevronLeft /></Button>
              <span>Page {currentPage}</span>
            <Button onClick={() => nextResult()}><FaChevronRight/></Button>
          </div>
    </main>
  )
}
