import { Icon } from "@iconify/react";
import { SidebarGroup } from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";

type SidebarItemProps = {
  to: string;
  icon: string;        // outline icon
  activeIcon: string;  // filled/hover icon
  label: string;
  groupName: string;   // used for hover classes (e.g., "dashboard", "user")
};

const SidebarItem = ({ to, icon, activeIcon, label, groupName }: SidebarItemProps) => {
  const navigate = useNavigate();

  return (
    <SidebarGroup
      className={`flex flex-row gap-3 items-center cursor-pointer group/${groupName}`}
      onClick={() => navigate(to)}
    >
      <div>
        <Icon
          icon={icon}
          className={`w-8 h-8 lg:w-10 lg:h-10 group-hover/${groupName}:hidden`}
          style={{ color: "#000" }}
        />

        <Icon
          icon={activeIcon}
          className={`w-8 h-8 lg:w-10 lg:h-10 hidden group-hover/${groupName}:block`}
          style={{ color: "#000" }}
        />
      </div>

      {/* Label */}
      <span className="text-sm font-semibold">{label}</span>
    </SidebarGroup>
  );
};

export default SidebarItem;
