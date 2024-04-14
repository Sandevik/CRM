import Image from 'next/image'
import React from 'react'
import Text from './Text'

export default function EmptyPage({text}: {text: Language}) {
  return (
    <div className="w-full h-full grid place-items-center relative z-1">
        <div className="z-1 flex items-center">
            <div className="flex items-center gap-4">
                <p className="text-2xl"><Text text={text}/></p>
            </div>
        </div>
        <Image className="absolute opacity-10 z-0 pointer-events-none" src={"/astronaut.svg"} width={400} height={400} alt='Astronaut'></Image>
    </div>
  )
}
