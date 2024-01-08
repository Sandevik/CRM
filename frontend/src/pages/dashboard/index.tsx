import { AuthContext } from '@/context/AuthContext';
import useRequest from '@/hooks/useRequest'
import React, { useContext } from 'react'

export default function index() {
  const {data: authData} = useContext(AuthContext);
  const {data, loading} = useRequest("/users", {}, "GET");

  console.log(data);

  return (
    <div>dashboard</div>
  )
}
