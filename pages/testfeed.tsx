import { createServerSupabaseClient } from '@supabase/auth-helpers-nextjs'
import { useUser } from '@supabase/auth-helpers-react'
import { GetServerSidePropsContext } from 'next'
import { useRouter } from 'next/router'
import React from 'react'

export default function feed() {
    const user = useUser()
    const router = useRouter() 
    

  return (
   
    <div className='relative mt-20'>here will be the post feed</div>
  )
}


export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
  // Create authenticated Supabase Client
  const supabase = createServerSupabaseClient(ctx);
  // Check if we have a session
  const {
    data: { session }
  } = await supabase.auth.getSession();

  if (!session)
    return {
      redirect: {
        destination: '/login',
        permanent: false
      }
    };

  return {
    props: {
      initialSession: session,
      user: session.user
    }
  };
};

