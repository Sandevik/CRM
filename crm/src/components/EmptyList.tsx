import Image from 'next/image'
import React from 'react'
import Text from './Text'

export default function EmptyList({text, loading}: {text: Language, loading: boolean}) {
  return (
    <div className="flex justify-center relative items-center text-2xl mt-16 h-[calc(100dvh-15em)] flex-col gap-4">
      {!loading && 
      <>
        <span className="z-10"><Text text={text} /></span>
        <Image className="absolute z-0 opacity-20" priority src={"/astronaut.svg"} alt="astronaut" width={300} height={300}/>
      </>}
    </div>
  )
}
