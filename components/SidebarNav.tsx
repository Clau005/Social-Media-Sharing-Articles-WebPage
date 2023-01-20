
import { useState, useEffect } from 'react'
import { AiOutlineHome } from 'react-icons/ai'
import Link from 'next/link'
import { CgProfile, CgRowLast } from 'react-icons/cg'
import { BsInfoLg } from 'react-icons/bs'
import { supabaseClient } from '../lib/supabaseClient'
import { useUser } from '@supabase/auth-helpers-react'


interface Posts {
  id: number,
  user_id: string,
  title: string,
  content: string,
  avatar_url:string
  post_owner:string,
  owner_url:string,
}

export default function Nav()   {

  const [ posts, setPosts] = useState<Posts[]>([])
  const user = useUser()
  const id = user?.id

  useEffect(() => {
    const getlastsPosts = async () => {
      const { data, error } = await supabaseClient
        .from('posts')
        .select('*')
        .eq('user_id', id)
        .limit(3)

      if(data) {
        setPosts(data)
      }
    }
    getlastsPosts()
  })
   

  return (
    <div className='hidden text-white space-y-8 border-r-1 md:block md:fixed md:h-full md:bg-black  md:w-[calc(20%)]'>
    <div className='nav-link' >
      <Link href={'/profile/edit'} className='flex'>
        <CgProfile className='h-8 w-8'/>
        <h1 className='text-2xl px-4'>Edit Profile</h1>
      </Link>
    </div>
    <div className='nav-link'>
      <AiOutlineHome className='h-8 w-8'/>
      <h1 className='text-2xl px-4'>Feed</h1>
    </div>
    <div className='nav-link'>
      <BsInfoLg className='h-8 w-8'/>
      <h1 className='text-2xl px-4'>What's'new?</h1>
    </div>
    <div className='relative items-center  '>
      <div className='nav-link'>
        <CgRowLast className='h-8 w-8'/>
        <h1 className='text-2xl pl-2'>Your lasts Posts</h1>
      </div>
      {posts.map((post) => (
        <div className='w-4/6 px-6 py-2  mx-auto '>
          <Link href={`/posts/${post.id}`}>{post.title}</Link>
        </div>
      ))}
    </div>
  </div>

  )
}

