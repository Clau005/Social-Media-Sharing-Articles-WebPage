
import { useState } from "react";
import type { NextPage } from "next";
import { supabaseClient } from "../lib/supabaseClient";
import { useRouter } from "next/router";
import { useUser } from "@supabase/auth-helpers-react";



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
       router.push("/feed")
    }   

    return (
        <div >
   
            
        </div>
    )


}





{/* <h1 className="">Sign In</h1>
<div className="text-center mx-auto">
    <label>
    <input 
    type="email" 
    value={email}
    placeholder="Email Address" 
    className="input"
    onChange={(e) => setEmail(e.target.value)}
    />
 
    </label>
    </div>
    
    <button  onClick={(e) => {
      e.preventDefault();
      handleLogin(email);  
    }}
    className="w-full rounded py-4 bg-[#e50914] font-semibold"
    >
         Send magic link
    </button>
     */}