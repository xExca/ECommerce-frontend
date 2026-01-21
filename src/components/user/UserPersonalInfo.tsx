// src/components/user/UserProfileInfo.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputPhone from "@/components/auth/Input/InputPhone";
import { capitalize } from "@/lib/utils";
import type { AuthUser, Providers } from "@/types/AuthTypes";
import GoogleButton from "../auth/Button/GoogleButton";
import FacebookLogin, { type SuccessResponse } from "@greatsumini/react-facebook-login";
import FacebookButton from "../auth/Button/FacebookButton";
import axios from "@/api/axios";
import { useGoogleLogin } from "@react-oauth/google";
import Swal from "sweetalert2";

type UserProfileInfoProps = {
  firstname: string;
  lastname: string;
  email: string;
  role?: string;
  phone: string;
  providers? : Providers;
  setPayload: React.Dispatch<React.SetStateAction<AuthUser>>
  handleSubmit: () => void
};

const UserProfileInfo = ({ firstname, lastname, email, role = "user", phone, providers, setPayload, handleSubmit}: UserProfileInfoProps) => {
  const handleGoogleLink = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        if (!tokenResponse.access_token) {
          console.log("No access token from Google");
          return;
        }

        const userInfo = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        ).then((res) => res.json());

        const response = await axios.post("/api/auth/google/link", {
          profile: userInfo,
          token: tokenResponse.access_token,
          email: email
        });

        if (response.data.status == 200) {
          if (response.data.message === "Google account linked successfully.") {
            Swal.fire({
              icon: "success",
              title: "Google account linked successfully.",
              showConfirmButton: true
            });
          }
        }
      } catch (error) {
        console.error("Google link error:", error);
      }
    }
  })

  const handleFacebookLink = async (response: SuccessResponse) => {
    try { 
      const accessToken = response.accessToken;

      if (!accessToken) {
        console.log("No access token from Facebook");
        return;
      }

      const res = await axios.post("/api/auth/facebook/link", {
        accessToken,
      });

      if (res.data.status == 200) {
        if (res.data.message === "Google account linked successfully.") {
          Swal.fire({
            icon: "success",
            title: "Google account linked successfully.",
            showConfirmButton: true
          });
        }
      }
    } catch (error) {
      console.error("Facebook link error:", error);
    }
  }
  return (
    <>
      <form className="flex flex-col gap-4">
      
        <div className="flex gap-4">
          <div className="flex flex-col w-full gap-2">
            <Label>First name</Label>
            <Input type="text" value={capitalize(firstname)} className="py-5.5" onChange={(e) => setPayload((prevState) => ({ ...prevState, firstname: e.target.value }))}/>
          </div>

          <div className="flex flex-col w-full gap-2">
            <Label>Last name</Label>
            <Input type="text" value={capitalize(lastname)} className="py-5.5" onChange={(e) => setPayload((prevState) => ({ ...prevState, lastname: e.target.value}))}/>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="flex flex-col w-full gap-2">
            <Label>Email</Label>
            <Input type="text" value={email} className="py-5.5" onChange={(e) => setPayload((prevState) => ({ ...prevState, email: e.target.value}))} />
          </div>

          <div className="flex flex-col w-full gap-2">
            <Label>Phone</Label>
            <InputPhone value={phone} onChange={(e) => setPayload((prevState) => ({ ...prevState, phone: e }))} />
          </div>
        </div>
        <div className="flex gap-4">
          {role === "admin" &&
            <div className="space-y-2">
              <Label htmlFor="accountType">Account type</Label>
              <select
                id="accountType"
                defaultValue={role}
                className="border border-input bg-background rounded-md px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
          }
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col w-full gap-2">
            <GoogleButton onClick={handleGoogleLink} fromUser isLink={providers?.google !== undefined || null ? false : true} />
          </div>

          <div className="flex flex-col w-full gap-2">
            <FacebookLogin
              appId={import.meta.env.VITE_FACEBOOK_APP_ID}
              onSuccess={(response: SuccessResponse ) => handleFacebookLink(response)}
              onFail={(error) => console.log('Login Failed!', error)}
              render={(renderProps) => (
                <FacebookButton
                  onClick={renderProps.onClick ?? (() => {})}
                  fromUser
                  isLink={providers?.facebook !== undefined || null ? false : true}
                />
              )}
            />
          </div>
        </div>

      </form>
      <div className="absolute bottom-4 right-4">
        <Button type="submit" onClick={handleSubmit}>Save changes</Button>
      </div>
    </>
  );
};

export default UserProfileInfo;
