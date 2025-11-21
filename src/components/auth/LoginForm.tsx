import {
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'
import { Card } from "../ui/card"
import { Button } from "../ui/button"
import Divider from "../ui/Divider"
import useAuthAPI  from "@/hooks/useAuthAPI"
import { Checkbox } from "../ui/Checkbox"
import { useState } from "react"

const LoginForm = () => {
  const { handleGoogleLogin } = useAuthAPI();
  const [isRemembered, setIsRemembered] = useState(false);
  return (
    <Card className="p-6 w-[20vw]">
      <FieldSet>
        <div>Log In</div>
        <FieldGroup className="flex flex-col gap-2">
          <FieldLabel htmlFor="email" className='font-bold'>
            Email Address or Phone Number
          </FieldLabel>
          <Input type="text" id="email" className='py-5' placeholder="email@example.com or +63 912 345 6789"
          />
          <div className="flex items-center gap-2">
            <Checkbox
              label="Remember me"
              className="mt-4"
              checked={isRemembered}
              onChange={setIsRemembered}
            />
          </div>

        </FieldGroup>
      </FieldSet>
      <Button variant="default" size="lg">
        Submit
      </Button>
      <Divider 
        title='OR'
      />
      <div className="flex justify-center gap-1">
        <GoogleLogin 
          onSuccess={(credentialResponse: CredentialResponse) => handleGoogleLogin(credentialResponse, isRemembered)}
          onError={() => console.log('Login Failed')}
        />
      </div>

    </Card>
  )
}

export default LoginForm