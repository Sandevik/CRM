import React from 'react'
import Entry from './Entry';

export default function Entries({entries, client, refetchEntries}: {entries: Entry[], client: Client | null, refetchEntries: () => Promise<void>}) {

  return (
    <div className="flex flex-col gap-4 overflow-y- overflow-x-hidden scroll h-[calc(100dvh-16em)] scrollthumb pr-4">
        {entries.map(entry => <Entry refetchEntries={refetchEntries} client={client} key={entry.id} entry={entry} />)}
    </div>
  )
}
