import type { CredentialResponse } from "@react-oauth/google";
import axios from '@/api/axios';
import { useAuth } from "@/context/AuthContext";

const useAuthAPI = () => {
  const { login } = useAuth();
  const handleLogin = () => {
    return "The users is logged in";
  };

  const handleGoogleLogin = async (response: CredentialResponse, rememberMe: boolean) => {
    try {
      if (!response.credential) {
        console.log("No credential from Google");
        return;
      }

      const res = await axios.post("/api/auth/google", {
        creds: response.credential,
        rememberMe,
      });

      if (!res.data?.user || !res.data?.accessToken) {
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

  return {
    handleGoogleLogin,
    handleLogin,
  };
}

export default useAuthAPI;
