import Link from 'next/link'
import React from 'react'

export default function Navbar() {
  return (
    <div className='flex justify-between px-5  bg-background-light text-white h-16 sticky top-0 z-10'>
        <Link href="#" className='text-4xl tracking-wider font-bold flex h-full'>Coneqt</Link>
        <nav className='flex h-full items-center gap-10 text-2xl font-semibold tracking-wider'>
            <Link className="hover:tracking-widest transition-all hover:text-accent-color" href="#vision">The Vision</Link>
            <Link className="hover:tracking-widest transition-all hover:text-accent-color" href="#functionality">Functionality</Link>
            <Link className="hover:tracking-widest transition-all hover:text-accent-color" href="#">Why Coneqt</Link>
            <Link className="hover:tracking-widest transition-all hover:text-accent-color" href="#">About us</Link>
            <Link className="hover:tracking-widest transition-all hover:text-accent-color" href="https://platform.coneqt.xyz" target='_blank'>Explore The Platform</Link>
        </nav>
    </div>
  )
}
