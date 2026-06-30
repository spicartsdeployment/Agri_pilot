import { useState } from "react";
import { Home, Cpu, Briefcase, CalendarCheck, Settings } from "lucide-react";
import { BottomNav } from "../shared/BottomNav";
import { PilotHome } from "./PilotHome";
import { PilotDrone } from "./PilotDrone";
import { PilotActiveJobs } from "./PilotActiveJobs";
import { PilotGig } from "./PilotGig";
import { PilotSettings } from "./PilotSettings";

interface PilotDashboardProps {
  onLogout: () => void;
}

const navItems = [
  { id: "home",       label: "Home",       icon: Home },
  { id: "drone",      label: "Drone",      icon: Cpu },
  { id: "activejobs", label: "Active Jobs", icon: Briefcase },
  { id: "gig",        label: "Available",  icon: CalendarCheck },
  { id: "settings",   label: "Settings",   icon: Settings },
];

export function PilotDashboard({ onLogout }: PilotDashboardProps) {
  const [activeTab, setActiveTab] = useState("home");

  return (
    <div className="pilot-theme min-h-screen w-full max-w-full overflow-x-hidden bg-background relative">
      <div className="pb-[calc(4.5rem+env(safe-area-inset-bottom))]">
        {activeTab === "home"       && <PilotHome onGoToSettings={() => setActiveTab("settings")} />}
        {activeTab === "drone"      && <PilotDrone />}
        {activeTab === "activejobs" && <PilotActiveJobs />}
        {activeTab === "gig"        && <PilotGig />}
        {activeTab === "settings"   && <PilotSettings onLogout={onLogout} />}
      </div>
      <BottomNav items={navItems} active={activeTab} onChange={setActiveTab} />
    </div>
  );
}
