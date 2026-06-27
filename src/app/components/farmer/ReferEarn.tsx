import { Copy, Share2, Users, Gift, Check, Wallet } from "lucide-react";
import { useState } from "react";
import { REFERRAL_REWARD } from "./farmerData";

const referralCode = "AGRI-RKS41";
const referrals = [
  { name: "Suresh Patel", joined: "Jun 3, 2026", status: "Active", reward: REFERRAL_REWARD },
  { name: "Mahesh Yadav", joined: "May 28, 2026", status: "Pending", reward: 0 },
  { name: "Ramesh Gupta", joined: "May 15, 2026", status: "Active", reward: REFERRAL_REWARD },
];

export function ReferEarn() {
  const [copied, setCopied] = useState(false);
  const [shared, setShared] = useState(false);
  const referralLink = `https://agripilot.in/join?ref=${referralCode}`;
  const totalRewards = referrals.reduce((sum, r) => sum + r.reward, 0);
  const walletBalance = totalRewards;

  const copy = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const share = async () => {
    const shareData = {
      title: "Join AgriPilot",
      text: `Use my referral code ${referralCode} to join AgriPilot! I earn ₹${REFERRAL_REWARD} wallet credit per successful referral.`,
      url: referralLink,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch { /* user cancelled */ }
    } else {
      await navigator.clipboard.writeText(`${shareData.text} ${referralLink}`);
      setShared(true);
      setTimeout(() => setShared(false), 2000);
    }
  };

  return (
    <div className="space-y-4 mb-6">
      <div className="bg-primary rounded-2xl p-5 text-center">
        <div className="text-3xl mb-2">🎁</div>
        <h3 className="text-primary-foreground mb-1">Refer & Earn</h3>
        <p className="text-primary-foreground/80 text-xs">Earn ₹{REFERRAL_REWARD} wallet credit for every successful referral</p>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 bg-secondary rounded-xl flex items-center justify-center text-primary"><Wallet className="w-5 h-5" /></div>
        <div className="flex-1">
          <p className="text-xs text-muted-foreground">Wallet Balance</p>
          <p className="text-lg font-semibold text-foreground">₹{walletBalance}</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-2xl p-4">
        <p className="text-xs text-muted-foreground mb-2">Your Referral Code</p>
        <div className="flex items-center gap-3 bg-secondary rounded-xl p-3">
          <span className="flex-1 text-foreground font-mono font-semibold tracking-widest">{referralCode}</span>
          <button onClick={copy} className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg transition-colors ${copied ? "bg-primary text-primary-foreground" : "bg-card border border-border text-foreground"}`}>
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <button onClick={share} className="w-full mt-3 flex items-center justify-center gap-2 py-2.5 bg-accent text-accent-foreground rounded-xl text-sm font-medium hover:opacity-90">
          <Share2 className="w-4 h-4" />
          {shared ? "Link copied to clipboard!" : "Share Referral Link"}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Referred", value: referrals.length, icon: <Users className="w-4 h-4" /> },
          { label: "Active", value: referrals.filter((r) => r.status === "Active").length, icon: <Check className="w-4 h-4" /> },
          { label: "Earned", value: `₹${totalRewards}`, icon: <Gift className="w-4 h-4" /> },
        ].map(({ label, value, icon }) => (
          <div key={label} className="bg-card border border-border rounded-xl p-3 text-center">
            <div className="flex justify-center mb-1 text-primary">{icon}</div>
            <p className="text-sm font-semibold text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        ))}
      </div>

      <div>
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">Your Referrals</p>
        <div className="space-y-2">
          {referrals.map((r) => (
            <div key={r.name} className="bg-card border border-border rounded-xl p-3 flex items-center gap-3">
              <div className="w-9 h-9 bg-secondary rounded-full flex items-center justify-center text-sm font-semibold text-primary">{r.name[0]}</div>
              <div className="flex-1">
                <p className="text-xs font-medium text-foreground">{r.name}</p>
                <p className="text-xs text-muted-foreground">{r.joined}</p>
              </div>
              <div className="text-right">
                <span className={`text-xs px-2 py-0.5 rounded-full ${r.status === "Active" ? "bg-secondary text-primary" : "bg-muted text-muted-foreground"}`}>{r.status}</span>
                {r.reward > 0 && <p className="text-xs text-primary font-medium mt-0.5">+₹{r.reward} wallet</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
