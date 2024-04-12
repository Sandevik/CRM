import React from 'react'
import Text from './Text'
import Image from 'next/image'

export default function NotAllowed() {
  return (
    <div className="sticky mt-4 flex justify-center top-[110px] items-center h-[calc(100dvh-18em)]">
        <Image className="absolute opacity-10" src={"/astronaut.svg"} width={400} height={400} alt='Astronaut'></Image>
        <div className='flex flex-col gap-2'>
            <h3 className="text-2xl text-center"><Text text={{eng: "Oops, you are not allowed to view this.", swe: "Oj, du är inte tillåten att se detta. "}} /></h3>  
            <p className="text-lg text-center"><Text text={{eng:" Please contact your administrator if you wish for this to change", swe: "Kontakta din administratör om du önskar att ändra detta"}} /></p>
        </div>
    </div>
  )
}
