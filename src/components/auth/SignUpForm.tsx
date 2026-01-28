import React, { useState } from 'react'
import { Card } from '../ui/card'
import { FieldGroup, FieldSet } from '../ui/field'
import { Alert, AlertTitle } from '../ui/alert'
import { Button } from '../ui/button'
import Divider from '../ui/Divider'
import SocialLogin from './SocialLogin'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import InputPhone from './Input/InputPhone'
import axios from '@/api/axios'
import { AxiosError } from 'axios'
import type { SignUpPayload } from '@/types/AuthTypes'
import { Icon } from '@iconify/react'

type SignUpFormProps = {
  setStep: React.Dispatch<React.SetStateAction<"form" | "otp">>
  payload: SignUpPayload
  setPayload: React.Dispatch<React.SetStateAction<SignUpPayload>>
}

const SignUpForm = ({setStep, payload, setPayload}: SignUpFormProps) => {
  const [error, setError] = useState<string | null>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [isEmailIdentifier, setIsEmailIdentifier] = useState<boolean>(true);
  const handleChangeIdentifier = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPayload({...payload, identifier: e.target.value});
  }
  const validateEmail = (email: string) => {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    return true;
  }
  const onSubmit = async () => {
    if(payload.firstname === '') {
      setError('Please enter your first name');
      return;
    }
    if(payload.lastname === '') {
      setError('Please enter your last name');
      return;
    }
    if(!validateEmail(payload.identifier)) {
      return;
    }

    try {
      setError(null);
      setLoading(true);
      
      const res = await axios.post('/api/auth/signup', payload);

      setStep("otp");
    } catch (error) {
      if(error instanceof AxiosError) {
        if(error.status === 400) {
          setError(error.response?.data.message);
        }
      } else {
        console.log(error);
      }
      

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
              <Icon icon="si:error-fill" width="24" height="24"  style={{color: '#000'}} />
              <AlertTitle className="text-white">
                {error}
              </AlertTitle>
            </Alert>
          }
          <Label htmlFor="email">First Name</Label>
          <Input
            className='py-5'
            type="text"
            placeholder="John"
            name='firstname'
            value={payload.firstname}
            required
            onChange={(e) => setPayload({...payload, firstname: e.target.value})}
          />
          <Label htmlFor="email">Last Name</Label>
          <Input
            className='py-5'
            type="text"
            placeholder="Doe"
            name='lastname'
            value={payload.lastname}
            required
            onChange={(e) => setPayload({...payload, lastname: e.target.value})}
          />

         <div className='space-y-3'>
            <div className='flex w-full justify-between'>
              <Label htmlFor="email">{isEmailIdentifier ? "Email" : "Phone"}</Label>
              <button
                type="button"
                onClick={()=> {
                  setIsEmailIdentifier(!isEmailIdentifier)
                  payload.identifier = '';
                }}
                className="text-xs text-blue-500 hover:underline cursor-pointer"
              >
                {isEmailIdentifier ? "Use Phone" : "Use Email"}
              </button>
            </div>
            {isEmailIdentifier ? (
              <>
                <Input
                  className='py-[21.5px] my-px'
                  type="email"
                  placeholder="email@example.com"
                  name='email'
                  value={payload.identifier}
                  required
                  onChange={handleChangeIdentifier}
                />
              </>
            ) : (
              <>
                <InputPhone value={payload.identifier} onChange={(identifier) => payload.identifier = identifier} required={true}/>
              </>
            )}
         </div>
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