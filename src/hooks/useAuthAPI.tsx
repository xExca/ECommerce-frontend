import type { CredentialResponse, TokenResponse } from "@react-oauth/google";
import axios from '@/api/axios';
import { useAuth } from "@/context/AuthContext";
import type { SuccessResponse } from "@greatsumini/react-facebook-login";

const useAuthAPI = () => {
  const { login } = useAuth();
  const passwordless =  async(email: string) => {
    const res = await axios.post("/api/auth/passwordless", {
      identifier: email
    });

    return res.data;
  };

  const handleGoogleLogin = async (tokenResponse: TokenResponse) => {
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

      const res = await axios.post("/api/auth/google", {
        profile: userInfo,
        token: tokenResponse.access_token,
      });

      if (!res.data.user || !res.data.accessToken) {
        console.log("Login failed");
        return;
      }

      const { user, accessToken } = res.data;

      login(user, accessToken);

      window.location.href = "/dashboard";
    } catch (error) {
      console.error("Google login error:", error);
    }
  };

  const handleFacebookLogin = async(response: SuccessResponse)=> {
    try {
      const accessToken = response.accessToken;
      
      if(!accessToken) {
        console.log("No access token from Facebook");
        return;
      }

      const res = await axios.post("/api/auth/facebook", {
        accessToken
      });

      if(!res.data.user || !res.data.accessToken) {
        console.log("Facebook Login failed");
        return;
      }

      const { user, accessToken: token } = res.data;

      login(user, token);

      window.location.href = "/dashboard";

    } catch (error) {
      console.error("Facebook login error", error);
    }

  }

  
  const checkIfUserExists = async (email: string) => {
    try {
      const response = await axios.post("/api/auth/check-user", { email });
      return !!response.data.exists;
    } catch (error) {
      console.error("Error checking user existence:", error);
      return false;
    }
  };

  return {
    handleGoogleLogin,
    handleFacebookLogin,
    passwordless,
    checkIfUserExists
  };
}

export default useAuthAPI;
