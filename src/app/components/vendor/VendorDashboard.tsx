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
    <div className="vendor-theme min-h-screen w-full max-w-full overflow-x-hidden bg-background relative">
      <div className="pb-[calc(4.5rem+env(safe-area-inset-bottom))]">
        {activeTab === "home"     && <VendorHome />}
        {activeTab === "drones"   && <DroneModule />}
        {activeTab === "history"  && <VendorHistory />}
        {activeTab === "settings" && <VendorSettings onLogout={onLogout} />}
      </div>
      <BottomNav items={navItems} active={activeTab} onChange={setActiveTab} />
    </div>
  );
}
