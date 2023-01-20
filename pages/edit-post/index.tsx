
import { useSupabaseClient, useUser } from "@supabase/auth-helpers-react"
import { supabaseClient } from "../../lib/supabaseClient";
import { useRouter } from "next/router"
import { createServerSupabaseClient } from "@supabase/auth-helpers-nextjs"
import { GetServerSidePropsContext, NextPage } from "next"
import { ChangeEvent, useEffect, useState } from "react"
import Header from '../../components/Header'


function EditPosts()  {

  const supabaseClient = useSupabaseClient()
  const user = useUser()
  const [uploading, setUploading] = useState(false)
  const router = useRouter()
  const [avatarUrl, setAvatarUrl] = useState()
  const initialState = {
    title: "",
    content: "",
    source_url: "",
    avatar_url: ""
  }
  const [postData, setPostData] = useState(initialState);

  const handleChange = (e:ChangeEvent<HTMLInputElement>) => {
    setPostData({ ...postData,[e.target.name] : e.target.value })
  }

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
              setPostData(data)
          }    
      }    
      if(typeof id !== "undefined") {
          getPost()
      }
  },[id])

  const editPost = async () => {
    try {
      const { data, error } = await supabaseClient
      .from("posts")
      .update([
          {
            title: postData.title,
            content: postData.content,
            source_url: postData.source_url,
            avatar_url:"puclic" + postData.avatar_url
            
          }
        ])
        .eq("id",id)
        if (error) throw error
        router.push('/post?id=' + id)
        setPostData(initialState)
    }catch(error: any) {
      alert(error.message)
    }
  }


  const handleUpload = async (e:ChangeEvent<HTMLInputElement>) => {
    let file;

    if(e.target.files) {
      file = e.target.files[0];
    }

    const { data, error } = await supabaseClient.storage
    .from("avatars")
    .upload('public' + file?.name, file as File)

    if(data) {
      console.log(data)
    }else if(error){
      console.log(error)
    }
  }

console.log(postData)
  return (
  <div> 
    <Header />
    <div className="relative flex h-screen  w-[calc(80%)] mx-auto  flex-col justify-center">
      <div className="my-6">
        <h1 className="text-2xl">Hey,{user?.email}, complete the form below to edit a post</h1>
      </div>
      <div  className="relative space-y-6 rounded bg-white shadow-md shadow-[#484747] py-10 px-6" >
        <h1 className="text-3xl my-9">Edit Post</h1>
        <div className="space-y-4">
          <label htmlFor="title" className="inline-block w-full">
            <input type="text"
              name="title"
              value={postData.title}
              placeholder="Post Title"
              className="w-[calc(90%)] border rounded shadow-md"
              onChange={handleChange} />
          </label>
          <label htmlFor="content" className="inline-block w-full">
            <input type="text"
              name="content"
              value={postData.content}
              placeholder="Content"
              className="w-[calc(90%)] h-24 border rounded shadow-md"
              onChange={handleChange}/>
          </label>         
          <label htmlFor="source" className="inline-block w-full">
            <input type="text"
              name="source_url"
              className="w-[calc(90%)]  border rounded shadow-md"
              onChange={handleChange}
              />
          </label>  
          <label htmlFor="avatar_url" className="inline-block w-full">
            <input type="file"
              accept="image/*"
              name="avatar_url"
              className="w-[calc(90%)]  border rounded shadow-md"
              onChange={(e) => {
                handleUpload(e),handleChange(e)
              }}
              />
          </label> 
        </div>

        <button className="w-36 h-9 rounded  bg-[#123b70] font-semibold" onClick={editPost}>
                edit
        </button>
      </div>
    </div>
  </div>  
  )
}



export default EditPosts
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

