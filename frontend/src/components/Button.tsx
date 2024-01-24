import React from 'react'

export default function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={`${props.className} bg-light-blue text-background-dark font-semibold text-lg rounded-md p-1 hover:bg-greenish transition-colors flex items-center justify-center`}>{props.children}</button>
  )
}
