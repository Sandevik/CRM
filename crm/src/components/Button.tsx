import React, { useEffect, useRef } from 'react'

export default function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
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
    <button ref={ref} {...props} className={`${/.*(absolute|relative).*/.test(props.className || "") ? props.className : "relative"} ripple-btn bg-light-blue text-black font-semibold flex justify-center items-center rounded-sm h-[33px] min-w-[100px]`}>{props.children}</button>
  )
}
