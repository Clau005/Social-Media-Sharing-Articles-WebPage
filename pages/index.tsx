import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { ThemeSupa, Auth } from '@supabase/auth-ui-react';
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router';
import styles from '../styles/Home.module.css'
import Login from '../components/Login';

export default function Home() {

  const user = useUser();
  const supabaseClient = useSupabaseClient();
  const router = useRouter()


  return (
  
      <div>
        
        <Login />
      </div>
      
    )
}
