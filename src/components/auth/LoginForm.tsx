import { FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google'
import FacebookLogin, { type SuccessResponse } from "@greatsumini/react-facebook-login";
import { Card } from "../ui/card"
import { Button } from "../ui/button"
import Divider from "../ui/Divider"
import useAuthAPI  from "@/hooks/useAuthAPI"
import { useState } from "react"
import { Alert, AlertTitle } from "../ui/alert"
import { BiError } from "react-icons/bi";

type LoginPropsType = {
  email: string
  setEmail: React.Dispatch<React.SetStateAction<string>>
  setVerifyCode: React.Dispatch<React.SetStateAction<boolean>>
}

const LoginForm = ({email, setEmail, setVerifyCode}: LoginPropsType) => {
  const { handleGoogleLogin, handleFacebookLogin, passwordless, checkIfUserExists } = useAuthAPI();
  const [error, setError] = useState<string | null>('');
  const [loading, setLoading] = useState<boolean>(false);


  const onSubmit = async () => {
    setError(null)
    const trimmed = email.trim();
    
    if(!trimmed) {
      setError("Please enter a valid email or phone number");
      return;
    }

    try{
      setLoading(true);
      
      const userExists = await checkIfUserExists(trimmed);

      if(!userExists) {
        setError("User does not exist");
        return;
      }
      
      await passwordless(trimmed);

      setVerifyCode(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="p-6 w-full">
      <FieldSet>
        <span className="font-bold text-3xl">Log In</span>
        <FieldGroup className="flex flex-col gap-2">
          {error && 
            <Alert variant={"error"}>
              <BiError size={20} className="text-white"/>
              <AlertTitle className="text-white">
                {error}
              </AlertTitle>
            </Alert>
          }
          <FieldLabel htmlFor="email" className='font-bold'>
            Email Address or Phone Number
          </FieldLabel>
          <Input type="text" id="email" className='py-5' placeholder="email@example.com or +63 912 345 6789" 
            onChange={(e) => setEmail(e.target.value)}
          />
        </FieldGroup>
      </FieldSet>
      <Button variant="default" size="lg" onClick={onSubmit} disabled={loading}>
        {loading ? "Loading..." : "Submit"}
      </Button>
      <Divider 
        title='OR'
      />
      <div className="flex justify-center gap-1">
        <GoogleLogin 
          onSuccess={(credentialResponse: CredentialResponse) => handleGoogleLogin(credentialResponse)}
          onError={() => console.log('Login Failed')}
        />
        <FacebookLogin 
          appId={import.meta.env.VITE_FACEBOOK_APP_ID}
          onSuccess={(response: SuccessResponse ) => handleFacebookLogin(response)}
          onFail={(error) => console.log('Login Failed!', error)}
        />
        
      </div>
    </Card>
  )
}

export default LoginForm