import { calculateMaxLoadWeight, calculatePalletNumber } from '@/utils/VehicleCalculations'
import React from 'react'

export default function TruckGraphic({truck, loadedWeight, overLoaded}: {truck: Truck, loadedWeight: number, overLoaded: boolean}) {

    const getWheelLocation = (i: number): number => {
        if (i === 0) return 0;
        return Number(truck.axleDistances.split("/").filter((_, j) => i > j).reduce((a, b) => String(Number(a) + Number(b))));
    }

  return (
    <div className='relative flex justify-between' style={{width: truck.length / 19, aspectRatio: truck.length / truck.width}}>
            <div style={{width: (truck.length - (truck.cargoLength || (truck.length * 0.8)) - 100) / 19}} className="bg-background-light rounded-tl-lg rounded-bl-lg -skew-x-[40deg]"></div>
            {truck.width && truck.cargoLength && 
            <ul style={{width : truck.cargoLength / 19, aspectRatio: (truck.cargoLength / truck.width)}} className={`p-0.5 flex flex-wrap items-center gap-0.5 place-items-center bg-background-light -skew-x-[40deg] before:content-[''] before:w-9 before:absolute before:right-0 before:translate-x-6 before:skew-x-[-45deg] before:top-6 before:h-1 before:bg-light-red  before:rotate-[-90deg] after:content-[''] after:w-9 after:absolute after:right-0 after:translate-x-6 after:skew-x-[-45deg] after:top-[7.4rem] after:h-1 after:bg-light-red  after:rotate-[-90deg]`}>
              {Array(calculatePalletNumber(truck)).fill("").map((_,i) => (<li style={{height: 800 / 19, aspectRatio: 1200 / 800}} className={`${overLoaded ? "bg-light-red" : "bg-accent-color"} z-10 flex items-center justify-center text-background-dark ${i % 3 && "pl-1"}`}>{(loadedWeight / calculatePalletNumber(truck as Truck)).toFixed(1) !== "0.0" && <div className="text-sm -rotate-45">{(loadedWeight / calculatePalletNumber(truck as Truck)).toFixed(1)}kg</div> } </li>))}
            </ul>
            }
            {Array(truck.axleCount).fill("").map((_, i) => (
              <div style={{translate: ((getWheelLocation(i) / 19)).toFixed(0)+"px"}} className={`absolute h-12 rounded-full aspect-square bg-background-light z-10 bottom-0 translate-y-14 skew-x-[6deg]`}></div>
              ))}
          </div>
  )
}
