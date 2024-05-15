import React, { useEffect, useRef } from 'react'

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  red?: boolean
}

export default function Button(props: Props) {
  const ref = useRef<any>();

  useEffect(()=>{
    const listener = ref?.current?.addEventListener("click", (e: any)=>{
      let ripple = document.createElement("span");
      let posX = e.clientX - e.target.offsetLeft;
      let posY = e.clientY - e.target.offsetTop;
      ref.current.style.setProperty("--x", posX + "px")
      ref.current.style.setProperty("--y", posY + "px")
      ripple.classList.add("ripple");
      ref.current.appendChild(ripple);
      setTimeout(()=>{
       try{ref.current.removeChild(ripple);}
       catch {}
      }, 750)
   })

   return () => ref?.current?.removeEventListener("click", listener)
  })

  return (
    <>
      {/*props.disabled && <span className={"absolute top-8 left-[23%] text-sm ripple-btn-reason"}>{props.disabledReason}</span>*/}
      <button ref={ref} {...props} className={`${/.*(absolute|relative).*/.test(props.className || "") ? props.className : "relative"} ripple-btn gap-1.5 text-black font-semibold px-2 flex justify-center items-center rounded-sm min-h-[33px] min-w-[100px] ${!props.disabled ? `${props.red ? "bg-light-red hover:bg-red-500" : "bg-accent-color hover:bg-gray-100"}` : "bg-gray-400 cursor-not-allowed"} transition-all $`}>{props.children}</button>
    </>
  )
}
