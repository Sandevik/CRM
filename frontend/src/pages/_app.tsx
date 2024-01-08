import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import * as dotenv from "dotenv";
import { AuthContextProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
dotenv.config();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <Navbar />
      <Component {...pageProps} />
    </AuthContextProvider>
  )
}
