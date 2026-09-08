import React from "react";
import {
  Utensils, Plane, Hotel, Dumbbell, HeartPulse, Stethoscope, Wallet,
  ShoppingBag, Laptop, Baby, GraduationCap, Home, Car, Sparkles,
  Clapperboard, PawPrint, Shirt, Smartphone, Leaf, LayoutGrid,
  SlidersHorizontal, Gift, PiggyBank, Briefcase, Store, BrainCircuit,
  Code2, ShieldCheck, BarChart3, BellRing, Headset, FilePen, Languages,
  Gem, CreditCard, MapPin, Globe, Coins, Clock, UserPlus, Users, Rocket,
} from "lucide-react";

const ICONS = {
  utensils: Utensils,
  plane: Plane,
  hotel: Hotel,
  dumbbell: Dumbbell,
  "heart-pulse": HeartPulse,
  stethoscope: Stethoscope,
  wallet: Wallet,
  "shopping-bag": ShoppingBag,
  laptop: Laptop,
  baby: Baby,
  "graduation-cap": GraduationCap,
  home: Home,
  car: Car,
  sparkles: Sparkles,
  clapperboard: Clapperboard,
  "paw-print": PawPrint,
  shirt: Shirt,
  smartphone: Smartphone,
  leaf: Leaf,
  "layout-grid": LayoutGrid,
  "sliders-horizontal": SlidersHorizontal,
  gift: Gift,
  "piggy-bank": PiggyBank,
  briefcase: Briefcase,
  store: Store,
  "brain-circuit": BrainCircuit,
  "code-2": Code2,
  "shield-check": ShieldCheck,
  "bar-chart-3": BarChart3,
  "bell-ring": BellRing,
  headset: Headset,
  "file-pen": FilePen,
  languages: Languages,
  gem: Gem,
  "credit-card": CreditCard,
  "map-pin": MapPin,
  globe: Globe,
  coins: Coins,
  clock: Clock,
  "user-plus": UserPlus,
  users: Users,
  rocket: Rocket,
};

export default function LIcon({ name, className = "w-5 h-5" }) {
  const Cmp = ICONS[name] || Sparkles;
  return <Cmp className={className} aria-hidden="true" />;
}