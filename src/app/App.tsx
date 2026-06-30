import { useState, useCallback } from "react";
import { SplashScreen } from "./components/guest/SplashScreen";
import { GuestLanding } from "./components/guest/GuestLanding";
import { LoginScreen } from "./components/auth/LoginScreen";
import { SignUpScreen } from "./components/auth/SignUpScreen";
import { FarmerDashboard } from "./components/farmer/FarmerDashboard";
import { VendorDashboard } from "./components/vendor/VendorDashboard";
import { PilotDashboard } from "./components/pilot/PilotDashboard";

type AppPhase = "splash" | "guest" | "login" | "signup";
type Role = "farmer" | "pilot" | "vendor";

export default function App() {
  const [phase, setPhase] = useState<AppPhase>("splash");
  const [role, setRole] = useState<Role | null>(null);
  const [signUpRole, setSignUpRole] = useState<"farmer" | "pilot" | "vendor">("farmer");

  const handleSplashComplete = useCallback(() => setPhase("guest"), []);
  const handleLogin = (r: Role) => { setRole(r); setPhase("guest"); };
  const handleLogout = () => { setRole(null); setPhase("guest"); };

  if (role === "farmer") return <FarmerDashboard onLogout={handleLogout} />;
  if (role === "pilot") return <PilotDashboard onLogout={handleLogout} />;
  if (role === "vendor") return <VendorDashboard onLogout={handleLogout} />;

  if (phase === "splash") {
    return <SplashScreen onComplete={handleSplashComplete} />;
  }

  if (phase === "signup") {
    return (
      <SignUpScreen
        onBack={() => setPhase("guest")}
        onSuccess={(r) => { setRole(r); }}
      />
    );
  }

  if (phase === "login") {
    return (
      <LoginScreen
        onLogin={handleLogin}
        onSignUp={() => setPhase("signup")}
      />
    );
  }

  return (
    <GuestLanding
      onLogin={handleLogin}
      onSignUp={(r) => { setSignUpRole(r || "farmer"); setPhase("signup"); }}
    />
  );
}
