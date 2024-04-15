import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import * as dotenv from "dotenv";
import { AuthContextProvider } from '@/context/AuthContext';
import Navbar from '@/components/Navbar';
import { CurrentContextProvider } from '@/context/CurrentCrmContext';
import { MenuContextProvider } from '@/context/MenuContext';
dotenv.config();

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthContextProvider>
      <CurrentContextProvider>
        <MenuContextProvider>
          <Navbar />
          <Component {...pageProps} />
        </MenuContextProvider>
      </CurrentContextProvider>
    </AuthContextProvider>
  )
}
