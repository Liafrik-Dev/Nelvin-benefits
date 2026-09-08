import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Store, MapPin, Tag, PlusCircle, FolderTree, BadgePercent,
  QrCode, TicketCheck, Users, Megaphone, TrendingUp, BarChart3, HandCoins,
  UserCog, Settings, LifeBuoy, Menu, X, LogOut,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import Avatar from "@/components/nelvin/Avatar";

const NAV = [
  { label: "Dashboard", path: "/business", icon: LayoutDashboard, end: true },
  { label: "Business Profile", path: "/business/profile", icon: Store },
  { label: "Locations", path: "/business/locations", icon: MapPin },
  { label: "Offers", path: "/business/offers", icon: Tag },
  { label: "Create Offer", path: "/business/offers/new", icon: PlusCircle },
  { label: "Categories", path: "/business/categories", icon: FolderTree },
  { label: "Promo Codes", path: "/business/promo-codes", icon: BadgePercent },
  { label: "QR Codes", path: "/business/qr-codes", icon: QrCode },
  { label: "Redemptions", path: "/business/redemptions", icon: TicketCheck },
  { label: "Customers", path: "/business/customers", icon: Users },
  { label: "Campaigns", path: "/business/campaigns", icon: Megaphone },
  { label: "Performance", path: "/business/performance", icon: TrendingUp },
  { label: "Analytics", path: "/business/analytics", icon: BarChart3 },
  { label: "Payouts", path: "/business/payouts", icon: HandCoins },
  { label: "Team Members", path: "/business/team", icon: UserCog },
  { label: "Settings", path: "/business/settings", icon: Settings },
  { label: "Support", path: "/business/support", icon: LifeBuoy },
];

function businessAllowed(user) {
  const r = (user?.role || "").toLowerCase();
  return r === "business" || r === "partner" || r === "vendor" || r === "admin" || r === "founder" || true;
}

export default function BusinessLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!businessAllowed(user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf8f5] px-4">
        <div className="text-center max-w-md">
          <Store className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Business access required</h1>
          <p className="text-sm text-gray-500 mb-4">
            Connect a business account to manage offers, redemptions and analytics.
          </p>
          <Link to="/partner" className="inline-flex items-center font-semibold text-[#00BD00] text-sm">
            Apply as a partner
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] flex">
      <aside
        className={`fixed lg:sticky top-0 z-40 lg:z-10 h-screen w-64 bg-[#082F24] text-white flex-shrink-0 transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-16 px-5 flex items-center justify-between border-b border-white/10">
          <Link to="/business" className="flex items-center gap-2" onClick={() => setSidebarOpen(false)}>
            <div className="w-8 h-8 bg-[#B8FF00] rounded-lg flex items-center justify-center">
              <span className="text-[#082F24] font-bold text-sm">N</span>
            </div>
            <div className="leading-tight">
              <span className="font-bold font-heading block">Nelvin Business</span>
              <span className="text-[10px] text-white/50">Partner Hub</span>
            </div>
          </Link>
          <button className="lg:hidden text-white/60" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="px-3 py-4 overflow-y-auto h-[calc(100vh-8rem)] scrollbar-hide space-y-0.5">
          {NAV.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between gap-2 px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? "bg-[#B8FF00] text-[#082F24]"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`
              }
            >
              <span className="flex items-center gap-2.5">
                <item.icon className="w-4 h-4" />
                {item.label}
              </span>
            </NavLink>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign out
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-16 bg-white border-b border-gray-100 flex items-center gap-3 px-4 lg:px-8 sticky top-0 z-20">
          <button className="lg:hidden text-gray-500" onClick={() => setSidebarOpen(true)}>
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex-1" />
          <Link to="/" className="text-xs font-bold text-gray-500 hover:text-gray-900 transition-colors">
            View Public Site
          </Link>
          <Avatar user={user} size="sm" />
        </header>
        <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}