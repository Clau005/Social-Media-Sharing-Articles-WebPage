import React, { useEffect, useState } from 'react'
import { NextPage } from 'next'
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { useRouter } from 'next/router'
import { AiOutlineLike } from 'react-icons/ai'
import { FcLike } from 'react-icons/fc'
import Link from 'next/link'
import { BiUserCircle } from 'react-icons/bi'
import Header from '../../components/Header'

const Post: NextPage = () => {
    const supabaseClient = useSupabaseClient()
    const user = useUser()
    const router = useRouter() 
    const [ post, setPost ] = useState<any>({})

    const { id } = router.query

    useEffect(() => {
        async function getPost() {
            
            const { data, error } = await supabaseClient
                .from("posts")
                .select("*")
                .filter("id","eq", id)
                .single()  
            if(error) {
                console.log(error)
            }else {
                setPost(data)
            }    
        }    
        if(typeof id !== "undefined") {
            getPost()
        }
    },[id])

    const handleDelete = async () => {
        try{

            const { data, error  } = await supabaseClient
                .from("posts")
                .delete()
                .eq("id", id)
            if(error) throw error
            router.push("/feed")
        }catch(error: any){
            alert(error.message)
        }
    }

   
    return (
        <div>
            <Header/>
        <div className=' w-[calc(80%)] mx-auto space-y-3 mt-28 bg-[#f4f4f4] py-6 px-6 '>
            <div className='flex w-full space-x-1'>
            <BiUserCircle className='w-6 h-6'/>  
              <p> {post.user_email}</p>
            </div>
            <h1 className='text-2xl font-semibold'>{post.title}</h1>
            <p className="text-base font-normal">{post.content}</p>

            { post.user_id === user?.id ? (
                <div className='space-x-4 mt-4'>
                    <button className='bg-red-500 px-2 py-1' onClick={handleDelete}>Detele Post</button>
                    <button className='bg-blue-500 px-2 py-1'onClick={()=> router.push("/edit-post?id=" + post.id)}>Edit Post</button>
                </div>
            ): (
                null
            )}
        </div>
        
          
        
        </div>
      )

      
}

 


export default Post