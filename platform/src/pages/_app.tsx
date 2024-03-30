import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import * as dotenv from "dotenv";
import { AuthContextProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { CurrentContextProvider } from '@/context/CurrentCrmContext';
dotenv.config();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <CurrentContextProvider>
        <Navbar />
        <Component {...pageProps} />
      </CurrentContextProvider>
    </AuthContextProvider>
  )
}
