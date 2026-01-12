import { FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Card } from "../ui/card"
import { Button } from "../ui/button"
import React, { useEffect, useState } from "react"
import axios from "@/api/axios"
import { useAuth } from "@/context/AuthContext";
import type { SignUpPayload } from "@/types/AuthTypes"

type VerifyCodeProps = {
  identifier?: string
  payload?: SignUpPayload
  setVerifyCode: React.Dispatch<React.SetStateAction<"form" | "otp">>
  from: "login" | "signup"
  resetLoginFlow?: () => void
}

const VerifyCodeForm = ({identifier, payload, setVerifyCode, from, resetLoginFlow} : VerifyCodeProps) => {
  const [ isResending, setIsResending ] = useState<boolean>(false);
  const [ cooldown, setCooldown ]= useState(0);
  const [otp, setOtp] = useState<number | null>(null);
  const { login } = useAuth();

  useEffect(() => {
    if (cooldown <= 0) {
      sessionStorage.removeItem("otp_cooldown");
      sessionStorage.removeItem("otp_cooldown_ts");
      return;
    }

    const timer = setInterval(() => {
      setCooldown(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    const savedCooldown = sessionStorage.getItem("otp_cooldown");
    const savedTimestamp = sessionStorage.getItem("otp_cooldown_ts");

    if (savedCooldown && savedTimestamp) {
      const elapsed = Math.floor(
        (Date.now() - Number(savedTimestamp)) / 1000
      );

      const remaining = Number(savedCooldown) - elapsed;

      if (remaining > 0) {
        setCooldown(remaining);
      } else {
        sessionStorage.removeItem("otp_cooldown");
        sessionStorage.removeItem("otp_cooldown_ts");
      }
    }
  }, []);

  const handleResend = async () => {
    if (cooldown > 0) return;

    setCooldown(60);
    sessionStorage.setItem("otp_cooldown", "60");
    sessionStorage.setItem("otp_cooldown_ts", Date.now().toString());

    try {
      await axios.get(`/api/auth/resend-otp/${identifier}`);
    } catch (error) {
      console.error(error);
      setCooldown(0);
      sessionStorage.removeItem("otp_cooldown");
      sessionStorage.removeItem("otp_cooldown_ts");
    }
  };

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
        sessionStorage.removeItem("login_step");
        sessionStorage.removeItem("login_identifier");
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
        sessionStorage.removeItem("login_step");
        sessionStorage.removeItem("login_identifier");
        setVerifyCode('form');
      }
    })

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
          <div className="text-2xl font-bold">Check your Email</div>
          <div className="text-sm text-gray-800">We've sent a code to your email address at <span className="text-red-500">{identifier}</span></div>
          <FieldGroup className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="email" className='font-bold'>
                Verify OTP Code
              </FieldLabel>
              <button type="button" className="text-xs text-blue-500 hover:underline items-start cursor-pointer" onClick={resetLoginFlow}>
                Change Email
              </button>
              </div>
            <Input type="number" id="OTP" value={otp ?? ''} className='py-5' placeholder="Enter the code here" onChange={(e)=> setOtp(parseInt(e.target.value))}/>
            <div className="">
              <button type="button" className="text-xs text-blue-500 hover:underline disabled:text-gray-400 disabled:cursor-not-allowed" onClick={handleResend} disabled={cooldown > 0}>
                Resend code {cooldown > 0 && `in ${cooldown}s`}
              </button>
            </div>

          </FieldGroup>
        </FieldSet>
        <Button variant="default" size="lg" className="w-full mt-6">
          Log In
        </Button>
      </form>

    </Card>
  )
}

export default VerifyCodeForm