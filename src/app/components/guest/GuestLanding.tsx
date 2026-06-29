import { useState, useCallback } from "react";
import { Home, Layers, Plane, Info } from "lucide-react";
import { BottomNav } from "../shared/BottomNav";
import { GuestTopBar } from "./GuestTopBar";
import { GuestFooter } from "./GuestFooter";
import { GuestHome } from "./GuestHome";
import { GuestServices } from "./GuestServices";
import { GuestDrones } from "./GuestDrones";
import { GuestAbout } from "./GuestAbout";
import { GuestLogin } from "./GuestLogin";

type GuestTab = "home" | "services" | "drones" | "about";
type AuthIntent = "farmer" | "pilot" | null;

interface GuestLandingProps {
  onLogin: (role: "farmer" | "pilot" | "vendor") => void;
  onSignUp: (role?: "farmer" | "pilot") => void;
}

const navItems = [
  { id: "home", label: "Home", icon: Home },
  { id: "services", label: "Services", icon: Layers },
  { id: "drones", label: "Drones", icon: Plane },
  { id: "about", label: "About Us", icon: Info },
];

export function GuestLanding({ onLogin, onSignUp }: GuestLandingProps) {
  const [activeTab, setActiveTab] = useState<GuestTab>("home");
  const [showLogin, setShowLogin] = useState(false);
  const [authIntent, setAuthIntent] = useState<AuthIntent>(null);
  const [loginMode, setLoginMode] = useState<"login" | "register">("login");

  const openLogin = useCallback((intent: AuthIntent = "farmer", mode: "login" | "register" = "login") => {
    setAuthIntent(intent);
    setLoginMode(mode);
    setShowLogin(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const handleFooterNav = (key: string) => {
    const map: Record<string, GuestTab> = {
      home: "home",
      services: "services",
      drones: "drones",
      aboutus: "about",
      about: "about",
    };
    const tab = map[key] || "home";
    setActiveTab(tab);
    setShowLogin(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const requireAuth = (intent: AuthIntent) => openLogin(intent, "login");

  return (
    <div className="min-h-screen bg-background w-full">
      <div className="max-w-6xl mx-auto min-h-screen relative flex flex-col">
        <GuestTopBar onLogin={() => openLogin("farmer", "login")} />

        <main className="flex-1 pb-24">
          {showLogin ? (
            <GuestLogin
              onLogin={onLogin}
              onSignUp={(r) => onSignUp(r)}
              onBack={() => setShowLogin(false)}
              initialRole={authIntent || "farmer"}
              initialMode={loginMode}
            />
          ) : (
            <>
              {activeTab === "home" && (
                <GuestHome
                  onBookPilot={() => requireAuth("farmer")}
                  onBecomePilot={() => openLogin("pilot", "register")}
                  onLearnMore={() => setActiveTab("services")}
                />
              )}
              {activeTab === "services" && (
                <GuestServices onBookNow={() => requireAuth("farmer")} />
              )}
              {activeTab === "drones" && (
                <GuestDrones onRentNow={() => requireAuth("farmer")} />
              )}
              {activeTab === "about" && <GuestAbout />}
              <GuestFooter onNavigate={handleFooterNav} onLogin={() => openLogin("pilot", "register")} />
            </>
          )}
        </main>

        {!showLogin && (
          <BottomNav wide items={navItems} active={activeTab} onChange={(id) => {
            setActiveTab(id as GuestTab);
            window.scrollTo({ top: 0, behavior: "smooth" });
          }} />
        )}
      </div>
    </div>
  );
}
