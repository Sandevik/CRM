import { AuthContext } from '@/context/AuthContext'
import React, { useContext } from 'react'


export default function Text({text}:{text: Language}) {
    const {data} = useContext(AuthContext);
  return (
    <>
        {text[(data?.user?.preferredLanguage || "eng") as keyof Language]}
    </>
  )
}
