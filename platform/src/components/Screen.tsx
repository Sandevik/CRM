import { MenuContext } from '@/context/MenuContext'
import React, { useContext } from 'react'

export default function Screen({children}: {children: React.ReactNode}) {
    const {open} = useContext(MenuContext);
    return (
        <main className={`${open ? "max-w-[calc(100dvw-23em)] " : ""} p-2 transition-all min-h-[calc(100vh-4em)] `}>{children}</main>
    )
}
