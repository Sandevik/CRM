import Image from 'next/image'
import { Inter } from 'next/font/google'
import useRequest from '@/hooks/useRequest'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {

  const {data} = useRequest<any>("/", {}, "GET");


  return (
    <main className={``}>
      You are now logged in
      <br />
      data: {JSON.stringify(data)}
    </main>
  )
}
