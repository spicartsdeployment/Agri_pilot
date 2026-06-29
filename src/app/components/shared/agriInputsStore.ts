import { useSyncExternalStore } from "react";

export type AgriProductType = "pesticide" | "fertilizer" | "chemical";

export type AgriInventoryItem = {
  id: string;
  type: AgriProductType;
  brand: string;
  unit: "L" | "kg";
  pricePerUnit: number;
  stock: number;
};

export type AgriPurchaseRequest = {
  id: string;
  pilotName: string;
  productId: string;
  brand: string;
  type: AgriProductType;
  quantity: number;
  unit: string;
  amount: number;
  status: "pending" | "accepted" | "declined";
  date: string;
};

export type AgriSaleRecord = {
  id: string;
  pilot: string;
  brand: string;
  type: AgriProductType;
  quantity: number;
  unit: string;
  amount: number;
  date: string;
};

type StoreState = {
  inventory: AgriInventoryItem[];
  requests: AgriPurchaseRequest[];
  sales: AgriSaleRecord[];
};

const initialInventory: AgriInventoryItem[] = [
  { id: "P1", type: "pesticide", brand: "Bayer Confidor 200 SL", unit: "L", pricePerUnit: 850, stock: 120 },
  { id: "P2", type: "pesticide", brand: "Syngenta Polo 500", unit: "L", pricePerUnit: 720, stock: 85 },
  { id: "P3", type: "pesticide", brand: "UPL Saaf", unit: "kg", pricePerUnit: 420, stock: 200 },
  { id: "F1", type: "fertilizer", brand: "IFFCO Urea 46%", unit: "kg", pricePerUnit: 320, stock: 500 },
  { id: "F2", type: "fertilizer", brand: "Coromandel DAP", unit: "kg", pricePerUnit: 1450, stock: 150 },
  { id: "C1", type: "chemical", brand: "Humic Acid 12%", unit: "L", pricePerUnit: 540, stock: 60 },
];

let state: StoreState = {
  inventory: initialInventory,
  requests: [],
  sales: [
    { id: "SAL-AGR-1", pilot: "Arjun Singh", brand: "IFFCO Urea 46%", type: "fertilizer", quantity: 50, unit: "kg", amount: 16000, date: "May 28, 2026" },
    { id: "SAL-AGR-2", pilot: "Kiran Rao", brand: "Bayer Confidor 200 SL", type: "pesticide", quantity: 10, unit: "L", amount: 8500, date: "Jun 2, 2026" },
  ],
};
const listeners = new Set<() => void>();

function emit() { listeners.forEach((l) => l()); }

export function subscribeAgriStore(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function getAgriStore() { return state; }

export function updateInventoryStock(id: string, stock: number) {
  state = {
    ...state,
    inventory: state.inventory.map((i) => (i.id === id ? { ...i, stock: Math.max(0, stock) } : i)),
  };
  emit();
}

export function submitAgriPurchaseRequest(req: Omit<AgriPurchaseRequest, "id" | "status" | "date">) {
  const item: AgriPurchaseRequest = {
    ...req,
    id: `AGR-${2400 + state.requests.length}`,
    status: "pending",
    date: new Date().toLocaleDateString("en-IN", { month: "short", day: "numeric", year: "numeric" }),
  };
  state = { ...state, requests: [item, ...state.requests] };
  emit();
  return item.id;
}

export function acceptAgriRequest(id: string) {
  const req = state.requests.find((r) => r.id === id);
  if (!req || req.status !== "pending") return;
  const product = state.inventory.find((i) => i.id === req.productId);
  if (!product || product.stock < req.quantity) return;

  const sale: AgriSaleRecord = {
    id: `SAL-AGR-${state.sales.length + 1}`,
    pilot: req.pilotName,
    brand: req.brand,
    type: req.type,
    quantity: req.quantity,
    unit: req.unit,
    amount: req.amount,
    date: req.date,
  };

  state = {
    inventory: state.inventory.map((i) =>
      i.id === req.productId ? { ...i, stock: i.stock - req.quantity } : i
    ),
    requests: state.requests.map((r) => (r.id === id ? { ...r, status: "accepted" as const } : r)),
    sales: [sale, ...state.sales],
  };
  emit();
}

export function declineAgriRequest(id: string) {
  state = {
    ...state,
    requests: state.requests.map((r) => (r.id === id ? { ...r, status: "declined" as const } : r)),
  };
  emit();
}

export function useAgriStore() {
  return useSyncExternalStore(subscribeAgriStore, getAgriStore, getAgriStore);
}
