import React, { useEffect, useState } from 'react'
import Navbar from '../../../../../components/Navbar'
import { calculateMaxLoadWeight } from '@/utils/BK';
import Input from '@/components/Input';
import Screen from '@/components/Screen';
import Text from '@/components/Text';

export default function Index() {
  
  const [vehicles, setVehicles] = useState<(Trailer | Truck)[]>([{
    licensePlateNum: "STR007",
    overhangFrontBack: "2610",
    width: 2550,
    length: 10150,
    vehicleCategory: "Lastbil",

    serviceWeight: 25825,
    totalWeight: 39000,
    taxWeight: 32000,
    garanteedAxleLoad: "18000+21000",
    maxLoad: 14710,
    highestTotalWeightForBk1: 28000,
    allowedLoadWeight: 14710,
    highestWeightSläpkärra: 26000,
    
    axleCount: 4,
    axleDistances: "2200/3800/1370",
    wheelCount: 12,
    couplingType: "Bygel",
    highestWeightBreakingTrailer: 44000,
    couplingLoad: "Tryckluft",

    addtitionalData: {
      dValue: 190
    }

  } as Truck, {
    licensePlateNum: "STR005",
    overhangFrontBack: "2610",
    width: 2550,
    length: 10150,
    vehicleCategory: "Lastbil",

    serviceWeight: 11660,
    totalWeight: 27000,
    taxWeight: 26000,
    garanteedAxleLoad: "8000+19000",
    maxLoad: 14340,
    highestTotalWeightForBk1: 28000,
    allowedLoadWeight: 14710,
    highestWeightSläpkärra: 26000,
    
    axleCount: 3,
    axleDistances: "4300/1370",
    wheelCount: 10,
    couplingType: "Bygel",
    highestWeightBreakingTrailer: 44000,
    couplingLoad: "Tryckluft",

    addtitionalData: {
      dValue: 190
    }

  } as Truck, {
    licensePlateNum: "STR002",
    overhangFrontBack: "2610",
    width: 2550,
    length: 10150,
    vehicleCategory: "Lastbil",

    serviceWeight: 6880,
    totalWeight: 11990,
    taxWeight: 11990,
    garanteedAxleLoad: "4480+8480",
    maxLoad: 5110,
    highestTotalWeightForBk1: 28000,
    allowedLoadWeight: 14710,
    highestWeightSläpkärra: 26000,
    
    axleCount: 2,
    axleDistances: "4700",
    wheelCount: 10,
    couplingType: "Bygel",
    highestWeightBreakingTrailer: 44000,
    couplingLoad: "Tryckluft",

    addtitionalData: {
      dValue: 190
    }

  } as Truck, {
    licensePlateNum: "STR009",
    overhangFrontBack: "2610",
    width: 2550,
    length: 10150,
    vehicleCategory: "Lastbil",

    serviceWeight: 9045,
    totalWeight: 27000,
    taxWeight: 24000,
    garanteedAxleLoad: "8000+19000",
    maxLoad: 17955,
    highestTotalWeightForBk1: 28000,
    allowedLoadWeight: 14710,
    highestWeightSläpkärra: 26000,
    
    axleCount: 3,
    axleDistances: "2750/1320",
    wheelCount: 10,
    couplingType: "Bygel",
    highestWeightBreakingTrailer: 44000,
    couplingLoad: "Tryckluft",

    addtitionalData: {
      dValue: 190
    }

  } as Truck, {
    licensePlateNum: "STR023",
    year: 2009,
    width: 2600,
    cargoLength: 12400,
    vehicleCategory: "Släpvagn",
    overhangFrontBack: "/+1470",
    length: 14550,

    serviceWeight: 9590,
    totalWeight: 36000,
    taxWeight: 36000,
    garanteedAxleLoad: "18000+18000",
    maxLoad: 26410,
    highestTotalWeightForBk1: 36000,
    allowedLoadWeight: 26410,

    axleCount: 4,
    axleDistances: "1340/7320/1360",

    additionalData: {
      dValue: 167
    }
} as Trailer])
  const [selectedVehicle, setSelectedVehicle] = useState<Truck | Trailer>(vehicles[0]);
  const [bkNum, setBkNum] = useState<1|2|3|4>(1);
  const [bkSum, setBkSum] = useState(0)
  
  useEffect(()=>{
    setBkSum(calculateMaxLoadWeight(selectedVehicle as Truck, bkNum))
  },[selectedVehicle, bkNum])


  
  const conjoinableVehicles = (truck: Truck, trailer: Trailer): boolean => {
    if (!truck?.addtitionalData?.dValue || !trailer?.additionalData?.dValue) return false;
    return truck.addtitionalData.dValue >= trailer.additionalData.dValue
  }  



  return (
    <Screen>

      <div className="flex gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="vehicle"><Text text={{eng: "Current vehicle", swe: "Nuvarande fordon"}}/></label>
          <select className='bg-background-light max-w-32 p-1 text-lg' name="vehicle" onChange={(e) => setSelectedVehicle(vehicles.find(vehicle => vehicle.licensePlateNum === e.target.value) as Truck)}>
            {vehicles.map(vehicle => (<option value={vehicle.licensePlateNum} className="">{vehicle.licensePlateNum}</option>))}

          </select>
        </div>

        <div className="flex flex-col gap-1">
        <label htmlFor="bk">Bärighets klass:</label>
          <select onChange={(e) => setBkNum(+e.target.value as 1|2|3|4)} className='bg-background-light p-1 max-w-11' name="bk" id="">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
            <option value="4">4</option>
          </select>
        </div>
      </div>

      <br />
     
      

      <br />
      <div>Kalkylerad maxlast på bk{bkNum}: {bkSum > 0 ? bkSum + "kg" : "Ej körbart"}</div>

      <div>Beräkna max antal pallplatser på fordon eller ekipage ex endast bil eller bil + släp</div>
      <div>Beräknad överlastavgift på fordon eller ekipage</div>

      <div>Planera körning på specifikt ekipage</div>

      Hanera lager men också bilar och lastbilar m.m (service och uppgifter)
      Automatisk bk klass uträknare med transportstyrelsens api & bk klass uppgifter
      <br />


    </Screen>

  )
}
