import { useParams } from 'next/navigation'
import React from 'react'
import Navbar from '../../Navbar';

export default function index() {
  const params = useParams();
  return (
    <main className="px-2">
      <Navbar />
      {params?.employeeUuid}
    </main>
  )
}
