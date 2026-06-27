import { useState } from "react";
import { Home, Cpu, History, Settings } from "lucide-react";
import { BottomNav } from "../shared/BottomNav";
import { VendorHome } from "./VendorHome";
import { DroneModule } from "./DroneModule";
import { VendorHistory } from "./VendorHistory";
import { VendorSettings } from "./VendorSettings";

interface VendorDashboardProps {
  onLogout: () => void;
}

const navItems = [
  { id: "home",     label: "Home",     icon: Home },
  { id: "drones",   label: "Drones",   icon: Cpu },
  { id: "history",  label: "History",  icon: History },
  { id: "settings", label: "Settings", icon: Settings },
];

export function VendorDashboard({ onLogout }: VendorDashboardProps) {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="vendor-theme min-h-screen bg-background max-w-sm mx-auto relative">
      <div className="pb-20">
        {activeTab === "home"     && <VendorHome />}
        {activeTab === "drones"   && <DroneModule />}
        {activeTab === "history"  && <VendorHistory />}
        {activeTab === "settings" && <VendorSettings onLogout={onLogout} />}
      </div>
      <BottomNav items={navItems} active={activeTab} onChange={setActiveTab} />
    </div>
  );
}
