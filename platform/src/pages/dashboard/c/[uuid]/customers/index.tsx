import React, { useContext, useState } from 'react'
import Navbar from '../../../../../components/Navbar'
import Button from '@/components/Button';
import Input from '@/components/Input';
import Image from 'next/image';
import useReq from '@/hooks/useReq';
import { FaChevronRight, FaChevronLeft } from "react-icons/fa6";
import Spinner from '@/components/Spinner';
import NewCustomerForm from '../../../../../components/NewClientForm';
import CustomerRow from '../../../../../components/CustomerRow';
import CustomerRowHeading from '../../../../../components/CustomerRowHeading';
import Text from '@/components/Text';
import EmptyList from '@/components/EmptyList';
import { AuthContext } from '@/context/AuthContext';
import text from '@/utils/text';
import NotAllowed from '@/components/NotAllowed';
import Screen from '@/components/Screen';

export default function Index() {
    const {data: userData} = useContext(AuthContext);
    const [createCustomerActive, setCreateCustomerActive] = useState<boolean>(false);
    
    const {data, refetch, nextResult, prevResult, setSearchQuery, searchQuery, searchResult, currentPage, loading, notAllowed} = useReq<Customer>({
      fetchUriNoParams: "/customers/all",
      searchUriNoParams: "/customers/search"
    })

    const onSuccessfullSubmit = () => {
      setCreateCustomerActive(false);
      refetch();
    }

  return (
    <Screen>
        <h1 className="text-3xl flex justify-center py-2 font-semibold"><Text text={{eng: "Customers", swe: "Kunder"}}/></h1>
        {notAllowed 
        ? <NotAllowed /> 
        : <>
        
        <div className='sticky mt-4 flex justify-center top-[110px]'>
        {data.length > 0 ? 
          <div className="flex gap-2 bg-background-dark bg-opacity-60">
            <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={text({eng: "Search...", swe: "Sök..."}, userData)} className="w-[30em]"/>
          </div> 
          : ""}
          <Button onClick={() => setCreateCustomerActive(!createCustomerActive)} className="absolute right-4 top-14 md:top-0 z-20">{createCustomerActive ? <Text text={{eng: "Close", swe: "Stäng"}} /> : <Text text={{eng: "New customer", swe: "Ny kund"}} />}</Button>
        </div>
        {loading &&  <Spinner className='text-5xl absolute top-[45%] w-full grid place-items-center' />}
        <NewCustomerForm setCreateCustomerActive={setCreateCustomerActive} onSuccessfulSubmit={onSuccessfullSubmit} active={createCustomerActive}/>
        {data.length > 0 ? 
        <ul className="p-4 mr-28 flex flex-col gap-2 h-[calc(100dvh-15em)]">
            <CustomerRowHeading />
            {!searchResult && data.map(customer => (<CustomerRow key={customer.uuid} customer={customer}/>))}
            {searchResult && searchResult.length > 0 && searchResult.map(customer => (<CustomerRow key={customer.uuid} customer={customer} />))}
        </ul>
        : <EmptyList loading={loading} text={{eng: "Oops, it seems like you do not yet have any customers. Create one!", swe: "Oj, det ser ut som att du ännu inte har några kunder. Skaffa en!"}} />
       }

          <div className="flex gap-2 justify-center items-center">
            <Button onClick={() => prevResult()}><FaChevronLeft /></Button>
              <span><Text text={{eng: "Page", swe: "Sida"}} /> {currentPage}</span>
            <Button onClick={() => nextResult()}><FaChevronRight/></Button>
          </div>
          </>
          }
    </Screen>
  )
}
