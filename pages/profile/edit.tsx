import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import Router from 'next/router'
import { useState, useEffect, useRef } from 'react'
import Header from '../../components/Header'
import SidebarNav from '../../components/SidebarNav'


const edit: React.FC = () => {
    const supabase = useSupabaseClient()
   
    const [avatarUrl, setAvatarUrl] = useState('')
    const fileInput = useRef<HTMLInputElement>(null)
    const user = useUser()
    const id = user?.id

    const initialState = {
        username: "",
        studied_at: "",
        lives: "",
        birthPlace: ""

    }

    const [profileData , setProfileData ] = useState(initialState)

    const handleChange = (e:any) => {
        setProfileData({ ...profileData, [e.target.name]: e.target.value })
    }

    useEffect(() => {
        async function fetchProfile()  {
            const {data: profile, error:errorFetchProfile} = await supabase
                .from("profiles")
                .select('*')
                .eq('user_id', id)
                .single()
            if (errorFetchProfile) {
                console.log(errorFetchProfile)
            } else {
                setProfileData(profile)
            }   
        }
        if(id !== "undefined") {
            fetchProfile()
        }
    },[id])

    const updateProfile = async () => {
        
        const file = fileInput.current?.files?.[0]
        if(file) {
            const {data, error} = await supabase.storage.from('avatars').upload("public" + file.name, file as File)
            const {data: updateAvatar, error:avatarError} = await supabase.from('profiles').update({ 'avatar_url': "public"+file.name }).eq('user_id', id)
        }     
        try {  
            const { data: updatedData, error:errorUpdate  } = await supabase
                .from('profiles')
                .update([
                    {
                        username: profileData.username,
                        studied_at: profileData.studied_at,
                        lives: profileData.lives,
                        birthPlace: profileData.birthPlace

                    }
                ])
                .eq('user_id', id)
            Router.push("/profile")
        } catch (errorUpdate: any) {
            console.log(errorUpdate.message)
        }
        
        
    }

 
   

    


  return (
    <div>
        <Header />
        <div className='relative w-full md:flex mt-20'>
            {/* <SidebarNav /> */}
            <div className='flex flex-col md:w-[calc(65%)] md:mx-auto'>
                <form  className=' text-white md:w-[calc(80%)] md:mt-8 md:mx-auto' key={user?.id} 
                    onSubmit={(e) => {
                    e.preventDefault()
                    updateProfile()
                    }}
                >
                    <h1 className='text-center text-2xl font-semibold my-4'>Edit Profile</h1>
                    <div className='flex flex-col w-3/6 mx-auto space-y-8'>
                        <input type="text" name='username'  defaultValue={profileData.username} onChange={handleChange} className='input-form' />
                        <input type="text" name='studied_at'  defaultValue={profileData.studied_at} onChange={handleChange} className='input-form' />
                        <input type="text" name='lives'  defaultValue={profileData.lives} onChange={handleChange} className='input-form' />
                        <input type="text" name='birthPlace'  defaultValue={profileData.birthPlace} onChange={handleChange} className='input-form' />
                        <button type='button' className='w-36 px-2 py-2 text-center bg-green-500 hover:bg-green-700' onClick={() => fileInput.current?.click()}>Update Image</button>
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
                    
                </form>
                <button type="submit" className='w-36 px-2 py-2 mx-auto my-8 text-center text-xl bg-blue-600 hover:bg-blue-700'>Update Profile</button>
            </div>
        </div>
    </div>
  )
}

export default edit