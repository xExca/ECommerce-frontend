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
}

const VerifyCodeForm = ({identifier, setVerifyCode} : VerifyCodeProps) => {
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

        login(user, accessToken);

        window.location.href = "/dashboard";
      }
    }).catch((error) => {
      if(error.response.data.message === 'Invalid or expired code.'){
        alert('Invalid or expired code.');
        setVerifyCode('form');
      }
    });

  }

   return (
    <Card className="p-6 w-full">
      <FieldSet>
        <div>Check your Email</div>
        <FieldGroup className="flex flex-col gap-2">
          <FieldLabel htmlFor="email" className='font-bold'>
            Verify OTP Code
          </FieldLabel>
          <Input type="number" id="OTP" value={otp ?? ''} className='py-5' placeholder="Enter the code here" onChange={(e)=> setOtp(parseInt(e.target.value))}/>

        </FieldGroup>
      </FieldSet>
      <Button variant="default" size="lg" onClick={()=> { handleLogin(); }}>
        Log In
      </Button>

    </Card>
  )
}

export default VerifyCodeForm