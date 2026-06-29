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
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=500&fit=crop",
    description: "Uniform aerial application across large fields with minimal crop damage and reduced labour costs.",
    benefits: ["Even coverage", "Faster than manual", "Less crop trampling"],
    crops: "Wheat, Rice, Cotton, Soybean",
    coverage: "8–12 acres/hour",
    priceFrom: 450,
  },
  {
    id: "pesticide",
    title: "Pesticide Spraying",
    image: "https://images.unsplash.com/photo-1574943320322-7bc1a4a50893?w=800&h=500&fit=crop",
    description: "DGCA-compliant pilots apply pesticides with calibrated droplet size and drift control.",
    benefits: ["Certified pilots", "Reduced chemical waste", "Safe handling"],
    crops: "Vegetables, Pulses, Horticulture",
    coverage: "6–10 acres/hour",
    priceFrom: 500,
  },
  {
    id: "fertilizer",
    title: "Fertilizer Spraying",
    image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=500&fit=crop",
    description: "Liquid and granular fertilizer application tailored to crop stage and soil conditions.",
    benefits: ["Stage-based dosing", "Uniform spread", "Time efficient"],
    crops: "Rice, Maize, Sugarcane",
    coverage: "10–15 acres/hour",
    priceFrom: 420,
  },
  {
    id: "micronutrient",
    title: "Micronutrient Spraying",
    image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=500&fit=crop",
    description: "Foliar micronutrient sprays for zinc, boron, and other deficiencies detected in fields.",
    benefits: ["Targeted nutrition", "Quick absorption", "Cost effective"],
    crops: "Fruits, Vegetables, Cotton",
    coverage: "8–12 acres/hour",
    priceFrom: 480,
  },
  {
    id: "monitoring",
    title: "Crop Monitoring",
    image: "https://images.unsplash.com/photo-1536657464919-892534f60d6e?w=800&h=500&fit=crop",
    description: "Regular flyovers to assess crop health, pest pressure, and irrigation needs.",
    benefits: ["Early problem detection", "Visual reports", "Season tracking"],
    crops: "All major crops",
    coverage: "20–40 acres/session",
    priceFrom: 350,
  },
  {
    id: "ndvi",
    title: "NDVI Mapping",
    image: "https://images.unsplash.com/photo-1586771107445-d3ca838129ff?w=800&h=500&fit=crop",
    description: "Multispectral NDVI maps highlight stressed zones for precision intervention.",
    benefits: ["Zone-wise insights", "Data-driven decisions", "Exportable maps"],
    crops: "Wheat, Rice, Horticulture",
    coverage: "30–50 acres/session",
    priceFrom: 600,
  },
  {
    id: "survey",
    title: "Farm Survey",
    image: "https://images.unsplash.com/photo-1500595046743-d52fa8c41348?w=800&h=500&fit=crop",
    description: "Orthomosaic surveys for acreage verification, planning, and insurance documentation.",
    benefits: ["Accurate acreage", "3D terrain optional", "Insurance ready"],
    crops: "All farmland types",
    coverage: "25–60 acres/session",
    priceFrom: 550,
  },
  {
    id: "land-map",
    title: "Land Mapping",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=500&fit=crop",
    description: "Boundary demarcation and contour mapping for irrigation and land records.",
    benefits: ["Clear boundaries", "Contour lines", "GIS export"],
    crops: "N/A — land focused",
    coverage: "Varies by terrain",
    priceFrom: 700,
  },
  {
    id: "seeding",
    title: "Seed Broadcasting",
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=800&h=500&fit=crop",
    description: "Aerial seeding for cover crops and certain cereal varieties on prepared land.",
    benefits: ["Rapid coverage", "Access difficult terrain", "Consistent density"],
    crops: "Rice, Pulses, Cover crops",
    coverage: "5–8 acres/hour",
    priceFrom: 520,
  },
  {
    id: "orchard",
    title: "Orchard Spraying",
    image: "https://images.unsplash.com/photo-1595846519845-68bb3376c617?w=800&h=500&fit=crop",
    description: "Specialized spraying for mango, citrus, and other orchard crops with canopy penetration.",
    benefits: ["Canopy penetration", "Reduced ladder work", "Uniform dosing"],
    crops: "Mango, Citrus, Grapes",
    coverage: "3–6 acres/hour",
    priceFrom: 650,
  },
  {
    id: "water-stress",
    title: "Water Stress Detection",
    image: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&h=500&fit=crop",
    description: "Thermal and multispectral analysis to identify irrigation gaps before yield loss.",
    benefits: ["Save water", "Prevent yield loss", "Irrigation planning"],
    crops: "Irrigated & rainfed crops",
    coverage: "25–40 acres/session",
    priceFrom: 580,
  },
];

export type GuestDrone = {
  id: string;
  name: string;
  manufacturer: string;
  image: string;
  capacity: string;
  sprayWidth: string;
  batteryLife: string;
  coveragePerHour: string;
  pricePerDay: number;
  vendorRating: number;
  available: boolean;
  category: string;
  wishlisted?: boolean;
};

export const guestDrones: GuestDrone[] = [
  {
    id: "D1", name: "AgriStar X500", manufacturer: "DJI", image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&h=400&fit=crop",
    capacity: "40 L", sprayWidth: "7 m", batteryLife: "22 min", coveragePerHour: "10 ac/hr",
    pricePerDay: 2400, vendorRating: 4.8, available: true, category: "Spray",
  },
  {
    id: "D2", name: "CropFlyer Pro", manufacturer: "XAG", image: "https://images.unsplash.com/photo-1508614589041-895b88991dcc?w=600&h=400&fit=crop",
    capacity: "50 L", sprayWidth: "8 m", batteryLife: "25 min", coveragePerHour: "12 ac/hr",
    pricePerDay: 3000, vendorRating: 4.9, available: true, category: "Spray",
  },
  {
    id: "D3", name: "SurveyDrone HD", manufacturer: "DJI", image: "https://images.unsplash.com/photo-1527977966376-1c8408f11f99?w=600&h=400&fit=crop",
    capacity: "N/A", sprayWidth: "N/A", batteryLife: "35 min", coveragePerHour: "40 ac/hr",
    pricePerDay: 3500, vendorRating: 4.7, available: true, category: "Survey",
  },
  {
    id: "D4", name: "SprayMaster 8L", manufacturer: "DJI", image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=600&h=400&fit=crop",
    capacity: "20 L", sprayWidth: "5 m", batteryLife: "18 min", coveragePerHour: "6 ac/hr",
    pricePerDay: 1800, vendorRating: 4.6, available: false, category: "Spray",
  },
  {
    id: "D5", name: "OrchardSpray Pro", manufacturer: "Yamaha", image: "https://images.unsplash.com/photo-1508614589041-895b88991dcc?w=600&h=400&fit=crop",
    capacity: "30 L", sprayWidth: "6 m", batteryLife: "20 min", coveragePerHour: "5 ac/hr",
    pricePerDay: 2800, vendorRating: 4.5, available: true, category: "Orchard",
  },
  {
    id: "D6", name: "MapFly M300", manufacturer: "DJI", image: "https://images.unsplash.com/photo-1527977966376-1c8408f11f99?w=600&h=400&fit=crop",
    capacity: "N/A", sprayWidth: "N/A", batteryLife: "40 min", coveragePerHour: "50 ac/hr",
    pricePerDay: 4200, vendorRating: 4.9, available: true, category: "Mapping",
  },
];

export const droneCategories = ["All", "Spray", "Survey", "Orchard", "Mapping"];

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
