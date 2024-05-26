import React, { useEffect, useState } from 'react'
import Navbar from '../../../../../components/Navbar'
import { calculateMaxLoadWeight, calculateOverWeightFee, calculatePalletNumber } from '@/utils/VehicleCalculations';
import Input from '@/components/Input';
import Screen from '@/components/Screen';
import Text from '@/components/Text';
import TruckGraphic from '@/components/TruckGraphic';

export default function Index() {
  
  const [vehicles, setVehicles] = useState<Truck[]>([{
    licensePlateNum: "STR007",
    overhangFrontBack: "1630/3550",
    width: 2550,
    length: 10150,
    vehicleCategory: "Lastbil",
    cargoLength: 8030,
    

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
    licensePlateNum: "STR004",
    overhangFrontBack: "+1400/+1200",
    width: 2550,
    length: 8350,
    vehicleCategory: "Lastbil",
    

    serviceWeight: 12190,
    totalWeight: 26000,
    taxWeight: 25000,
    garanteedAxleLoad: "8000+21000",
    maxLoad: 13810,
    highestTotalWeightForBk1: 25000,
    allowedLoadWeight: 12810,
    highestWeightSläpkärra: 26000,
    
    axleCount: 3,
    axleDistances: "4600/1370",
    wheelCount: 10,
    couplingType: "Bygel",
    highestWeightBreakingTrailer: 44000,
    couplingLoad: "Tryckluft",

    addtitionalData: {
      dValue: 190
    }

  } as Truck, {
    licensePlateNum: "STR005",
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
    overhangFrontBack: "/2750",
    width: 2550,
    length: 8550,
    vehicleCategory: "Lastbil",
    cargoLength: 6650,

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
    overhangFrontBack: "+1350/+940",
    width: 2550,
    length: 6300,
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
    licensePlateNum: "STR002",
    overhangFrontBack: "/2750",
    width: 2550,
    length: 8550,
    vehicleCategory: "Lastbil",
    cargoLength: 6650,

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
    licensePlateNum: "STR017",
    overhangFrontBack: "",
    width: 2500,
    length: 5950,
    vehicleCategory: "Lastbil",

    serviceWeight: 7800,
    totalWeight: 16900,
    taxWeight: 16900,
    garanteedAxleLoad: "7100+11500",
    maxLoad: 9100,
    highestTotalWeightForBk1: 16900,
    allowedLoadWeight: 9100,
    
    axleCount: 2,
    axleDistances: "3700",
    wheelCount: 6,
    couplingType: "Vändskiva",
    highestWeightBreakingTrailer: 44000,
    couplingDistance: 3070,
    couplingLoad: "Tryckluft",

    addtitionalData: {
      dValue: 190,
      goodSuspension: true,
    }

  } as Truck, {
    licensePlateNum: "AOW417",
    overhangFrontBack: "",
    width: 2600,
    length: 9750,
    vehicleCategory: "Lastbil",

    serviceWeight: 10230,
    totalWeight: 27000,
    taxWeight: 27000,
    garanteedAxleLoad: "8000+19000",
    maxLoad: 16770,
    highestTotalWeightForBk1: 16900,
    allowedLoadWeight: 9100,
    cargoLength: 7200,
    
    axleCount: 3,
    axleDistances: "4900/1360",
    wheelCount: 6,
    couplingType: "Bygel",
    highestWeightBreakingTrailer: 44000,
    couplingDistance: 3070,
    couplingLoad: "Tryckluft",

    addtitionalData: {
      dValue: 190,
      goodSuspension: true,
    }

  } as Truck])

  const [trailers, setTrailers] = useState<Trailer[]>([
    {
      licensePlateNum: "TRA016",
      width: 2550,
      length: 9900,
      vehicleCategory: "Släpvagn",
      serviceWeight: 4320,
      totalWeight: 38000,
      taxWeight: 36000,
      garanteedAxleLoad: "18000+20000",
      maxLoad: 33680,
      couplingDistance: 8590,
      couplingType: "Tapp",
      axleCount: 2,
      axleDistances: "5840/1990"
    } as Trailer
  ])


  const [selectedVehicle, setSelectedVehicle] = useState<Truck>(vehicles[0]);
  const [bkNum, setBkNum] = useState<1|2|3|4>(1);
  const [truckMaxWeight, setTruckMaxWeight] = useState(0)
  const [loadedWeight, setLoadedWeight] = useState<number>(0);
  
  useEffect(()=>{
    setTruckMaxWeight(calculateMaxLoadWeight(selectedVehicle as Truck, bkNum))
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

        <div className="flex flex-col gap-1 h-10">
          <label htmlFor="loadedWeight"><Text text={{swe: "Lastad vikt (kg)", eng: "Loaded weight (kg)"}}/></label>
          <Input value={loadedWeight} type='number' onChange={(e) => setLoadedWeight(+e.target.value)} />
        </div>

        <div className='flex flex-col gap-1'>
          <span>{calculatePalletNumber(selectedVehicle as Truck) ? "Estimerade pallplatser " + calculatePalletNumber(selectedVehicle as Truck) : "Kunde inte estimera pallplatser"}</span>
           
          <div className='absolute right-20 top-8'>
            <TruckGraphic truck={selectedVehicle} loadedWeight={loadedWeight} overLoaded={loadedWeight > truckMaxWeight}/>
          </div>          
          
        </div>

      </div>


      <br />
     
      
      

      <br />
      <div>Kalkylerad maxlast på bk{bkNum}: {truckMaxWeight > 0 ? truckMaxWeight + "kg" : "Ej körbart"}</div>
      <br />
      <div className="text-light-red">{truckMaxWeight - loadedWeight < 0 ? "Estimerad överlastavgift: " + calculateOverWeightFee(truckMaxWeight - loadedWeight) + "kr" : ""}</div>
      <br />
      <div>Beräkna max antal pallplatser på fordon eller ekipage ex endast bil eller bil + släp</div>
      <div>Beräknad överlastavgift på fordon eller ekipage</div>

      <div>Planera körning på specifikt ekipage</div>

      Hanera lager men också bilar och lastbilar m.m (service och uppgifter)
      Automatisk bk klass uträknare med transportstyrelsens api & bk klass uppgifter
      <br />


    </Screen>

  )
}
