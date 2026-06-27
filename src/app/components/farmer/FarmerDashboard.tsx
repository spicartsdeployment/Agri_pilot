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
    <div className="min-h-screen bg-background max-w-sm mx-auto relative">
      <div className="pb-20">
        {activeTab === "home" && <FarmerHome />}
        {activeTab === "history" && <FarmerHistory />}
        {activeTab === "about" && <FarmerAbout />}
        {activeTab === "settings" && <FarmerSettings onLogout={onLogout} />}
      </div>
      <BottomNav items={navItems} active={activeTab} onChange={setActiveTab} />
    </div>
  );
}
