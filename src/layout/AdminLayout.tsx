import {
  SidebarProvider,
  useSidebar,
} from "@/components/ui/sidebar";
import { Outlet } from "react-router-dom";
import { Icon } from "@iconify/react";
import AdminSidebar from "@/components/auth/ui/AdminSidebar";

function MobileHeader() {
  const { openMobile, setOpenMobile } = useSidebar();

  return (
    <header className="flex items-center gap-3 border-b bg-[#f5f5f5] px-4 py-3 md:hidden">
      <button
        onClick={() => setOpenMobile(!openMobile)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-md border bg-white shadow-sm"
      >
        <Icon
          icon={openMobile ? "mdi:close" : "mdi:menu"}
          className="h-5 w-5"
        />
      </button>
      <span className="font-semibold text-sm">Dashboard</span>
    </header>
  );
}

const AdminLayout = () => {
  return (
      <div className="h-screen bg-[#f5f5f5] flex">
        <SidebarProvider>
            <AdminSidebar />

            {/* Right side */}
            <div className="flex flex-1 flex-col">
              <MobileHeader />

              <main className="flex-1 h-full overflow-auto p-6 md:p-12">
                <Outlet />
              </main>
            </div>
        </SidebarProvider>
      </div>
  );
};

export default AdminLayout;
