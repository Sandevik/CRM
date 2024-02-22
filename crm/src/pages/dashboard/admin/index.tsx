import { AuthContext } from '@/context/AuthContext';
import useRequest from '@/hooks/useRequest';
import React, { useContext, useEffect, useState } from 'react'
import UserRow from './UserRow';
import UserRowHeading from './UserRowHeading';
import { GrNext, GrPrevious  } from "react-icons/gr";
import request from '@/utils/request';

interface FetchOptions {
    offset: number,
    amount: number
}



export default function index() {
    const [fetchOptions, setFetchOptions] = useState<FetchOptions>({offset: 0, amount: 10})
    const [usersCount, setUsersCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const {data, loading} = useRequest<User[]>("/users", fetchOptions, "POST"); 

    useEffect(()=>{
        (async function () {
            const response = await request<{count: number}>("/users/count", {}, "GET");
            setUsersCount(response.count);
        })();
    },[])

    const handleIncrement = () => {
        setFetchOptions({...fetchOptions, offset: fetchOptions.offset+fetchOptions.amount});
        setCurrentPage(currentPage => currentPage + 1);
    }

    const handleDecrement = () => {
        setFetchOptions({...fetchOptions, offset: fetchOptions.offset-fetchOptions.amount});
        setCurrentPage(currentPage => currentPage > 1 ? currentPage - 1 : 1);
    }

  
 return (
    <div>
        <span className='m-auto flex justify-center font-semibold'>{usersCount} total users</span>
        <div className="my-2 flex px-2 justify-center gap-6">
            <button className='bg-[var(--blue)] px-2 py-1 rounded-md' onClick={()=>handleDecrement()}><GrPrevious /></button>
            Page {currentPage}
            <button className='bg-[var(--blue)] px-2 py-1 rounded-md' onClick={()=>handleIncrement()}><GrNext /></button>
        </div>

        <ul>
            <UserRowHeading />
            {data?.map((user: User) => (<UserRow key={user.uuid} user={user}/>))}
        </ul>
        
        
    </div>
  )
}
