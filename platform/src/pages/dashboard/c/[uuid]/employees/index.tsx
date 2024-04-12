import React, { useContext, useState } from 'react'
import Navbar from '../Navbar'
import Input from '@/components/Input'
import useReq from '@/hooks/useReq';
import Button from '@/components/Button';
import Spinner from '@/components/Spinner';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import Text from '@/components/Text';
import NewEmployeeForm from '../../../../../components/NewEmployeeForm';
import EmployeeRowHeading from '../../../../../components/EmployeeRowHeading';
import EmployeeRow from '../../../../../components/EmployeeRow';
import EmptyList from '@/components/EmptyList';
import text from '@/utils/text';
import { AuthContext } from '@/context/AuthContext';
import NotAllowed from '@/components/NotAllowed';

export default function Index() {
  const {data: userData} = useContext(AuthContext);
  const [createCustomerActive, setCreateEmployeeActive] = useState<boolean>(false);
    
    const {data, refetch, nextResult, prevResult, setSearchQuery, searchQuery, searchResult, currentPage, loading, notAllowed} = useReq<Employee>({
      fetchUriNoParams: "/employees/all",
      searchUriNoParams: "/employees/search"
    });

    const onSuccessfullSubmit = () => {
      setCreateEmployeeActive(false);
      refetch();
    }


  return (
    <main className='relative px-2 max-w-[1800px] m-auto'>
        <Navbar />
        <h1 className="text-3xl flex justify-center py-2 font-semibold"><Text text={{eng: "Employees", swe: "Anställda"}}/></h1>
        {notAllowed 
        ? <NotAllowed /> 
        : <>
        <div className='sticky mt-4 flex justify-center top-[110px]'>
        {data.length > 0 ? 
          <div className="flex gap-2 bg-background-dark bg-opacity-60">
            <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder={text({eng: "Search...", swe: "Sök..."}, userData)} className="w-[30em]"/>
          </div> 
          : ""}
          <Button onClick={() => setCreateEmployeeActive(!createCustomerActive)} className="absolute right-4 top-14 md:top-0 z-20">{createCustomerActive ? <Text text={{eng: "Close", swe: "Stäng"}} /> : <Text text={{eng: "New Employee", swe: "Ny Anställd"}} />}</Button>
        </div>
        {loading &&  <Spinner className='text-5xl absolute top-[45%] w-full grid place-items-center' />}
        <NewEmployeeForm setCreateEmployeeActive={setCreateEmployeeActive} onSuccessfulSubmit={onSuccessfullSubmit} active={createCustomerActive}/>
        {data.length > 0 ? 
        <ul className="p-4 mr-28 flex flex-col gap-2 h-[calc(100dvh-15em)]">
            <EmployeeRowHeading />
            {!searchResult && data.map(employee => (<EmployeeRow key={employee.uuid} employee={employee}/>))}
            {searchResult && searchResult.length > 0 && searchResult.map(employee => (<EmployeeRow key={employee.uuid} employee={employee} />))}
        </ul>
        : <EmptyList loading={loading} text={{eng: "Oops, it seems like you do not yet have any employees. Create one!", swe: "Oj, det ser ut som att du ännu inte har några anställda. Skaffa en!"}} />
       }

          <div className="flex gap-2 justify-center items-center">
            <Button onClick={() => prevResult()}><FaChevronLeft /></Button>
              <span><Text text={{eng: "Page", swe: "Sida"}} /> {currentPage}</span>
            <Button onClick={() => nextResult()}><FaChevronRight /></Button>
          </div>
          </>
        }
    </main>
  )
}
