import { useUser, useSupabaseClient } from "@supabase/auth-helpers-react"
import { useRouter } from 'next/router'
import Link  from 'next/link'
import { AiOutlineHome, AiOutlinePlusCircle, AiOutlineFire, AiOutlineMenu } from "react-icons/ai"
import { BiGroup } from "react-icons/bi"
import { CgProfile } from "react-icons/cg"
import { Menu } from '@headlessui/react'



const Header = () => {

    const supabaseClient = useSupabaseClient()
    const user = useUser()
    const router = useRouter()

    function signOutUser() {
        supabaseClient.auth.signOut();
        router.push("/");
    }


    return (
        <div className="fixed top-0 z-50 flex w-full items-center justify-between shadow-md px-8  bg-black ">
            <div className="flex items-center space-x-4">
                <AiOutlineFire className="w-8 h-8 text-red-700"/>
                <h1 className="text-2xl text-red-700 shadow-lg font-mono md:text-3xl">FIRESPORTS</h1>    
            </div>
            <div className=" flex space-x-8 md:space-x-10">
                <div className="hidden md:flex">
                    <Link className="headerLink px-14 py-5 hover:bg-[#1b1a1a]" href={"/feed"}><AiOutlineHome className="h-10 w-10" /></Link>
                    <Link className="headerLink px-14 py-5 hover:bg-[#1b1a1a]" href={"/network"}><BiGroup  className="h-10 w-10"/></Link>
                    <Link className="headerLink px-14 py-5 hover:bg-[#1b1a1a]" href={"/create-post"}><AiOutlinePlusCircle className="h-10 w-10"/></Link>
                    <Link className="headerLink px-14 py-5 hover:bg-[#1b1a1a]" href={"/profile"}><CgProfile className="h-10 w-10"/></Link>
                </div>
                <div className="relative inline-block text-white md:hidden">
                    <Menu>
                        <Menu.Button><AiOutlineMenu className="h-6 w-6 text-white" /></Menu.Button>
                        <Menu.Items className="absolute grid right-4 mt-2 w-56 rounded-md px-4 py-4 bg-black/80 text-white  focus:outline-none">
                            <Menu.Item as="a">
                                <Link href={'/feed'} className='flex items-center space-x-4'>
                                    <AiOutlineHome className="h-8 w-8" />
                                    <p>Home</p>
                                </Link>
                            </Menu.Item>
                            <Menu.Item as="a" >
                                <Link href={'/network'} className="flex items-center space-x-4">
                                    <BiGroup  className="h-8 w-8"/>
                                    <p>Network</p>
                                </Link>
                            </Menu.Item>
                            <Menu.Item as="a">
                                <Link href={'/create-post'} className="flex items-center space-x-4">
                                    <AiOutlinePlusCircle className="h-8 w-8"/>
                                    <p>Create Post</p>
                                </Link>
                            </Menu.Item>
                            <Menu.Item as="a" href="/profile">
                                <Link href={'/profile'} className="flex items-center space-x-4">
                                    <CgProfile className="h-8 w-8"/>
                                    <p>Account</p>
                                </Link>
                            </Menu.Item>
                        </Menu.Items>
                    </Menu>
                </div>
            </div>
            <div className="flex ml-24">

                {!user ?

                (
                    <Link href={"/"} className="headerLink"><button>Login</button></Link>
                ) 
                :
                (
                    <button onClick={() => signOutUser()} className="headerLink">Sign Out</button>
                )
                }
            </div>
    

        </div>
      
       

     
       
      
    )
}

export default Header

