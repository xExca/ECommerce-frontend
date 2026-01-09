import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { Icon } from "@iconify/react";
import { useAuth } from "@/context/AuthContext";
import SidebarItem from "./SidebarItem";
import { capitalize, capitalizeFirst, formatNameLastCommaFirstInitial } from "@/lib/utils";

const AdminSidebar = () => {
  const { user, logout } = useAuth();

  return (
    <Sidebar
      className="border-r h-full shadow-lg p-0"      
    >
      <SidebarHeader className="font-bold flex items-center">
        <span className="text-2xl">LOREM</span>
      </SidebarHeader>

      <SidebarContent className="flex flex-col gap-0 py-6">
        <SidebarItem
          to="/dashboard"
          icon="ri:dashboard-line"
          activeIcon="ri:dashboard-fill"
          label="Dashboard"
          groupName="dashboard"
        />

        <SidebarItem
          to="/user"
          icon="mdi:user-outline"
          activeIcon="mdi:user"
          label="User"
          groupName="user"
        />

      </SidebarContent>

      <SidebarFooter className="cursor-pointer">
        <div className="flex items-center justify-between w-full px-3 py-2">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-full overflow-hidden shrink-0">
              <img
                className="w-full h-full object-cover"
                src="https://avatars.githubusercontent.com/u/430361?v=4"
                alt={user ? `${user.firstname} ${user.lastname}` : "User avatar"}
              />
            </div>

            <div className="flex flex-col leading-tight min-w-0 max-w-[140px]">
              <span
                className="font-medium text-sm truncate"
                title={user ? capitalize(user.firstname + " " + user.lastname) : ""}
              >
                {user ? formatNameLastCommaFirstInitial(user.firstname, user.lastname) : "Loading..."}
              </span>

              <span
                className="text-xs text-gray-500 truncate"
                title={capitalizeFirst(user?.role || "")}
              >
                {capitalizeFirst(user?.role || "")}
              </span>
            </div>
          </div>

          {/* Logout icon */}
          <Icon
            icon="fe:logout"
            style={{ color: "#000" }}
            className="w-6 h-6 shrink-0"
            onClick={logout}
          />
        </div>
      </SidebarFooter>

    </Sidebar>
  );
};

export default AdminSidebar;
