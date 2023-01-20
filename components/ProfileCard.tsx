import React from 'react'
import { NextPage } from 'next'
import { useUser } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { AiOutlineLike } from 'react-icons/ai'
import { FcLike } from 'react-icons/fc'


interface Props {
    profile : any,
}

const ProfileCard: NextPage<Props> = (props) => {
    const { profile } = props

  return (
    <div className='border shadow-md bg-[#faf4f4] mt-2  items-center justify-center'> 
        <div className='flex items-center px-2'>
        <h1>{profile?.user_id}</h1>
        </div>
        <div className='py-2 px-2'>
          <h1>{profile?.username}</h1>
          <h2>{profile?.profileMedila}</h2>
        </div>
        <div>
          <img src="https://bit.ly/placeholder-img" alt="" className='w-full' />
        </div>
    </div>

  )
}

export default ProfileCard