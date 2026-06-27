export type PilotCandidate = {
  id: string;
  name: string;
  rating: number;
  subscriptionTier: "basic" | "pro" | "premium";
  available: boolean;
  distanceKm: number;
};

const tierScore: Record<PilotCandidate["subscriptionTier"], number> = {
  premium: 3,
  pro: 2,
  basic: 1,
};

/** Auto-assign most suitable pilot: rating, subscription, availability, distance */
export function assignBestPilot(candidates: PilotCandidate[]): PilotCandidate | null {
  const available = candidates.filter((p) => p.available);
  if (available.length === 0) return null;
  return [...available].sort((a, b) => {
    const scoreA = a.rating * 10 + tierScore[a.subscriptionTier] * 5 - a.distanceKm * 0.5;
    const scoreB = b.rating * 10 + tierScore[b.subscriptionTier] * 5 - b.distanceKm * 0.5;
    return scoreB - scoreA;
  })[0];
}

export const availablePilots: PilotCandidate[] = [
  { id: "P1", name: "Arjun Singh", rating: 4.9, subscriptionTier: "premium", available: true, distanceKm: 4.2 },
  { id: "P2", name: "Kiran Rao", rating: 4.7, subscriptionTier: "pro", available: true, distanceKm: 6.1 },
  { id: "P3", name: "Vikram Nair", rating: 4.5, subscriptionTier: "basic", available: true, distanceKm: 3.8 },
  { id: "P4", name: "Rahul Desai", rating: 4.8, subscriptionTier: "premium", available: false, distanceKm: 11.2 },
];
