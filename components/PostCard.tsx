import React from 'react'
import { NextPage } from 'next'
import { useUser } from '@supabase/auth-helpers-react'
import { Router, useRouter } from 'next/router'
import { AiOutlineLike } from 'react-icons/ai'
import { FcLike } from 'react-icons/fc'
import Link from 'next/link'
import { BiUserCircle } from 'react-icons/bi'


interface Props {
  post: any
}

export default function PostCard({post}: Props) {


  return (
    <div>
      <h2>{post.title}</h2>
      <h2>{post.content}</h2>
      {post.avatar_url && (
        <img src={URL.createObjectURL(post.avatar_url)} className="h-24 w-24"/>
      )}
    </div>
  )
}

















// interface Props {
//     post : any,
// }

// const PostCard: NextPage<Props> = (props) => {
//     const { post } = props
//     const router = useRouter()

//     function getDate() {
//       const time  = Date.parse(post.created_at)
//       const date = new Date(time)

//       return date.getDay() + "-" + date.getMonth() + "-" + date.getFullYear()
//     }

//   return (
//     <div className=' border shadow-md bg-white mt-6  items-center justify-center pt-6 md:w-[calc(70%)]' onClick={()=> router.push("/post?id=" + post.id)}> 
//         <div className='text-[grey] items-center px-2'>
//           <div className='flex'>
//             <BiUserCircle className='w-6 h-6'/>  
//             <p className='font-semibold inline-block'>{post.user_email}</p>
//           </div>
//           <div>
//           <p>Posted at: {getDate()}</p>
//           </div>
//         </div>
//         <div className='space-y-2 pt-4 px-8 w-[calc(70%)]'>
//           <h1 className='text-2xl  font-semibold'>{post.title}</h1>
//           <p className=''>{post.content}</p>
//         </div>
//        <div className='bg-[#f4f3f3] border py-4 px-2'>
//         <p className='text-base font-semibold text-left'>Source : <Link href={post.source_url} className="text-blue-800">Follow this link to see the full article </Link></p>
//         <span className='text-xs font-extralight'>{post.source_url}</span>
//         <img
//           src={post.avatar_url}
//           alt="Avatar"
//           className="h-20 w-20"
//         />
//        </div>
//     </div>

//   )
// }

// export default PostCard