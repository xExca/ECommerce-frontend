import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card } from "@/components/ui/card";
import UserProfileHeader from "@/components/user/UserProfileHeader";
import UserProfileInfo from "@/components/user/UserPersonalInfo";
import { type AuthUser, type Providers } from "@/types/AuthTypes";
import { capitalize } from "@/lib/utils";
import axios from "@/api/axios";
import UserInfoCard from "@/components/user/UserInfoCard";

const UserPage = () => {
  const { user, token, login } = useAuth();
  const [providers, setProviders] = useState<Providers | null>(null);

  const fullName = user ? `${capitalize(user.firstname)} ${capitalize(user.lastname)}` : "John Doe";
  const [payload, setPayload] = useState<AuthUser>({
    _id: user?._id ?? "",
    email: user?.email ?? "",
    firstname: user?.firstname ?? "",
    lastname: user?.lastname ?? "",
    phone: user?.phone ?? "",
    role: user?.role ?? null,
    picture: user?.picture ?? { croppedUrl: "", originalUrl: "" },
  });

  const getConnectAccount = async () => {
    try {
      const { data } = await axios.get(`/api/users/linkedAccount/${user?._id}`);
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

    } catch (error) {
      console.error(error);
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
            firstname={payload.firstname}
            lastname={payload.lastname}
            email={payload.email}
            role={payload.role ?? "user"}
            phone={payload.phone}
            providers={providers ?? {}}
            setPayload={setPayload}
            handleSubmit={handleSubmit}
          />
        </UserInfoCard>
      </Card>
    </div>
  );
};

export default UserPage;
