import { REFERRAL_REWARD } from "../shared/dgcaUtils";

export type BookingStatus = "confirmed" | "in_progress" | "completed" | "cancelled" | "pending_quote";

export type Farm = {
  id: number;
  name: string;
  crop: string;
  acres: number;
  img: string;
  location?: string;
};

export type Booking = {
  id: string;
  farm: string;
  service: string;
  quantity: string;
  date: string;
  time: string;
  pilot: string;
  acres: number;
  amount: number;
  status: BookingStatus;
  progress: number;
  pilotAcceptedAt?: number;
  advancePaid?: boolean;
  completedAt?: number;
  customQuote?: number;
  quotePending?: boolean;
};

export type FarmerNotification = {
  id: number;
  type: "booking" | "payment" | "alert" | "tracking";
  title: string;
  body: string;
  time: string;
  read: boolean;
};

export type SubscriptionTier = "free" | "premium";

export const JOB_TRACKING_EVENTS = [
  "Pilot Assigned",
  "Pilot En Route",
  "Pilot Arrived",
  "Job Started",
  "Job 50% Completed",
  "Job Completed",
  "Payment Received",
  "Invoice Generated",
] as const;

const pad = (n: number) => String(n).padStart(2, "0");
export function newBookingId() {
  return `JB-${2420 + Math.floor(Math.random() * 80)}`;
}

export const initialFarms: Farm[] = [
  { id: 1, name: "North Field", crop: "Wheat", acres: 12, img: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=120&h=80&fit=crop&auto=format", location: "Kamptee, MH" },
  { id: 2, name: "South Paddy", crop: "Rice", acres: 8, img: "https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=120&h=80&fit=crop&auto=format", location: "Kamptee, MH" },
  { id: 3, name: "East Orchard", crop: "Mango", acres: 5, img: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=120&h=80&fit=crop&auto=format", location: "Kamptee, MH" },
];

export const initialBookings: Booking[] = [
  {
    id: "JB-2401",
    farm: "North Field",
    service: "Pesticide Spray",
    quantity: "40 L",
    date: "Jun 11, 2026",
    time: "10:00 AM",
    pilot: "Arjun Singh",
    acres: 12,
    amount: 5400,
    status: "in_progress",
    progress: 65,
    pilotAcceptedAt: Date.now() - 30 * 60 * 1000,
  },
  {
    id: "JB-2398",
    farm: "South Paddy",
    service: "Fertilizer Spray",
    quantity: "30 L",
    date: "Jun 12, 2026",
    time: "7:00 AM",
    pilot: "Pending",
    acres: 8,
    amount: 3600,
    status: "confirmed",
    progress: 0,
  },
  {
    id: "JB-2390",
    farm: "East Orchard",
    service: "Crop Monitoring",
    quantity: "N/A",
    date: "Jun 5, 2026",
    time: "9:00 AM",
    pilot: "Vikram Nair",
    acres: 5,
    amount: 2250,
    status: "completed",
    progress: 100,
    completedAt: Date.now() - 3600000,
    advancePaid: false,
  },
];

export const initialNotifications: FarmerNotification[] = [
  { id: 1, type: "tracking", title: "Pilot Assigned", body: "Arjun Singh assigned to JB-2401", time: "Just now", read: false },
  { id: 2, type: "tracking", title: "Pilot En Route", body: "Arjun Singh is heading to North Field", time: "5 min ago", read: false },
  { id: 3, type: "payment", title: "Payment Received", body: "₹5,400 payment processed for JB-2390", time: "1d ago", read: true },
  { id: 4, type: "alert", title: "Invoice Generated", body: "Invoice ready for JB-2390 — view in History", time: "1d ago", read: true },
  { id: 5, type: "booking", title: "Job 50% Completed", body: "Spray coverage at 50% for North Field", time: "2h ago", read: false },
];

export { REFERRAL_REWARD };
