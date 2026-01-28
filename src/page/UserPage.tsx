import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import UserProfileHeader from "@/components/user/UserProfileHeader";
import UserProfileInfo from "@/components/user/UserPersonalInfo";
import { type AuthUser, type Providers } from "@/types/AuthTypes";
import { capitalize } from "@/lib/utils";
import axios from "@/api/axios";
import UserInfoCard from "@/components/user/UserInfoCard";

export  interface UserPayload {
  email: string;
  firstname: string;
  lastname: string;
  phone: string;
  role: "user" | "admin" | null;
}
export interface ValidationError {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  role?: string;
}
const UserPage = () => {
  const { user, token, login } = useAuth();
  const [providers, setProviders] = useState<Providers | null>(null);
  const [ errors, setErrors ] = useState<ValidationError | null>();

  const fullName = user ? `${capitalize(user.firstname)} ${capitalize(user.lastname)}` : "John Doe";
  const [payload, setPayload] = useState<UserPayload>({
    email: user?.email ?? "",
    firstname: user?.firstname ?? "",
    lastname: user?.lastname ?? "",
    phone: user?.phone ?? "",
    role: user?.role ?? null,
  });
  const currentRole = user?.role ?? "user";

  const getConnectAccount = async () => {
    try {
      const { data } = await axios.get(`/api/users/linked/${user?._id}`);
      setProviders(data ?? null);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getConnectAccount();
  }, []);


  const handleSubmit = async () => {
    try {
      const { data } = await axios.post(`/api/users/update/${user?._id}`, payload);

      const updatedUser = data.user as AuthUser;
      const newToken = data.accessToken as string | null;

      login(updatedUser, newToken ?? token!);

      setPayload(updatedUser);

    } catch (error:any) {
      console.error(error);
      if (error.response.data.validation === false) {
        setErrors(error.response.data.errors);
      }
    }
  };

  return (
    <div>
      <Card className="overflow-hidden rounded-3xl border shadow-sm p-0">
        <UserProfileHeader 
          fullName={fullName} 
          email={user?.email ?? ""} 
          croppedUrl={user?.picture?.croppedUrl ?? ""}
          originalUrl={user?.picture?.originalUrl ?? ""} 
          userId={user?._id ?? ""}
        />

        <UserInfoCard title="Personal Information" description="You can change your personal information settings here.">
          <UserProfileInfo
            payload={payload}
            currentRole={currentRole}
            providers={providers ?? {}}
            setPayload={setPayload}
            errors={errors || null}
            handleSubmit={handleSubmit}
          />
        </UserInfoCard>
      </Card>
    </div>
  );
};

export default UserPage;
