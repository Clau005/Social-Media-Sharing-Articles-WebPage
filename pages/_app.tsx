import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { SessionContextProvider } from '@supabase/auth-helpers-react'
import { useState } from 'react'


//providers (providing Supabase to app)

export default function App({ Component, pageProps }: AppProps) {

 const publicKey = useState(process.env.NEXT_PUBLIC_SUPBASE_URL)
 const anaonKey = useState(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
 const [ supabaseClient ] = useState(() => createBrowserSupabaseClient())


  return (
   
    <SessionContextProvider
      supabaseClient={supabaseClient}>

       
        <Component {...pageProps}  />

      
    </SessionContextProvider>

  )
}
