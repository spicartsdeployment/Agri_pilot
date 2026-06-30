import { useState } from "react";
import { Home, History, Info, Settings, Bell } from "lucide-react";
import { BottomNav } from "../shared/BottomNav";
import { FarmerHome } from "./FarmerHome";
import { FarmerHistory } from "./FarmerHistory";
import { FarmerAbout } from "./FarmerAbout";
import { FarmerSettings } from "./FarmerSettings";

interface FarmerDashboardProps {
  onLogout: () => void;
}

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "history", label: "History", icon: History },
  { id: "about", label: "About", icon: Info },
  { id: "settings", label: "Settings", icon: Settings },
];

export function FarmerDashboard({ onLogout }: FarmerDashboardProps) {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-background relative">
      <div className="pb-[calc(4.5rem+env(safe-area-inset-bottom))]">
        {activeTab === "home" && <FarmerHome />}
        {activeTab === "history" && <FarmerHistory />}
        {activeTab === "about" && <FarmerAbout />}
        {activeTab === "settings" && <FarmerSettings onLogout={onLogout} />}
      </div>
      <BottomNav items={navItems} active={activeTab} onChange={setActiveTab} />
    </div>
  );
}
