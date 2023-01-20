
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { useRouter } from "next/router"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { GetServerSidePropsContext, NextPage } from "next"
import { useRef, useState } from "react"
import Header from '../../components/Header'



const CreatePostForm: React.FC = () => {
  const router= useRouter()
  const user = useUser()
  const supabase = useSupabaseClient()
  const fileInput = useRef<HTMLInputElement>(null)
  const [ title, setTitle ] = useState("")
  const [ content, setContent ] = useState("")
  const [ avatar, setAvatarUrl ] = useState("")


  const CreatePost = async (title: string, content:string) => {

    const file = fileInput.current?.files?.[0]
    if(file) {
      //upload image to supabase bucket
      const { data, error } = await supabase.storage
          .from("posts")
          .upload("public" + file.name, file as File)

      try {
        //fetch user's profile information
        const {data: profileData, error} = await supabase
              .from("profiles")
              .select("username, avatar_url")
              .filter("user_id","eq", user?.id)
              .single()
        
        //insert all data to post table      
        const uploadResult = await supabase
          .from("posts")
          .insert({title, content, avatar_url: "public" + file.name , user_id: user?.id, post_owner: profileData?.username, owner_url: profileData?.avatar_url})    
       
        router.push("/feed")    
      }catch(error:any){
        console.log(error.message)
      }
      
    }
    

  }

  return (

    <div>
      <Header />
      <div className="relative mt-36">
        <div className="w-full md:w-2/6 mx-auto text-white">
          <h1 className="text-xl  font-semibold text-center my-4 md:text-2xl">Create Post</h1>
          <form onSubmit={(e) => {
                e.preventDefault()
                CreatePost(title, content)
                }}
                className="flex flex-col space-y-8 px-4 py-6"
          >
            
            <input type="text" value={title}  placeholder='Choose a Title' onChange={(e)=> setTitle(e.target.value)} className='input-form' />

            
            <textarea value={content} rows={5} placeholder="Write something about this article" onChange={(e)=> setContent(e.target.value)}  className='input-form'></textarea>

            <label htmlFor="avatar_url" className="text-base  font-semibold">Choose an iamge for your post</label>
            <button type="button" onClick={() => fileInput.current?.click()} className='bg-green-700 w-36 px-2 py-1'>
              Select Image
            </button>
            <input
              type="file"
              ref={fileInput}
              style={{ display: 'none' }}
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (file) {
                  const url = URL.createObjectURL(file)
                  setAvatarUrl(url)
                }
              }}
            />

            <button type="submit" className="bg-blue-600 py-2 w-36 mx-auto">Submit</button>

          </form>
        </div>
      </div>
    </div>
  )
}

export default CreatePostForm


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

