import React from "react";
import { Link, useLocation } from "react-router-dom";
import CurrencySelector from "@/components/shared/CurrencySelector";
import {
  LayoutDashboard, Compass, Grid, ShoppingBag, Search, Heart,
  MapPin, Gift, Wallet, Ticket, ShieldCheck, Sparkles, HeartPulse,
  DollarSign, Smile, Bell, User, HelpCircle
} from "lucide-react";

export const EMPLOYEE_NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { id: "explore", label: "Explore", path: "/explore", icon: Compass },
  { id: "categories", label: "Categories", path: "/categories", icon: Grid },
  { id: "marketplace", label: "Marketplace", path: "/marketplace", icon: ShoppingBag },
  { id: "search", label: "Search", path: "/search", icon: Search },
  { id: "favorites", label: "Favorites", path: "/favorites", icon: Heart },
  { id: "nearby", label: "Nearby", path: "/nearby", icon: MapPin },
  { id: "rewards", label: "Rewards", path: "/rewards", icon: Gift },
  { id: "wallet", label: "Wallet & Cashback", path: "/wallet", icon: Wallet },
  { id: "vouchers", label: "Vouchers", path: "/vouchers", icon: Ticket },
  { id: "benefits", label: "My Benefits", path: "/benefits", icon: ShieldCheck },
  { id: "flexible-benefits", label: "Flexible Benefits", path: "/flexible-benefits", icon: Sparkles },
  { id: "wellness", label: "Health & Wellness", path: "/wellness", icon: HeartPulse },
  { id: "financial-wellness", label: "Financial Wellness", path: "/financial-wellness", icon: DollarSign },
  { id: "lifestyle", label: "Family & Lifestyle", path: "/lifestyle", icon: Smile },
  { id: "notifications", label: "Notifications", path: "/notifications", icon: Bell },
  { id: "profile", label: "Profile", path: "/profile", icon: User },
  { id: "support", label: "Help & Support", path: "/support", icon: HelpCircle },
];

export default function EmployeeNav() {
  const location = useLocation();

  return (
    <div className="bg-white border-b border-gray-100 shadow-sm sticky top-[72px] z-30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1 overflow-x-auto py-2.5 scrollbar-hide flex-1">
          {EMPLOYEE_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  isActive
                    ? "bg-[#082F24] text-[#B8FF00]"
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
        <CurrencySelector className="shrink-0 bg-[#082F24] border-none" />
      </div>
    </div>
  );
}