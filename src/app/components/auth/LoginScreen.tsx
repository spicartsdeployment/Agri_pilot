import { useState } from "react";
import { Eye, EyeOff, Phone, Lock, Sprout, ArrowLeft, Mail, CheckCircle } from "lucide-react";

interface LoginScreenProps {
  onLogin: (role: "farmer" | "pilot" | "vendor") => void;
  onSignUp: () => void;
}

type ForgotStep = "input" | "otp" | "done";

function ForgotPasswordModal({ onClose }: { onClose: () => void }) {
  const [step,    setStep]    = useState<ForgotStep>("input");
  const [contact, setContact] = useState("");
  const [otp,     setOtp]     = useState(["","","","","",""]);
  const [error,   setError]   = useState("");

  const handleSendOtp = () => {
    if (!contact.trim()) { setError("Please enter your phone number or email."); return; }
    setError("");
    setStep("otp");
  };

  const handleOtpChange = (i: number, val: string) => {
    if (val.length > 1) return;
    const next = [...otp]; next[i] = val; setOtp(next);
    if (val && i < 5) document.getElementById(`fp-otp-${i + 1}`)?.focus();
  };

  const handleVerify = () => {
    if (otp.some((d) => d === "")) { setError("Enter all 6 digits."); return; }
    setError("");
    setStep("done");
  };

  return (
    <div className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-background w-full max-w-sm rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-border">
          {step !== "done" && (
            <button onClick={step === "input" ? onClose : () => setStep("input")}
              className="w-8 h-8 bg-secondary rounded-xl flex items-center justify-center">
              <ArrowLeft className="w-4 h-4 text-foreground" />
            </button>
          )}
          <div>
            <h3 className="text-foreground font-semibold">
              {step === "input" ? "Forgot Password" : step === "otp" ? "Verify OTP" : "Password Reset"}
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              {step === "input" ? "Enter your phone or email" : step === "otp" ? `OTP sent to ${contact}` : "All done!"}
            </p>
          </div>
        </div>

        <div className="px-5 py-5 space-y-4">
          {step === "input" && (
            <>
              <p className="text-sm text-muted-foreground">
                We'll send a 6-digit OTP to reset your password.
              </p>
              {/* Phone or Email toggle */}
              <div className="flex bg-secondary rounded-xl p-1 gap-1 mb-4">
                {(["Phone","Email"] as const).map((t) => (
                  <button key={t}
                    className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all ${contact && (t === "Phone" ? /^\d/.test(contact) : /[@.]/.test(contact)) ? "bg-card shadow-sm text-foreground" : "text-muted-foreground"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3 bg-input-background rounded-xl px-4 py-3">
                <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Phone number or email address"
                  value={contact}
                  onChange={(e) => { setContact(e.target.value); setError(""); }}
                  className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                />
              </div>
              {error && <p className="text-destructive text-xs">{error}</p>}
              <button onClick={handleSendOtp}
                className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium hover:opacity-90">
                Send OTP
              </button>
              <button onClick={onClose} className="w-full text-muted-foreground text-sm hover:underline">
                Back to Login
              </button>
            </>
          )}

          {step === "otp" && (
            <>
              <p className="text-sm text-muted-foreground">
                Enter the 6-digit code sent to <span className="text-foreground font-medium">{contact}</span>
              </p>
              <p className="text-xs text-muted-foreground">Enter any 6 digits for demo</p>
              <div className="flex gap-2 justify-center py-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`fp-otp-${i}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    className="w-11 h-11 text-center bg-input-background border border-border rounded-xl text-foreground outline-none focus:border-primary text-lg font-semibold"
                  />
                ))}
              </div>
              {error && <p className="text-destructive text-xs text-center">{error}</p>}
              <button onClick={handleVerify}
                className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium hover:opacity-90">
                Verify OTP
              </button>
              <button onClick={() => setStep("input")}
                className="w-full text-primary text-sm hover:underline">
                Resend OTP
              </button>
            </>
          )}

          {step === "done" && (
            <div className="flex flex-col items-center text-center py-4 gap-3">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center">
                <CheckCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-foreground font-semibold">OTP Verified!</h3>
              <p className="text-sm text-muted-foreground">
                A password reset link has been sent to <span className="text-foreground font-medium">{contact}</span>. Check your phone or email to set a new password.
              </p>
              <button onClick={onClose}
                className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium hover:opacity-90 mt-2">
                Back to Login
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function LoginScreen({ onLogin, onSignUp }: LoginScreenProps) {
  const [phone,       setPhone]       = useState("");
  const [password,    setPassword]    = useState("");
  const [showPass,    setShowPass]    = useState(false);
  const [error,       setError]       = useState("");
  const [showForgot,  setShowForgot]  = useState(false);

  const demoAccounts = [
    { phone: "9876543210", password: "farmer123", role: "farmer" as const, label: "Farmer" },
    { phone: "9876543211", password: "pilot123",  role: "pilot"  as const, label: "Pilot" },
    { phone: "9876543212", password: "vendor123", role: "vendor" as const, label: "Drone Vendor" },
  ];

  const handleLogin = () => {
    const account = demoAccounts.find((a) => a.phone === phone && a.password === password);
    if (account) onLogin(account.role);
    else setError("Invalid phone number or password.");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
      {showForgot && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}

      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center mb-4 shadow-lg">
            <Sprout className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-foreground tracking-tight">AgriPilot</h1>
          <p className="text-muted-foreground text-sm mt-1">Precision Agriculture, Delivered</p>
        </div>

        {/* Form */}
        <div className="bg-card rounded-2xl shadow-sm border border-border p-6 space-y-4">
          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Phone Number</label>
            <div className="flex items-center gap-3 bg-input-background rounded-xl px-4 py-3">
              <Phone className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <input type="tel" placeholder="Enter your phone number" value={phone}
                onChange={(e) => { setPhone(e.target.value); setError(""); }}
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-sm" />
            </div>
          </div>

          <div>
            <label className="text-sm text-muted-foreground mb-1.5 block">Password</label>
            <div className="flex items-center gap-3 bg-input-background rounded-xl px-4 py-3">
              <Lock className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <input type={showPass ? "text" : "password"} placeholder="Enter your password" value={password}
                onChange={(e) => { setPassword(e.target.value); setError(""); }}
                className="flex-1 bg-transparent outline-none text-foreground placeholder:text-muted-foreground text-sm" />
              <button onClick={() => setShowPass(!showPass)} className="text-muted-foreground hover:text-foreground">
                {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && <p className="text-destructive text-xs">{error}</p>}

          <div className="flex justify-end">
            <button
              onClick={() => setShowForgot(true)}
              className="text-sm text-primary hover:underline transition-colors"
            >
              Forgot Password?
            </button>
          </div>

          <button onClick={handleLogin}
            className="w-full bg-primary text-primary-foreground rounded-xl py-3 text-sm font-medium hover:opacity-90 transition-opacity">
            Login
          </button>
        </div>

        {/* Demo quick-login */}
        <div className="mt-6">
          <p className="text-center text-xs text-muted-foreground mb-3">Quick demo login</p>
          <div className="grid grid-cols-3 gap-2">
            {demoAccounts.map((a) => (
              <button key={a.role} onClick={() => onLogin(a.role)}
                className="bg-card border border-border rounded-xl py-2.5 text-xs text-foreground hover:bg-secondary transition-colors font-medium">
                {a.label}
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account?{" "}
          <button onClick={onSignUp} className="text-primary font-medium hover:underline">Sign Up</button>
        </p>
      </div>
    </div>
  );
}
