import { useState } from "react";
import { LoginScreen } from "./components/auth/LoginScreen";
import { SignUpScreen } from "./components/auth/SignUpScreen";
import { FarmerDashboard } from "./components/farmer/FarmerDashboard";
import { VendorDashboard } from "./components/vendor/VendorDashboard";
import { PilotDashboard } from "./components/pilot/PilotDashboard";

type Screen = "login" | "signup";
type Role = "farmer" | "pilot" | "vendor";

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");
  const [role, setRole] = useState<Role | null>(null);

  const handleLogin = (r: Role) => setRole(r);
  const handleLogout = () => { setRole(null); setScreen("login"); };

  // MARKER-MAKE-KIT-INVOKED
  if (role === "farmer") return <FarmerDashboard onLogout={handleLogout} />;
  if (role === "pilot") return <PilotDashboard onLogout={handleLogout} />;
  if (role === "vendor") return <VendorDashboard onLogout={handleLogout} />;

  if (screen === "signup") {
    return (
      <SignUpScreen
        onBack={() => setScreen("login")}
        onSuccess={(r) => { setScreen("login"); setRole(r); }}
      />
    );
  }

  return (
    <LoginScreen
      onLogin={handleLogin}
      onSignUp={() => setScreen("signup")}
    />
  );
}
