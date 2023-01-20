
import { useState } from "react";
import type { NextPage } from "next";
import { supabaseClient } from "../lib/supabaseClient";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";
import Link from "next/link";



export default function login() {
    const user = useUser();
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    
    const handleLogin = async (email: string) => {
      try {
        setLoading(true);
        const { error } = await supabaseClient.auth.signInWithOtp({ email });
        if (error) throw error;
        alert("Check your email for the login link!");
      } catch (error: any) {
        alert(error.error_description || error.message);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
       router.push("/create-profile")
    }   

    return (

        <div className="h-screen w-[calc(80%)] mx-auto mt-[12rem] space-y-8 md:flex md:items-center md:justify-center md:space-x-4 md:mt-0 md:w-[calc(90%)]">
            {/* <div className="space-y-3 text-left">
                <h2 className="text-2xl font-semibold md:text-4xl"><span className="text-blue-700">Welcome</span> to our WebPage</h2>
                <p className="text-base font-semibold md:text-xl">Let's connect you to other people and share similar interests with eachother</p>
                <p className="text-base  font-semibold md:text-xl">Just Sign Up today by simply enter your email and we'll send you a magic link to log in</p>
            </div> */}
            <div className="border shadow-lg hover:shadow-2xl  text-center space-y-6 py-10 px-4 bg-white md:py-24 md:px-20 md:mx-8">
                <h1 className="text-2xl mb-3 md:text-4xl md:py-8 md:font-semibold">Sign Up</h1>
                <label className="rounded-sm border shadow-md mt-6">
                <input 
                type="email" 
                value={email}
                placeholder="Email Address" 
                className="border px-2 py-2 md:w-[22rem] md:h-10 md:text-lg"
                onChange={(e) => setEmail(e.target.value)}
                />
             
                </label>
            
                <div className="w-full text-center">
                  <button  onClick={(e) => {
                    e.preventDefault();
                    handleLogin(email);  
                    }}
                    className=" rounded-lg hover:shadow-lg text-white border text-base font-semibold bg-blue-500 px-2 py-2 md:text-xl md:px-4 md:h-14" 
                    >
                     Send magic link
                  </button>

                </div>
                <div>
                   <p className="text-base">Already have an account? <Link href={"/"} className="text-blue-700 font-semibold">Log in to your account</Link></p>
                </div>
                
            </div>  
            
        </div> 












     
    )


}




  