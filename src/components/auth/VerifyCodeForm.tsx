import { FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Card } from "../ui/card"
import { Button } from "../ui/button"
import React, { useState } from "react"
import axios from "@/api/axios"
import { useAuth } from "@/context/AuthContext";
import type { SignUpPayload } from "@/types/AuthTypes"

type VerifyCodeProps = {
  identifier?: string
  payload?: SignUpPayload
  setVerifyCode: React.Dispatch<React.SetStateAction<"form" | "otp">>
  from: "login" | "signup"
}

const VerifyCodeForm = ({identifier, payload, setVerifyCode, from} : VerifyCodeProps) => {
  const [otp, setOtp] = useState<number | null>(null);
  const { login } = useAuth();

  const handleLogin = async() =>{
    await axios.post('/api/auth/login/verify-otp', {
      identifier,
      code: otp
    }).then((res) => {
      if(res.status === 200) {
        if (!res.data.user || !res.data.accessToken) {
          console.log("Login failed");
          return;
        }

        const { user, accessToken } = res.data;
        login({
          _id: user._id, 
          email: user.email, 
          firstname: user.firstname, 
          lastname: user.lastname, 
          role: user.role, 
          phone: user.phone,
          picture: user.picture,
        }, 
          accessToken);

        window.location.href = "/dashboard";
      }
    }).catch((error) => {
      if(error.response.data.message === 'Invalid or expired code.'){
        alert('Invalid or expired code.');
        setVerifyCode('form');
      }
    });

  }

  const handleSignUp = async () => {
    const res = await axios.post('/api/auth/signup/verify-otp', {
      payload,
      code: otp
    })

    if(res.status === 200) {
      window.location.href = "/dashboard";
      if (!res.data.user || !res.data.accessToken) {
          console.log("Login failed");
          return;
        }
      const { user, accessToken } = res.data;

      login({
        _id: user._id, 
        email: user.email, 
        firstname: user.firstname, 
        lastname: user.lastname, 
        role: user.role, 
        phone: user.phone,
        picture: user.picture
      }, 
      accessToken);

      window.location.href = "/dashboard";
    }
    
  }

   return (
    <Card className="p-6 w-full">
      <form onSubmit={(e) => {
        e.preventDefault();
        from === "login" ? handleLogin() : handleSignUp()
      }}>
        <FieldSet>
          <div>Check your Email</div>
          <FieldGroup className="flex flex-col gap-2">
            <FieldLabel htmlFor="email" className='font-bold'>
              Verify OTP Code
            </FieldLabel>
            <Input type="number" id="OTP" value={otp ?? ''} className='py-5' placeholder="Enter the code here" onChange={(e)=> setOtp(parseInt(e.target.value))}/>

          </FieldGroup>
        </FieldSet>
        <Button variant="default" size="lg" onClick={()=> { from === "login" ? handleLogin() : handleSignUp() }} className="w-full mt-6">
          Log In
        </Button>
      </form>

    </Card>
  )
}

export default VerifyCodeForm