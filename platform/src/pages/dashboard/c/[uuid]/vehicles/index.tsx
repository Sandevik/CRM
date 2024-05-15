import React, { useEffect, useState } from 'react'
import Navbar from '../../../../../components/Navbar'
import { bk1, bk2, bk3, bk4 } from '@/utils/BK';
import Input from '@/components/Input';
import Screen from '@/components/Screen';

export default function Index() {
  const [{tjänsteVikt, totalVikt, tillåtenLastVikt, maxViktAxel, maxViktAxelGrupp}, setTruckValues] = useState<{tjänsteVikt: number, totalVikt: number, tillåtenLastVikt: number, maxViktAxel: number, maxViktAxelGrupp: number}>({tjänsteVikt: 13545, totalVikt: 28000, tillåtenLastVikt: 14455, maxViktAxel: 9000, maxViktAxelGrupp: 19000});
  const [axelWidth, setAxelWidth] = useState(0);
  const [bkNum, setBkNum] = useState<1|2|3|4>(1);
  const [bkSum, setBkSum] = useState(0)
  
  useEffect(()=>{
    calculateBk(bkNum);
  },[axelWidth, bkNum])

  function calculateBk(bkNum: 1|2|3|4) {
    switch (bkNum) {
      case 1:
        var max = bk1(axelWidth, false, false);
        var allowed = max > totalVikt ? totalVikt - tjänsteVikt : max - tjänsteVikt;
        setBkSum(allowed < tillåtenLastVikt ? allowed : tillåtenLastVikt);
        break;
      case 2:
        var max = bk2(axelWidth, false, false);
        var allowed = max > totalVikt ? totalVikt - tjänsteVikt : max - tjänsteVikt;
        setBkSum(allowed < tillåtenLastVikt ? allowed : tillåtenLastVikt);
        break;
      case 3:
        var max = bk3(axelWidth);
        var allowed = max > totalVikt ? totalVikt - tjänsteVikt : max - tjänsteVikt;
        setBkSum(allowed < tillåtenLastVikt ? allowed : tillåtenLastVikt);
        break;
      case 4:
        var max = bk4(axelWidth);
        var allowed = max > totalVikt ? totalVikt - tjänsteVikt : max - tjänsteVikt;
        setBkSum(allowed < tillåtenLastVikt ? allowed : tillåtenLastVikt);
        break;
    }
  }


  return (
    <Screen>
      Hanera lager men också bilar och lastbilar m.m (service och uppgifter)
      Automatisk bk klass uträknare med transportstyrelsens api & bk klass uppgifter
      <br />
      <label htmlFor="Bk">Distans mellan första och sista axel:</label>
      <Input type="number" placeholder='Distans mellan första och sista axel (Ska fixas automatiskt)' value={axelWidth} onChange={(e)=>setAxelWidth(+e.target.value)} />
      <br />
      <label htmlFor="Bk">Bärighets klass:</label>
      <Input type="number" placeholder='Bk' value={bkNum} onChange={(e)=>setBkNum(+e.target.value as 1|2|3|4)} />
      
      <br />
      <div>Kalkylerad maxlast: {bkSum}kg</div>

      <div>Beräkna max antal pallplatser på fordon eller ekipage ex endast bil eller bil + släp</div>
      <div>Beräknad överlastavgift på fordon eller ekipage</div>

      <div>Planera körning på specifikt ekipage</div>


    </Screen>

  )
}
