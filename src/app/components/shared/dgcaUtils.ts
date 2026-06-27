/** DGCA-aligned flyability check for agricultural drone operations */
export type FlyStatus = "good" | "dont_fly";

export function getDgcaFlyStatus(windKmh: number, condition: string): { status: FlyStatus; label: string; reason: string } {
  const cond = condition.toLowerCase();
  if (cond.includes("rain") || cond.includes("storm") || cond.includes("fog")) {
    return { status: "dont_fly", label: "Don't Fly", reason: "Adverse weather — DGCA restricts flight in rain, storms, or low visibility" };
  }
  if (windKmh > 25) {
    return { status: "dont_fly", label: "Don't Fly", reason: `Wind ${windKmh} km/h exceeds DGCA limit of 25 km/h for spray operations` };
  }
  if (windKmh > 15) {
    return { status: "good", label: "Good to Fly", reason: "Moderate wind — monitor conditions; stay within DGCA visual line-of-sight rules" };
  }
  return { status: "good", label: "Good to Fly", reason: "Conditions meet DGCA guidelines for agricultural drone operations" };
}

/** Cancellation fee ₹100–300 after 15-min free window post pilot acceptance */
export function getCancellationFee(pilotAcceptedAt: number | null): { free: boolean; fee: number; message: string } {
  if (!pilotAcceptedAt) {
    return { free: true, fee: 0, message: "No pilot assigned yet — cancellation is free" };
  }
  const elapsedMs = Date.now() - pilotAcceptedAt;
  const fifteenMin = 15 * 60 * 1000;
  if (elapsedMs <= fifteenMin) {
    const minsLeft = Math.ceil((fifteenMin - elapsedMs) / 60000);
    return { free: true, fee: 0, message: `Free cancellation — ${minsLeft} min left in 15-min window` };
  }
  const fee = 100 + Math.floor((elapsedMs / 60000 - 15) / 30) * 50;
  const capped = Math.min(300, Math.max(100, fee));
  return { free: false, fee: capped, message: `Cancellation fee: ₹${capped} (15-min free window expired)` };
}

export const REFERRAL_REWARD = 100;
export const ADVANCE_PERCENT = 0.2;
export const FREE_CANCEL_WINDOW_MS = 15 * 60 * 1000;
export const REFUND_WINDOW_MS = 24 * 60 * 60 * 1000;
export const DRONE_RENTAL_FREE_CANCEL_MS = 10 * 60 * 1000;
export const DRONE_RENTAL_MIN_HOURS = 2;
export const DRONE_RENTAL_MAX_DAYS = 30;
export const CUSTOM_QUOTE_ACRE_THRESHOLD = 50;
export const MIN_ACRES = 1;
