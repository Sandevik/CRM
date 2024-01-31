import { CurrentCrmContext } from '@/context/CurrentCrmContext'
import React, { useContext, useState } from 'react'
import Entry from './Entry';

export default function Entries() {
    const {crm} = useContext(CurrentCrmContext);

    const testEntries: Entry[] = [{id: 1, clientUuid: "adadsa-fahpo-dsiedsj-131s", addedAtMeeting: null, added: "2024-01-29", updated: "2024-01-29", content: "hfikajkfaldsla kahbfjabj ask k ajhjd hbaj djasbd jaj djas bdjajh dsbjasdhds jasj dbka,j dnkldaj nkdjakdsj kaj kab d"}, {id: 2, clientUuid: "1dqjds-fahpo-dsiedsj-131s", addedAtMeeting: "12ddad-13rf1d-d1d23d-dwadd", added: "2024-01-27", updated: "2024-01-29", content: "hfikajkfaldsla aljks hdakhd ja kahs dkash ,dakd n"}]
    const [entries, setEntries] = useState<Entry[]>(testEntries);


  return (
    <div className="flex flex-col gap-4 overflow-y- overflow-x-hidden scroll h-[calc(100dvh-16em)] scrollthumb pr-4">
        {entries.map(entry => <Entry entry={entry} />)}
        
    </div>
  )
}
