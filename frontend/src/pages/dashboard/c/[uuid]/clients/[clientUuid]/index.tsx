import { useParams } from 'next/navigation'
import React from 'react'

export default function index() {
    const params = useParams();

  
    return (
    <div>Client uuid: {params?.clientUuid} </div>
  )
}
