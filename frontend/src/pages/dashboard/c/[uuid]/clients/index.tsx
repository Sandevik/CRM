import React, { useContext } from 'react'
import Navbar from '../Navbar'
import { CurrentCrmContext } from '@/context/CurrentCrmContext'

export default function index() {
    const {crm} = useContext(CurrentCrmContext);


  return (
    <div>
        <Navbar/>
        <ul>
            {crm?.clients?.map(client => (<li>{client.firstName}</li>))}
        </ul>
    </div>
  )
}
