import { useParams } from 'next/navigation'
import React from 'react'

export default function index() {
  const params = useParams();


  return (
    <div>{params?.uuid}</div>
  )
}
