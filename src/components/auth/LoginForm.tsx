import { FieldGroup, FieldLabel, FieldSet } from "@/components/ui/field"
import { Card } from "../ui/card"
import { Button } from "../ui/button"
import Divider from "../ui/Divider"
import useAuthAPI  from "@/hooks/useAuthAPI"
import { useState } from "react"
import { Alert, AlertTitle } from "../ui/alert"
import { BiError } from "react-icons/bi";
import SocialLogin from "./SocialLogin";
import IdentifierInput from "./Input/IdentifierInput"

type LoginPropsType = {
  identifier: string
  setIdentifier: React.Dispatch<React.SetStateAction<string>>
  setVerifyCode: React.Dispatch<React.SetStateAction<"form" | "otp">>
}

const LoginForm = ({identifier, setIdentifier, setVerifyCode}: LoginPropsType) => {
  const { passwordless, checkIfUserExists } = useAuthAPI();
  const [error, setError] = useState<string | null>('');
  const [loading, setLoading] = useState<boolean>(false);


  const onSubmit = async () => {
    setError(null)
    const trimmed = identifier.trim();
    
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

      setVerifyCode("otp");
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
          <IdentifierInput value={identifier} onChange={setIdentifier} setIdentifier={setIdentifier}/>
        </FieldGroup>
      </FieldSet>
      <Button variant="default" size="lg" onClick={onSubmit} disabled={loading}>
        {loading ? "Loading..." : "Submit"}
      </Button>
      <Divider 
        title='Other log in options'
      />
      <SocialLogin />

      <div className="flex justify-center">
        <span className="text-sm text-gray-500">Don't have an account? <a href="/signup" className="text-blue-500 hover:underline">Sign up</a></span>
      </div>
    </Card>
  )
}

export default LoginForm