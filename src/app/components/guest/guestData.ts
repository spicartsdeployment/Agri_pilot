import {
  Droplets, Map, Plane, Sprout, Scan, Beaker, Wind, Activity,
} from "lucide-react";



export const HERO_VIDEO_SRC = "/videos/hero-drone.mp4";
export const HERO_VIDEO_POSTER =
  "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1920&h=1080&fit=crop&auto=format";

export const servicePreviews = [
  { icon: Droplets, title: "Crop Spraying", desc: "Precision aerial spraying for even coverage.", color: "bg-blue-50 text-blue-700" },
  { icon: Scan, title: "Farm Survey", desc: "High-resolution mapping of your farmland.", color: "bg-green-50 text-green-700" },
  { icon: Activity, title: "Crop Health Monitoring", desc: "NDVI & stress detection from the sky.", color: "bg-orange-50 text-orange-700" },
  { icon: Beaker, title: "Fertilizer Spraying", desc: "Targeted nutrient application.", color: "bg-emerald-50 text-emerald-700" },
  { icon: Wind, title: "Pesticide Spraying", desc: "Safe, certified chemical spraying.", color: "bg-amber-50 text-amber-700" },
  { icon: Plane, title: "Drone Rental", desc: "Rent agri-drones by the day.", color: "bg-sky-50 text-sky-700" },
  { icon: Sprout, title: "Pilot Booking", desc: "Book certified pilots in minutes.", color: "bg-lime-50 text-lime-700" },
  { icon: Map, title: "Farm Mapping", desc: "Accurate field boundary mapping.", color: "bg-teal-50 text-teal-700" },
];

export const whyChoose = [
  "Certified Drone Pilots",
  "Affordable Drone Rentals",
  "Fast Booking Process",
  "Accurate Drone Operations",
  "Safe Chemical Spraying",
  "Time Saving",
  "Better Crop Productivity",
  "Real-Time Job Tracking",
];

export const howItWorks = [
  { step: 1, title: "Book a Pilot", desc: "Choose your farm and service" },
  { step: 2, title: "Choose Service", desc: "Spray, survey, or monitor" },
  { step: 3, title: "Assign Drone", desc: "Auto or manual drone match" },
  { step: 4, title: "Pilot Visits Farm", desc: "GPS-verified arrival" },
  { step: 5, title: "Drone Completes Job", desc: "Safe, efficient operations" },
  { step: 6, title: "Track & Download Report", desc: "Live tracking + reports" },
];

export const pilotFeatures = [
  "Flexible work schedule",
  "Receive nearby jobs",
  "Build ratings",
  "Secure payments",
  "Expand your customer base",
];

export type GuestService = {
  id: string;
  title: string;
  image: string;
  description: string;
  benefits: string[];
  crops: string;
  coverage: string;
  priceFrom: number;
};

export const guestServices: GuestService[] = [
  {
    id: "crop-spray",
    title: "Crop Spraying",
    image: "/Drone/crop spraying.webp",
    description:
      "Uniform aerial spraying for pesticides, fungicides, and fertilizers with precision and minimal crop damage.",
    benefits: ["Uniform coverage", "Reduces labour cost", "Saves time"],
    crops: "Wheat, Rice, Cotton, Soybean",
    coverage: "8–12 acres/hour",
    priceFrom: 450,
  },
  {
    id: "farm-survey",
    title: "Farm Survey",
    image: "/Drone/farm survey.jpg",
    description:
      "High-resolution aerial surveys for field inspection, planning, and crop assessment.",
    benefits: [
      "High-resolution imagery",
      "Fast field inspection",
      "Accurate reports",
    ],
    crops: "All Crops",
    coverage: "25–60 acres/session",
    priceFrom: 550,
  },
  {
    id: "ndvi-mapping",
    title: "NDVI Mapping",
    image: "/Drone/NDVI mapping.jpg",
    description:
      "Multispectral NDVI maps help identify crop stress, disease, and nutrient deficiencies.",
    benefits: [
      "Crop health analysis",
      "Early stress detection",
      "Precision farming",
    ],
    crops: "Rice, Wheat, Cotton, Horticulture",
    coverage: "30–50 acres/session",
    priceFrom: 600,
  },
  {
    id: "land-mapping",
    title: "Land Mapping",
    image: "/Drone/land mapping.png",
    description:
      "Drone-based land surveys with orthomosaic maps and accurate boundary measurements.",
    benefits: [
      "Boundary mapping",
      "GIS Compatible",
      "Accurate acreage",
    ],
    crops: "Agricultural Land",
    coverage: "Varies by terrain",
    priceFrom: 700,
  },
  {
    id: "orchard-spraying",
    title: "Orchard Spraying",
    image: "/Drone/orchard spraying.jpg",
    description:
      "Specialized drone spraying for mango, citrus, grapes, and other orchard crops.",
    benefits: [
      "Canopy penetration",
      "Uniform spraying",
      "Reduced chemical usage",
    ],
    crops: "Mango, Citrus, Grapes, Apple",
    coverage: "3–6 acres/hour",
    priceFrom: 650,
  },
  {
    id: "crop-monitoring",
    title: "Crop Monitoring",
    image: "/Drone/DJI MAVIC 3M.jpg",
    description:
      "Monitor crop health using multispectral imaging to detect diseases and nutrient deficiencies early.",
    benefits: [
      "Health monitoring",
      "Disease detection",
      "Yield optimization",
    ],
    crops: "All Crops",
    coverage: "20–40 acres/session",
    priceFrom: 350,
  },
  {
    id: "water-stress",
    title: "Water Stress Detection",
    image: "/Drone/DJI TERRA.webp",
    description:
      "Advanced drone mapping helps identify water stress zones and improve irrigation planning.",
    benefits: [
      "Water conservation",
      "Irrigation planning",
      "Precision analysis",
    ],
    crops: "All Irrigated Crops",
    coverage: "25–40 acres/session",
    priceFrom: 580,
  },
  {
    id: "fertilizer-spraying",
    title: "Fertilizer Spraying",
    image: "/Drone/DJI AGRAS T40.webp",
    description:
      "Apply liquid fertilizers accurately with agricultural drones for uniform crop nutrition.",
    benefits: [
      "Uniform application",
      "Less fertilizer waste",
      "Higher efficiency",
    ],
    crops: "Rice, Maize, Sugarcane",
    coverage: "10–15 acres/hour",
    priceFrom: 420,
  },
  {
    id: "pesticide-spraying",
    title: "Pesticide Spraying",
    image: "/Drone/DJI AGRAS T100.webp",
    description:
      "Safe and efficient pesticide application using high-capacity agricultural drones.",
    benefits: [
      "Reduced chemical exposure",
      "Precise spraying",
      "Fast field coverage",
    ],
    crops: "Vegetables, Pulses, Cotton",
    coverage: "10–18 acres/hour",
    priceFrom: 500,
  },
  {
    id: "micronutrient",
    title: "Micronutrient Spraying",
    image: "/Drone/EAVision J150.webp",
    description:
      "Drone-based foliar spraying of zinc, boron, iron, and other micronutrients for healthier crops.",
    benefits: [
      "Targeted nutrition",
      "Fast absorption",
      "Improved crop growth",
    ],
    crops: "Fruits, Vegetables, Cotton",
    coverage: "8–12 acres/hour",
    priceFrom: 480,
  },
];

export type GuestDrone = {
  id: string;
  name: string;
  manufacturer: string;
  image: string;
  imageFallback?: string;
  capacity: string;
  sprayWidth: string;
  batteryLife: string;
  coveragePerHour: string;
  pricePerDay: number;
  salePrice?: number;
  listingType: "rent" | "sale";
  vendorRating: number;
  available: boolean;
  category: string;
  wishlisted?: boolean;
};

const img = (local: string, fallback: string) => ({ image: local, imageFallback: fallback });

export const guestDrones: GuestDrone[] = [
  {
    id: "D1",
    name: "DJI AGRAS T100",
    manufacturer: "DJI",
    image: "/Drone/DJI AGRAS T100.webp",
    capacity: "100 L",
    sprayWidth: "11 m",
    batteryLife: "18 min",
    coveragePerHour: "18 ac/hr",
    pricePerDay: 4500,
    vendorRating: 4.9,
    available: true,
    category: "Agricultural",
    listingType: "rent",
  },
  {
    id: "D2",
    name: "XAG P150 Max",
    manufacturer: "XAG",
    image: "/Drone/XAG P150 Max.jpg",
    capacity: "50 L",
    sprayWidth: "9 m",
    batteryLife: "25 min",
    coveragePerHour: "14 ac/hr",
    pricePerDay: 3200,
    vendorRating: 4.9,
    available: true,
    category: "Agricultural",
    listingType: "rent",
  },
  {
    id: "D3",
    name: "DJI MAVIC 3M",
    manufacturer: "DJI",
    image: "/Drone/DJI MAVIC 3M.jpg",
    capacity: "N/A",
    sprayWidth: "N/A",
    batteryLife: "43 min",
    coveragePerHour: "50 ac/hr",
    pricePerDay: 3800,
    vendorRating: 4.8,
    available: true,
    category: "Survey",
    listingType: "rent",
  },
  {
    id: "D4",
    name: "DJI AGRAS T10",
    manufacturer: "DJI",
    image: "/Drone/DJI AGRAS T10.jpg",
    capacity: "10 L",
    sprayWidth: "5 m",
    batteryLife: "18 min",
    coveragePerHour: "6 ac/hr",
    pricePerDay: 1800,
    vendorRating: 4.6,
    available: false,
    category: "Agricultural",
    listingType: "rent",
  },
  {
    id: "D5",
    name: "EAVision J150",
    manufacturer: "EAVision",
    image: "/Drone/EAVision J150.webp",
    capacity: "30 L",
    sprayWidth: "7 m",
    batteryLife: "22 min",
    coveragePerHour: "6 ac/hr",
    pricePerDay: 2900,
    vendorRating: 4.7,
    available: true,
    category: "Orchard",
    listingType: "rent",
  },
  {
    id: "D6",
    name: "DJI TERRA",
    manufacturer: "DJI",
    image: "/Drone/DJI TERRA.webp",
    capacity: "N/A",
    sprayWidth: "N/A",
    batteryLife: "N/A",
    coveragePerHour: "100 ac/hr",
    pricePerDay: 4200,
    vendorRating: 4.9,
    available: true,
    category: "Mapping",
    listingType: "rent",
  },

  // Sales

  {
    id: "S1",
    name: "DJI AGRAS T40",
    manufacturer: "DJI",
    image: "/Drone/DJI AGRAS T40.webp",
    capacity: "40 L",
    sprayWidth: "7 m",
    batteryLife: "22 min",
    coveragePerHour: "12 ac/hr",
    pricePerDay: 0,
    salePrice: 485000,
    vendorRating: 4.9,
    available: true,
    category: "Agricultural",
    listingType: "sale",
  },
  {
    id: "S2",
    name: "DJI Mini 4 Pro",
    manufacturer: "DJI",
    image: "/Drone/DJI Mini 4 Pro.png",
    capacity: "N/A",
    sprayWidth: "N/A",
    batteryLife: "34 min",
    coveragePerHour: "N/A",
    pricePerDay: 0,
    salePrice: 112000,
    vendorRating: 4.8,
    available: true,
    category: "Cinematic",
    listingType: "sale",
  },
  {
    id: "S3",
    name: "DJI FPV Combo",
    manufacturer: "DJI",
    image: "/Drone/DJI FPV Combo.png",
    capacity: "N/A",
    sprayWidth: "N/A",
    batteryLife: "20 min",
    coveragePerHour: "N/A",
    pricePerDay: 0,
    salePrice: 135000,
    vendorRating: 4.7,
    available: true,
    category: "Action",
    listingType: "sale",
  },
  {
    id: "S4",
    name: "Wing Delivery Drone",
    manufacturer: "Wing",
    image: "/Drone/Wing Delivery Drone.webp",
    capacity: "3 kg payload",
    sprayWidth: "N/A",
    batteryLife: "30 min",
    coveragePerHour: "N/A",
    pricePerDay: 0,
    salePrice: 220000,
    vendorRating: 4.5,
    available: true,
    category: "Delivery",
    listingType: "sale",
  },
  {
    id: "S5",
    name: "DJI M350 RTK",
    manufacturer: "DJI",
    image: "/Drone/DJI M350 RTK.png",
    capacity: "N/A",
    sprayWidth: "N/A",
    batteryLife: "55 min",
    coveragePerHour: "60 ac/hr",
    pricePerDay: 0,
    salePrice: 520000,
    vendorRating: 4.9,
    available: true,
    category: "Inspection",
    listingType: "sale",
  },
  {
    id: "S6",
    name: "XAG P100 Pro",
    manufacturer: "XAG",
    image: "/Drone/XAG P100 PRO.webp",
    capacity: "40 L",
    sprayWidth: "8 m",
    batteryLife: "24 min",
    coveragePerHour: "11 ac/hr",
    pricePerDay: 0,
    salePrice: 395000,
    vendorRating: 4.8,
    available: true,
    category: "Agricultural",
    listingType: "sale",
  },
];

export const droneCategories = ["All", "Agricultural", "Survey", "Orchard", "Mapping", "Cinematic", "Action", "Delivery", "Inspection"];

export const stats = [
  { label: "Farmers Served", value: 12500, suffix: "+" },
  { label: "Acres Covered", value: 85000, suffix: "+" },
  { label: "Certified Pilots", value: 320, suffix: "+" },
  { label: "Drone Partners", value: 85, suffix: "+" },
  { label: "Successful Missions", value: 42000, suffix: "+" },
];

export const testimonials = [
  { name: "Ramesh Patil", location: "Nagpur, MH", rating: 5, text: "Booked spraying in 10 minutes. Pilot arrived on time and saved us two days of manual work." },
  { name: "Sunita Devi", location: "Wardha, MH", rating: 5, text: "NDVI mapping helped us fix irrigation issues early. Highly recommend AgriPilot." },
  { name: "Vikram Singh", location: "Amravati, MH", rating: 4, text: "As a pilot, I get steady nearby jobs and transparent payments. Great platform." },
];

export const partnerLogos = ["IFFCO", "Mahindra", "NABARD", "Kisan Network", "AgriTech India"];

export const aboutGoals = [
  "Modernize Agriculture",
  "Increase Farm Productivity",
  "Reduce Chemical Waste",
  "Make Drone Technology Accessible",
  "Support Farmers",
  "Create Employment for Drone Pilots",
];

export const footerLinks = {
  quick: ["Home", "Services", "Drones", "About Us"],
  services: ["Crop Spraying", "Farm Survey", "Drone Rental", "Pilot Booking"],
  legal: ["Privacy Policy", "Terms & Conditions", "FAQs"],
};
