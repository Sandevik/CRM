import React from 'react'

export default function Switch({value, setValue, disabled}: {value: boolean, setValue: React.Dispatch<React.SetStateAction<boolean>> | ((val: boolean) => void), disabled?: boolean}) {
    return (
    <label className={"switch"}>
        <input disabled={disabled} onChange={(e)=> setValue(!value)} checked={value} type="checkbox" />
        <span className={(disabled ? "cursor-not-allowed" : "cursor-pointer") + " slider round"}></span>
    </label>
  )
}


