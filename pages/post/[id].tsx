import { useUser } from '@supabase/auth-helpers-react';
import Image  from 'next/image';
import { useRouter } from "next/router";
import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import { supabaseClient } from "../../lib/supabaseClient"


type Post = {
    id: number;
    user_id: string;
    title: string;
    content: string;
    avatar_url: string;
    imageData: string;
    post_owner: string,
  }
  
function Post({ post }: { post: Post }) {
    const router = useRouter()
    const user = useUser()
    // const { id } = router.query
    const [avatarUrl, setAvatarUrl] = useState<Blob | null>(null)

    useEffect(() => {
        const getImage = async () => {
            const {data: imageData, error: downloadError} = await supabaseClient.storage
                .from('posts')
                .download(post.avatar_url)
            setAvatarUrl(imageData)
            
        }
        getImage()
    }, [post.id])

    async function deletePost() {

        const {data: deleteData, error} = await supabaseClient
            .from('posts')
            .delete()
            .eq('id', post.id)
            
    }


    function editPost()  {
        router.push(`/editPost/${post.id}`)
    }
    
    
    
    if(router.isFallback) {
        <div>Loading....</div>
    }
    // render the data
    return (
        <div>
            <Header />
            <div className='mt-24 text-white bg-black  md:w-2/6 mx-auto'>
                <div className='px-2 py-3'>
                    <h1>Posted By: {post.post_owner} </h1>
                </div>
                {avatarUrl ? (
                    <Image 
                        src={URL.createObjectURL(avatarUrl)}
                        alt={"picture"}
                        width={120}
                        height={120}
                        className="w-auto h-auto"
                    />
                ) : null }
                
                <div className='px-2 py-2 space-y-3'>
                    <h1 className='text-xl font-semibold '>{post.title}</h1>
                    <p className='text-base font-medium'>{post.content}</p>   
                </div>
                {user && post.user_id == user.id  ? (
                    <div className='flex space-x-4 text-white  mx-2 my-2'>
                        <button type='button' className='bg-blue-700 px-2 py-2' onClick={() => editPost()}>Edit Post</button>
                        <button type='button' className='bg-red-700 px-2 py-2' onClick={() => deletePost()}>Delete Post</button>
                    </div>
                ): (
                    null
                )
                    
                }
            </div>
        </div>
    );
}

export async function getStaticPaths() {
    
    const {data, error} = await supabaseClient
        .from('posts')
        .select('id')

    const paths = data?.map(post => ({params : { id: JSON.stringify(post.id) }}))
    
    return {
        paths,
        fallback: true
    }
}

export async function getStaticProps( {params}: {params: any}  ) {

    const  { id }  = params

    //fetch the post data
    const { data: post, error} = await supabaseClient
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()
    
    return {
        props: {
            post
        }
    }
    


} 

export default Post

 