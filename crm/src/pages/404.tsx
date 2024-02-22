import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

export default function FourOhFour() {
  return (
    <main className="w-full h-[calc(100dvh-4em)] grid place-items-center relative">
        <div className="z-10">
            <div className="flex items-baseline gap-4">
                <h1 className="text-6xl">404.</h1>
                <p className="text-2xl">Oops, this page does not exist</p>
            </div>
            <Link href={"/dashboard"} className="underline">Back home</Link>
        </div>
        <Image className="absolute opacity-10" src={"astronaut.svg"} width={400} height={400} alt='Astronaut'></Image>
    </main>
  )
}
