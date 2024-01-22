import React from 'react'

export default function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input {...props} className={`${props.className} p-1 rounded-md text-gray-700`}  />
  )
}
