
import { useSupabaseClient, useUser } from '@supabase/auth-helpers-react'
import Router from 'next/router'
import { useState, useEffect, useRef } from 'react'
import Header from '../../components/Header'

const CreateProfileForm: React.FC = () => {
  const supabase = useSupabaseClient()
  const fileInput = useRef<HTMLInputElement>(null)
  const [username, setUsername] = useState('')
  const [lives, setLocation] = useState('')
  const [avatarUrl, setAvatarUrl] = useState('')
  const [from, setBirthplace] = useState('')
  const [studied_at, setStudy] = useState('')
  const user = useUser()
  const userid = user?.id

  const createProfile = async (username: string, lives:string, from:string, studied_at:string, avatarUrl: string) => {
    const file = fileInput.current?.files?.[0]
    if (file) {
      const {data, error} = await supabase.storage.from('avatars').upload("public" + file.name, file as File)
      try {
        const result =  await supabase.from('profiles').insert({ username, lives, from, studied_at, avatar_url: "public"+file.name, user_id: user?.id})
        Router.push("/profile")
        console.log(result)
      }catch(error: any) {
        console.log(error.message)
      }
    }  
      
  }

  return (
    <div>
        <Header />
        <div className='mt-24 relative text-white'>
          <form onSubmit={(e) => {
              e.preventDefault()
              createProfile(username, avatarUrl, lives, from, studied_at)
          }}>
            <div className='flex flex-col w-full md:w-2/6 mx-auto  space-y-4 mt-40 px-2 py-2 '>
               
              <input type="text" value={username} placeholder="Username" onChange={(e) => setUsername(e.target.value)} className="input-form" /> 

              <input type="text" value={lives} placeholder="Where do you live" onChange={(e) => setLocation(e.target.value)} className='input-form' /> 
              
              <input type="text" value={from} placeholder="Birth Place" onChange={(e) => setBirthplace(e.target.value)} className='input-form'/>
 
              <input type="text" value={studied_at} placeholder="Where did you sudy ? (optional) " onChange={(e) => setStudy(e.target.value)} className='input-form' />
              
              <button type="button" onClick={() => fileInput.current?.click()} className=' text-xl bg-green-700 w-40 py-2' >
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
              }}/>
              <button type="submit" className='px-2 py-2 text-xl bg-blue-700'>Create Profile</button>
            </div>
            
          </form>
        </div>
    </div>
  )
}

export default CreateProfileForm