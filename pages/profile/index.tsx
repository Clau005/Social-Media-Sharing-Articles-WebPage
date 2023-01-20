import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import { NextPage } from "next"
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Header from '../../components/Header'
import { CgProfile, CgRowLast } from 'react-icons/cg'
import { BsInfoLg } from 'react-icons/bs'
import { AiOutlineHome } from 'react-icons/ai'
import Link from 'next/link'
import SidebarNav from '../../components/SidebarNav'



interface Posts {
  id: number,
  user_id: string,
  title: string,
  content: string,
  avatar_url:string
  post_owner:string,
  owner_url:string,
}



const Profile: NextPage = () => {
  const supabaseClient = useSupabaseClient()
  const user = useUser()
  const router = useRouter() 
  const [ profileUrl, setProfileUrl ] = useState<Blob | null>(null)
  const [ postImageUrls, setPostImageUrls ] = useState<Blob[]>([])
  const [ profile, setProfile ] = useState<any>({})
  const [ posts, setPosts] = useState<Posts[]>([])

  

  useEffect(() => {
    async function fetchProfiles() {
      //fetch profile data
      const {data, error } = await supabaseClient
        .from("profiles")
        .select("*")
        .eq("user_id", user?.id)
        .single()

      if(data) {
        setProfile(data)
        //fetch profile picture from supabase storage for authenticated user
        const{ data: porofilePicture } = await supabaseClient.storage
              .from("avatars")
              .download(data.avatar_url)
              setProfileUrl(porofilePicture)  
        //fetch posts related to auth user 
        const { data: posts} =  await supabaseClient
            .from("posts")
            .select("*")
            .eq("user_id", data.user_id)
        if(posts) {
          setPosts(posts)
          //fetch the images for each posts
          const imagePromises = posts.map(async post => {
            const { data: imageData } = await supabaseClient.storage
              .from('posts')
              .download(post.avatar_url)
              return imageData
          })

          const postImages = await Promise.all(imagePromises)
          const filteredPostImages = postImages.filter(image => image !== null) as Blob[]
            setPostImageUrls(filteredPostImages)
      
          
        
        } 
      } else(error:any) => {
        
        console.log(error.message)
      }
        
    }

    if(typeof user?.id !== "undefined") {
      fetchProfiles()
    }

  }, [user?.id])

  

  return (
    <div >

      <Header/>

      <div className='mt-24 md:mt-20'>
        <div className='relative w-full md:flex  '>
          <SidebarNav />
          <div className='flex flex-col md:w-[calc(65%)] md:mx-auto'>
            <div className='flex items-center md:mx-auto md:w-[calc(80%)]  md:border-b md:space-x-6 '>
              <div className='relative md:px-12 py-12 mx-4 my-4'>
                {profileUrl ? (
                  <div className='text-center space-y-2'>
                    <Image 
                      src={URL.createObjectURL(profileUrl)} 
                      alt="image"
                      width={36}
                      height={36}
                      className='h-36 w-36 border rounded-full md:h-40 md:w-40'
                    />
                  </div>
                ): null} 
        
              </div>
              <div className='text-white space-y-2 px-2 py-2  '>
                <p className='flex-col text-white font-semibold text-2xl shadow-sm'>{profile.username}</p>
                <h1 className='text-xl'>Profile Details</h1>
                <div className='font-italic'>
                  <p>Lives in: {profile.lives}</p>
                  <p>From: {profile.birthPlace}</p>
                  <p>Studied at: {profile.studied_at || "Write Something about your Study"}</p>
                </div>
              </div>
              
            </div>
            <div className='md:w-[calc(80%)] md:mt-8 md:mx-auto'>
              {posts.map( (post, index) => (
                <div key={post.id} className=' my-4 bg-black text-white py-8 border'>
                  
                  {postImageUrls[index] ?  (
                    <Image 
                      src={URL.createObjectURL(postImageUrls[index])}
                      alt="image"
                      height={32}
                      width={32}
                      className='w-full h-full pt-8'
                    />
                  ): null }
                  <div className='px-3 py-3'>
                    <h1 className='text-xl mb-2'>{post.title}</h1>
                    <p className='text-base'>{post.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>  
      </div> 

      
    </div>
  )

  }
  

 
  
  export default Profile


