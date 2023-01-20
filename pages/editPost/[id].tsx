import { useRouter } from "next/router"
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import {useState, useEffect, useRef} from "react"
import Header from "../../components/Header"


export default function edit() {
    const router = useRouter()
    const {id} = router.query
    const supabase = useSupabaseClient()
    const [avatarUrl, setAvatarUrl] = useState('')
    const fileInput = useRef<HTMLInputElement>(null)

    const initialState = {
        title: "",
        content:""
    }

    const [postData, setPostData] = useState(initialState)

    const handleChange = (e:any) => {
        setPostData({ ...postData, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        async function fetchPosts() {
            const {data: post , error: errorfetchPosts} = await supabase
                .from('posts')
                .select('*')
                .eq('id', id)
                .single()
            if(errorfetchPosts){
                console.log(errorfetchPosts)
            } else {
                setPostData(post)
            }
        }
        if(id !== "undefined") {
            fetchPosts()
        }
    },[id])


    const updatePost = async () => {
        const file = fileInput.current?.files?.[0]
        if(file){
            const{ data: uploadImage, error:errorUploadImage } = await supabase.storage.from('posts').upload("public" + file.name, file as File)
            const { data:updateImageRow, error:errorupdateImage } = await supabase.from('posts').update({'avatar_url': "public"+file.name}).eq('id', id)
        }
        try {
            const {data: updatedPost, error: errorupdatePost} = await supabase
                .from('posts')
                .update([
                    {
                        title: postData.title,
                        content: postData.content
                    }
                ])
                .eq('id', id)
            router.push('/feed')    
        }catch(errorupdatePost: any) {
            console.log(errorupdatePost.message)
        }
    }


    return(
        <div>
            <Header />
            <div className="relative mt-24 text-white">
                <div className="w-full">
                    <h1 className="text-center text-2xl font-semibold my-4">Edit Post</h1>
                    <form
                        className="w-full md:w-[calc(40%)] md:mx-auto"  
                        onSubmit={(e) => {
                        e.preventDefault()
                        updatePost()

                    
                    }}>
                        <div className="flex flex-col space-y-12 my-4">
                            <div className="flex flex-col">
                                <label htmlFor="title" className="text-left text-xl">Set up a new title</label>
                                <input type="text" name="title" defaultValue={postData.title} className="input-form" onChange={handleChange} />
                            </div>
                            
                            <div className="flex flex-col">
                                <label htmlFor="content" className="text-left text-xl">Write somthing about this post</label>
                                <textarea  name="content" defaultValue={postData.content}  rows={5} className="input-form" onChange={handleChange} ></textarea>
                            </div>
                            <button type='button' onClick={() => fileInput.current?.click()} className='w-2/6 text-xl bg-green-700 mt-4 px-2 py-2'>Update Image</button>
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
                        </div>
                        <button type="submit" className=' w-2/6 px-2 py-2 text-xl  bg-blue-700 hover:shadow-md hover:bg-blue-800 my-8'>Update Post</button>
                    </form>
                </div>
            </div>
        </div>
    )
}