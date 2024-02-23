import Image from 'next/image'
import React from 'react'
import Text from './Text'

export default function EmptyPage({text}: {text: Language}) {
  return (
    <div className="w-full h-full grid place-items-center relative">
        <div className="z-10">
            <div className="flex items-baseline gap-4">
                <p className="text-2xl"><Text text={text}/></p>
            </div>
        </div>
        <Image className="absolute opacity-10" src={"/astronaut.svg"} width={400} height={400} alt='Astronaut'></Image>
    </div>
  )
}
