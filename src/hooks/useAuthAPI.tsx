import type { CredentialResponse } from "@react-oauth/google";
import axios from "axios";
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

      const res = await axios.post("http://localhost:8000/api/auth/google", {
        creds: response.credential,
        rememberMe,
      });

      if (!res.data?.user || !res.data?.token) {
        console.log("Login failed");
        return;
      }

      const { user, token } = res.data;

      login(user, token);

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
