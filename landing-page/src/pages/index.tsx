import Image from 'next/image'
import { Inter } from 'next/font/google'
import Navbar from '@/components/Navbar'
import Link from 'next/link'


export default function Home() {
  return (
    <main>
      <Navbar />

      <div className='pb-4 px-4 pt-2 h-[calc(100dvh-60px)]  flex flex-col md:grid md:grid-cols-2 '>
        <div className="flex flex-col justify-between">
          <h1 className="text-6xl tracking-wide font-semibold h-44">Build, Manage And Expand</h1>
          <Link href="https://platform.coneqt.xyz" target='_blank' className=" w-56 bg-accent-color p-3 text-2xl font-semibold pb-6">Explore The Platform</Link>
        </div>

        <ul className='h-full flex justify-end flex-col items-end md:text-6xl text-3xl tracking-widest gap-8 pb-8'>
          <li>Simplify</li>
          <li>Automate</li>
          <li>Organize</li>
        </ul>
      </div>

      <div id='vision' className='h-[70dvh] pt-[80px] bg-background-light flex flex-col-reverse md:grid md:grid-cols-2 text-white p-4 clip-path'>
        <div className='flex flex-col flex-1 justify-end gap-6 mb-12 text-2xl tracking-wider'>
          <p className="font-semibold">Allowing <span className='underline'>you</span> to run your business as smoothly and inexpensively as possible while using a simple system that removes redundant and tedious work.</p>
          <p>Focus on the work that actually <span className='underline'>matters</span> instead trying to manage an old, slow and ugly system!</p>
          <p>Our focus is to implement the functionality and features that <span className='underline'>you</span> need!</p>
        </div>
        <h2 className='flex justify-end text-6xl font-semibold tracking-widest'>The Vision</h2>
      </div>

      <div id='functionality' className='pb-4 px-4 pt-2 h-[calc(100dvh-50px)] text-white bg-background-dark -translate-y-1 flex flex-col md:grid md:grid-cols-2 '>
        <div className="flex flex-col justify-between">
          <h1 className="text-6xl tracking-wide font-semibold h-44">Functionality</h1>
        </div>

        <ul className='h-full flex justify-end flex-col items-end md:text-4xl text-2xl tracking-widest gap-8 pb-8'>
          <li>Time Reporting</li>
          <li>Employee Management</li>
          <li>Customer Management</li>
          <li>Vehicle / Fleet Management</li>
        </ul>
      </div>

    </main>
  )
}
