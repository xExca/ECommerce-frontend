import React, { useState } from 'react'
import { Card } from '../ui/card'
import { FieldGroup, FieldSet } from '../ui/field'
import { Alert, AlertTitle } from '../ui/alert'
import { BiError } from 'react-icons/bi'
import { Button } from '../ui/button'
import Divider from '../ui/Divider'
import SocialLogin from './SocialLogin'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import InputPhone from './Input/InputPhone'
import axios from '@/api/axios'
import type { SignUpPayload } from '@/types/AuthTypes'

type SignUpFormProps = {
  setStep: React.Dispatch<React.SetStateAction<"form" | "otp">>
  payload: SignUpPayload
  setPayload: React.Dispatch<React.SetStateAction<SignUpPayload>>
}

const SignUpForm = ({setStep, payload, setPayload}: SignUpFormProps) => {
  const [error, setError] = useState<string | null>('');
  const [loading, setLoading] = useState<boolean>(false);
 

  const onSubmit = async () => {
    if(payload.firstname === '') {
      setError('Please enter your first name');
      return;
    }
    if(payload.lastname === '') {
      setError('Please enter your last name');
      return;
    }
    if(payload.email === '') {
      setError('Please enter your email address');
      return;
    }
    if(payload.phone === '') {
      setError('Please enter your phone number');
      return;
    }

    try {
      setError(null);
      setLoading(true);
      
      const res = await axios.post('/api/auth/signup', payload);

      console.log(res);

      setStep("otp");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }
  return (
    <Card className="p-6 w-full">
      <FieldSet>
        <span className="font-bold text-3xl">Sign up</span>
        <FieldGroup className="flex flex-col gap-3">
          {error && 
            <Alert variant={"error"}>
              <BiError size={20} className="text-white"/>
              <AlertTitle className="text-white">
                {error}
              </AlertTitle>
            </Alert>
          }
          <Label htmlFor="email">First Name</Label>
          <Input
            type="text"
            placeholder="John"
            name='firstname'
            value={payload.firstname}
            onChange={(e) => setPayload({...payload, firstname: e.target.value})}
          />
          <Label htmlFor="email">Last Name</Label>
          <Input
            type="text"
            placeholder="Doe"
            name='lastname'
            value={payload.lastname}
            onChange={(e) => setPayload({...payload, lastname: e.target.value})}
          />

          <Label htmlFor="email">Email Address</Label>
          <Input
            type="email"
            placeholder="email@example.com"
            name='email'
            value={payload.email}
            onChange={(e) => setPayload({...payload, email: e.target.value})}
          />
          <Label htmlFor="email">Phone</Label>
          <InputPhone value={payload.phone} onChange={(phone) => payload.phone = phone}/>
        </FieldGroup>
      </FieldSet>
      <Button variant="default" size="lg" onClick={onSubmit}>
        {loading ? "Loading..." : "Submit"}
      </Button>
      <Divider 
        title='Other Sign Up Options'
      />
      <SocialLogin />

      <div className="flex justify-center">
        <span className="text-sm text-gray-500">Already have an account? <a href="/login" className="text-blue-500 hover:underline">Log In</a></span>
      </div>
    </Card>
  )
}

export default SignUpForm