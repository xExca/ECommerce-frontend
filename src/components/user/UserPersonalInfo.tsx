// src/components/user/UserProfileInfo.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import InputPhone from "@/components/auth/Input/InputPhone";
import { capitalize } from "@/lib/utils";
import type { AuthUser } from "@/types/AuthTypes";

type UserProfileInfoProps = {
  firstname: string;
  lastname: string;
  email: string;
  role?: string;
  phone: string;
  setPayload: React.Dispatch<React.SetStateAction<AuthUser>>
  handleSubmit: () => void
};

const UserProfileInfo = ({ firstname, lastname, email, role = "user", phone, setPayload, handleSubmit}: UserProfileInfoProps) => {
  return (
    <div className="px-6 pb-6 pt-2 md:px-12 md:pb-8">
      <div className="flex flex-col md:flex-row md:gap-10">
        {/* Left text */}
        <div className="md:w-1/3 mb-6 md:mb-0">
          <h2 className="text-base font-semibold text-slate-900">
            Personal Info
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            You can change your personal information settings here.
          </p>
        </div>

        <div className="md:w-2/3 h-88 space-y-4 rounded-xl border bg-slate-50/70 p-6 flex flex-col relative">
          <form className="flex flex-col gap-4">
          
            <div className="flex gap-4">
              <div className="flex flex-col w-full gap-2">
                <Label>First name</Label>
                <Input type="text" value={firstname} className="py-5.5" onChange={(e) => setPayload((prevState) => ({ ...prevState, firstname: e.target.value }))}/>
              </div>

              <div className="flex flex-col w-full gap-2">
                <Label>Last name</Label>
                <Input type="text" value={lastname} className="py-5.5" onChange={(e) => setPayload((prevState) => ({ ...prevState, lastname: e.target.value}))}/>
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

          </form>
          <div className="absolute bottom-4 right-4">
            <Button type="submit" onClick={handleSubmit}>Save changes</Button>
          </div>
        </div>



      </div>
    </div>
  );
};

export default UserProfileInfo;
