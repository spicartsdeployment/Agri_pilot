export const pilotProfile = {
  name: "Arjun Singh",
  phone: "+91 98765 43211",
  email: "arjun.singh@agripilot.in",
  dgcaCertificate: "",
  dgcaVerified: false,
  experience: "3 years",
  location: "Nagpur, Maharashtra",
  rating: 4.9,
  cancellationCount: 0,
  avatar: "AS",
  role: "Licensed Pilot",
  aadhaar: "",
  bankAccount: "",
  droneRegistration: "UAV-MH-2024-009",
};

export type JobRequest = {
  id: string;
  farmer: string;
  phone: string;
  acres: number;
  date: string;
  time: string;
  jobType: "Fertilizing" | "Pesticides" | "Inspection" | "Seeding";
  location: string;
  distance: number; // km
  price: number;
  cropType: string;
  soilType: string;
  landType: string;
  cropStage: string;
  status: "pending" | "accepted" | "declined";
  requiresQuote?: boolean;
  customQuote?: number;
  declineReason?: string;
  lat: number;
  lng: number;
};

export const initialJobRequests: JobRequest[] = [
  {
    id: "JR-501",
    farmer: "Rajesh Kumar",
    phone: "+91 94823 11209",
    acres: 12,
    date: "Jun 13, 2026",
    time: "8:00 AM",
    jobType: "Fertilizing",
    location: "Nagpur, MH",
    distance: 4.2,
    price: 5400,
    cropType: "Wheat",
    soilType: "Sandy Loam",
    landType: "Irrigated",
    cropStage: "Tillering",
    status: "pending",
    lat: 21.15, lng: 79.10,
  },
  {
    id: "JR-502",
    farmer: "Suresh Patel",
    phone: "+91 99821 44010",
    acres: 8,
    date: "Jun 14, 2026",
    time: "7:00 AM",
    jobType: "Pesticides",
    location: "Wardha, MH",
    distance: 11.8,
    price: 3600,
    cropType: "Rice",
    soilType: "Clay",
    landType: "Wetland",
    cropStage: "Transplanting",
    status: "pending",
    lat: 21.12, lng: 79.22,
  },
  {
    id: "JR-503",
    farmer: "Mahesh Yadav",
    phone: "+91 91203 78844",
    acres: 5,
    date: "Jun 15, 2026",
    time: "9:30 AM",
    jobType: "Inspection",
    location: "Amravati, MH",
    distance: 22.3,
    price: 2250,
    cropType: "Soybean",
    soilType: "Red Loam",
    landType: "Dryland",
    cropStage: "Flowering",
    status: "accepted",
    lat: 21.18, lng: 79.14,
  },
  {
    id: "JR-504",
    farmer: "Rajesh Kumar",
    phone: "+91 98765 43210",
    acres: 65,
    date: "Jun 16, 2026",
    time: "6:00 AM",
    jobType: "Pesticides",
    location: "Kamptee, MH",
    distance: 8.5,
    price: 29250,
    cropType: "Wheat",
    soilType: "Black Cotton",
    landType: "Irrigated",
    cropStage: "Heading",
    status: "pending",
    requiresQuote: true,
    lat: 21.18, lng: 79.15,
  },
];

export type ActiveJob = {
  id: string;
  farmer: string;
  phone: string;
  farm: string;
  service: string;
  acres: number;
  date: string;
  time: string;
  location: string;
  pay: number;
  passKey?: string;
  jobStatus: "active" | "today" | "upcoming";
  geofenceVerified?: boolean;
  arrivalPhotoTaken?: boolean;
  autoProgress?: number;
  lat: number;
  lng: number;
};

export const activeJobsList: ActiveJob[] = [
  {
    id: "JB-2401",
    farmer: "Kiran Rao",
    phone: "+91 98102 33221",
    farm: "South Paddy",
    service: "Fertilizer Spray",
    acres: 10,
    date: "Jun 11, 2026",
    time: "10:00 AM",
    location: "Nagpur, MH",
    pay: 4500,
    passKey: "AGRI-9X42",
    jobStatus: "active",
    lat: 21.16, lng: 79.12,
  },
  {
    id: "JB-2405",
    farmer: "Vikram Nair",
    phone: "+91 97003 21189",
    farm: "North Field",
    service: "Pesticide Spray",
    acres: 15,
    date: "Jun 11, 2026",
    time: "3:00 PM",
    location: "Yavatmal, MH",
    pay: 6750,
    passKey: "AGRI-P7R1",
    jobStatus: "today",
    lat: 21.14, lng: 79.20,
  },
  {
    id: "JB-2410",
    farmer: "Dinesh Sharma",
    phone: "+91 93450 88120",
    farm: "East Orchard",
    service: "Crop Monitoring",
    acres: 8,
    date: "Jun 13, 2026",
    time: "8:00 AM",
    location: "Wardha, MH",
    pay: 3200,
    jobStatus: "upcoming",
    lat: 21.21, lng: 79.11,
  },
  {
    id: "JB-2412",
    farmer: "Sunil Patil",
    phone: "+91 95612 00987",
    farm: "West Farm",
    service: "Seeding",
    acres: 20,
    date: "Jun 15, 2026",
    time: "7:30 AM",
    location: "Buldhana, MH",
    pay: 9000,
    jobStatus: "upcoming",
    lat: 21.13, lng: 79.17,
  },
];

export const weatherData = {
  today: { temp: 31, condition: "Sunny", humidity: 58, wind: 10, icon: "☀️", location: "Nagpur, MH" },
  week: [
    { day: "Mon", temp: 31, icon: "☀️", low: 24 },
    { day: "Tue", temp: 29, icon: "⛅", low: 23 },
    { day: "Wed", temp: 26, icon: "🌧", low: 21 },
    { day: "Thu", temp: 28, icon: "⛅", low: 22 },
    { day: "Fri", temp: 33, icon: "☀️", low: 25 },
    { day: "Sat", temp: 32, icon: "☀️", low: 25 },
    { day: "Sun", temp: 30, icon: "🌤", low: 23 },
  ],
};
