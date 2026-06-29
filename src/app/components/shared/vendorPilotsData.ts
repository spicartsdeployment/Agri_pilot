export type VendorPilot = {
  id: string;
  name: string;
  phone: string;
  email: string;
  license: string;
  experience: string;
  location: string;
  rating: number;
  status: "Active" | "On Leave" | "Inactive";
  jobs: number;
  droneRegistration: string;
  dgcaVerified: boolean;
  avatar: string;
};

export const vendorPilots: VendorPilot[] = [
  {
    id: "P1", name: "Arjun Singh", phone: "+91 98765 43211", email: "arjun.singh@agripilot.in",
    license: "DL-MH-2023-0441", experience: "3 years", location: "Nagpur, MH", rating: 4.9,
    status: "Active", jobs: 24, droneRegistration: "UAV-MH-2024-009", dgcaVerified: true, avatar: "AS",
  },
  {
    id: "P2", name: "Kiran Rao", phone: "+91 94823 33221", email: "kiran.rao@agripilot.in",
    license: "DL-KA-2021-0882", experience: "5 years", location: "Wardha, MH", rating: 4.7,
    status: "Active", jobs: 18, droneRegistration: "UAV-MH-2024-012", dgcaVerified: true, avatar: "KR",
  },
  {
    id: "P3", name: "Vikram Nair", phone: "+91 97003 21189", email: "vikram.nair@agripilot.in",
    license: "DL-TN-2024-0331", experience: "2 years", location: "Amravati, MH", rating: 4.5,
    status: "On Leave", jobs: 9, droneRegistration: "UAV-MH-2024-018", dgcaVerified: false, avatar: "VN",
  },
];
