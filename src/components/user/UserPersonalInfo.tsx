// src/components/user/UserProfileInfo.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputPhone from "@/components/auth/Input/InputPhone";
import { capitalize } from "@/lib/utils";
import type { Providers } from "@/types/AuthTypes";
import GoogleButton from "../auth/Button/GoogleButton";
import FacebookLogin, { type SuccessResponse } from "@greatsumini/react-facebook-login";
import FacebookButton from "../auth/Button/FacebookButton";
import axios from "@/api/axios";
import { useGoogleLogin } from "@react-oauth/google";
import Swal from "sweetalert2";
import type { UserPayload, ValidationError } from "@/page/UserPage";

type UserProfileInfoProps = {
  payload: UserPayload;
  currentRole: "user" | "admin" | null;
  providers? : Providers;
  setPayload: React.Dispatch<React.SetStateAction<UserPayload>>
  errors: ValidationError | null;
  handleSubmit: () => void
};

const UserProfileInfo = ({ payload, currentRole , providers, setPayload, errors, handleSubmit}: UserProfileInfoProps) => {
  const { firstname, lastname, email, phone, role } = payload;
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
      <form className="space-y-4 text-sm">
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label>First name</Label>
            <Input
              className="h-10"
              value={capitalize(firstname)}
              onChange={(e) =>
                setPayload((prev) => ({ ...prev, firstname: e.target.value }))
              }
            />
            {errors?.firstname && (
              <span className="text-xs text-red-500">{errors.firstname}</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label>Last name</Label>
            <Input
              className="h-10"
              value={capitalize(lastname)}
              onChange={(e) =>
                setPayload((prev) => ({ ...prev, lastname: e.target.value }))
              }
            />
            {errors?.lastname && (
              <span className="text-xs text-red-500">{errors.lastname}</span>
            )}
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-2">
            <Label>Email</Label>
            <Input
              className="h-10"
              value={email}
              onChange={(e) =>
                setPayload((prev) => ({ ...prev, email: e.target.value }))
              }
            />
            {errors?.email && (
              <span className="text-xs text-red-500">{errors.email}</span>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <Label>Phone</Label>
            <InputPhone
              value={phone}
              onChange={(e) =>
                setPayload((prev) => ({ ...prev, phone: e }))
              }
            />
            {errors?.phone && (
              <span className="text-xs text-red-500">{errors.phone}</span>
            )}
          </div>
        </div>

        {currentRole === "admin" && (
          <div className="flex flex-col gap-2">
            <Label htmlFor="accountType">Account type</Label>
            <select
              id="accountType"
              value={role!}
              onChange={(e) =>
                setPayload((prev) => ({ ...prev, role: e.target.value as "user" | "admin" }))
              }
              className="h-10 border border-input bg-background rounded-md px-3 text-sm"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            {errors?.role && (
              <span className="text-xs text-red-500">{errors.role}</span>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4 pt-2">
          <GoogleButton
            onClick={handleGoogleLink}
            fromUser
            isLink={!providers?.google}
          />

          <FacebookLogin
            appId={import.meta.env.VITE_FACEBOOK_APP_ID}
            onSuccess={handleFacebookLink}
            onFail={(error) => console.log("Login Failed!", error)}
            render={(renderProps) => (
              <FacebookButton
                onClick={renderProps.onClick ?? (() => {})}
                fromUser
                isLink={!providers?.facebook}
              />
            )}
          />
        </div>
      </form>
      <div className="flex justify-end pt-4">
        <Button onClick={handleSubmit}>
          Save changes
        </Button>
      </div>
    </>
  );
};

export default UserProfileInfo;
