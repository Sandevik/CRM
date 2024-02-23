import React from 'react'
import Entry from './Entry';
import Text from '@/components/Text';

export default function Entries({entries, customer, refetchEntries}: {entries: Entry[], customer: Customer | null, refetchEntries: () => Promise<void>}) {

  return (
    <div className="flex flex-col gap-4 overflow-y- overflow-x-hidden scroll h-[calc(100dvh-16em)] scrollthumb pr-4">
        {entries.map(entry => <Entry refetchEntries={refetchEntries} customer={customer} key={entry.id} entry={entry} />)}
        {entries.length < 1 && <div><Text text={{eng: "No entries found", swe: "Inga anteckningar hittades"}} /></div> }
    </div>
  )
}
