import {  useEffect, useState } from 'react'
import Header from "../../components/Header";
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import Link from 'next/link';

interface Post {
  id: number,
  user_id: string,
  title: string,
  content: string,
  avatar_url:string
  post_owner:string,
  owner_url:string,
}


export default function feed() {
 
  const [avatarUrl, setAvatarUrl] = useState<Blob[]>([])
  const [ownerUrl, setOwnerUrl] = useState<Blob[]>([])
  const [ posts, setPosts ] = useState<Post[]>([])
  // const [ username , setUsername] = useState("")
  const supabaseClient = useSupabaseClient()
  const router = useRouter()

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      //fetch all posts
      const {data: posts, error} = await supabaseClient
        .from("posts")
        .select("*")
        if(!posts) {
          return;
        }
      
         // download the images for each post
        const images = await Promise.all(
          posts.map(async post => {
            if (post.avatar_url) {
              const { data: imageData } = await supabaseClient.storage
                .from('posts')
                .download(post.avatar_url);
              return imageData;
            }
            return null;
          })
        );
        const filteredImages = images.filter(image => image !== null) as Blob[];
        
        
        //fetch the image for users profile picture
        const ownersUrl = await Promise.all(
          posts.map(async post => {
            if(post.user_id) {
              const{data: getAvatar} = await supabaseClient.from('profiles').select('*').eq('user_id', post.user_id).single()
              const path = getAvatar.avatar_url
              const {data: imageProfilaData} = await supabaseClient.storage
                .from('avatars')
                .download(path)
                return imageProfilaData;
            }
            return null;
          })
        );
        const filteredProfileImage = ownersUrl.filter(url => url !== null) as Blob[]

        
        // add the image data to the posts data
        const data = posts.map((post, index) => ({
          ...post,
          image_data: images[index],
          profile_data: ownersUrl[index]
        }));

        
        setPosts(data);
        setAvatarUrl(filteredImages);
        setOwnerUrl(filteredProfileImage);

        console.log(data)
        console.log(filteredImages)
        console.log(filteredProfileImage)


    } catch(error:any){
        console.log(error.message)
    }
    
  }

  

  return (

    <div>
        <Header />
        <div className='mt-24 relative md:w-[calc(40%)] md:mx-auto'>
          {posts.map((post, index) => (
            <div key={post.id} className='x-auto w-full text-white my-4  bg-black m'>
              <div className='flex  space-x-2 items-center px-2 py-4'>
              
                {ownerUrl[index]? (
                  <Image 
                  src={URL.createObjectURL(ownerUrl[index])}
                  alt="image"
                  height={32}
                  width={32}
                  className='w-12 h-12 rounded-full'/>
                  
                ): null}
                <h1 className='text-xl'>{post.post_owner}</h1>
              </div>
              
              {avatarUrl[index] ? (
               <div className='relative'>
                 <Image
                  src={URL.createObjectURL(avatarUrl[index])}
                  alt="image"
                  height={32}
                  width={32}
                  className="h-full w-full"
                  />
               </div>
              ) : null}
              <div className='px-3 py-4 space-y-2 '>
                <h1 className='text-xl font-semibold'>{post.title}</h1>
                <Link href={`/post/${post.id}`} >Read the full article</Link>
              </div>
            </div>
          ))}  
        </div>  
    </div>


  )
}

