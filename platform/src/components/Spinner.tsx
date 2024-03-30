import React from 'react'
import { ImSpinner2 } from 'react-icons/im'

export default function Spinner({className}: {className?: string}) {
  return (
    <ImSpinner2 className={`fast-spinner ${/. text-[.] ./.test(className || "") ? className : className + " text-xl"}`}  />
  )
}
