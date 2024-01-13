import React from 'react'

export default function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={`${props.className} bg-[var(--blue)] rounded-md p-1`}>{props.children}</button>
  )
}
