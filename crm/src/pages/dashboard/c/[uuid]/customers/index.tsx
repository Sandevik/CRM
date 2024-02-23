import React, { useState } from 'react'
import Navbar from '../Navbar'
import Button from '@/components/Button';
import Input from '@/components/Input';
import Image from 'next/image';
import useReq from '@/hooks/useReq';
import { FaChevronRight, FaChevronLeft } from "react-icons/fa6";
import Spinner from '@/components/Spinner';
import NewCustomerForm from './NewClientForm';
import CustomerRow from './ClientRow';
import CustomerRowHeading from './ClientRowHeading';

export default function index() {
    const [createCustomerActive, setCreateCustomerActive] = useState<boolean>(false);
    
    const {data, refetch, nextResult, prevResult, setSearchQuery, searchQuery, searchResult, currentPage, loading} = useReq<Customer>({
      fetchUriNoParams: "/customers/all",
      searchUriNoParams: "/customers/search"
    })

    const onSuccessfullSubmit = () => {
      setCreateCustomerActive(false);
      refetch();
    }

  return (
    <main className='relative'>
        <Navbar />
        <div className='sticky mt-4 flex justify-center top-[110px]'>
        {data.length > 0 ? 
          <div className="flex gap-2 bg-background-dark bg-opacity-60">
            <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search" className="w-[30em]"/>
          </div> 
          : ""}
          <Button onClick={() => setCreateCustomerActive(!createCustomerActive)} className="absolute right-4 top-14 md:top-0 z-20">{createCustomerActive ? "Close" : "New customer"}</Button>
        </div>
        {loading &&  <Spinner className='text-5xl absolute top-[45%] w-full grid place-items-center' />}
        <NewCustomerForm setCreateCustomerActive={setCreateCustomerActive} onSuccessfulSubmit={onSuccessfullSubmit} active={createCustomerActive}/>
        {data.length > 0 ? 
        <ul className="p-4 mr-28 flex flex-col gap-2 h-[calc(100dvh-15em)]">
            <CustomerRowHeading />
            {!searchResult && data.map(customer => (<CustomerRow key={customer.uuid} customer={customer}/>))}
            {searchResult && searchResult.length > 0 && searchResult.map(customer => (<CustomerRow key={customer.uuid} customer={customer} />))}
        </ul>
        : <div className="flex justify-center items-center text-2xl mt-16 h-[calc(100dvh-15em)] flex-col gap-4">
            {!loading && 
            <>
              <span>Oops, it seems like you do not yet have any customers. Create one</span>
              <Image className="" priority src={"/astronaut.svg"} alt="astronaut" width={200} height={200}/>
            </>}
          </div>
       }

          <div className="flex gap-2 justify-center items-center">
            <Button onClick={() => prevResult()}><FaChevronLeft /></Button>
              <span>Page {currentPage}</span>
            <Button onClick={() => nextResult()}><FaChevronRight/></Button>
          </div>
    </main>
  )
}
