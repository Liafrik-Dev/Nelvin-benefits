import React, { useState } from "react";
import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  Store,
  Clock,
  Tag,
  Globe2,
  Crown,
  Star,
  Bell,
  CreditCard,
  LifeBuoy,
  BarChart3,
  Settings,
  ShieldCheck,
  ScrollText,
  DatabaseBackup,
  Menu,
  X,
  ChevronLeft,
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import Avatar from "@/components/nelvin/Avatar";

const NAV = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard, end: true },
  { label: "Users", path: "/admin/users", icon: Users },
  { label: "Companies", path: "/admin/companies", icon: Building2 },
  { label: "Businesses", path: "/admin/businesses", icon: Store },
  { label: "Pending Businesses", path: "/admin/pending-businesses", icon: Clock },
  { label: "Offers", path: "/admin/offers", icon: Tag },
  { label: "Pending Offers", path: "/admin/pending-offers", icon: Clock },
  { label: "Categories", path: "/admin/categories", icon: LayoutDashboard },
  { label: "Countries", path: "/admin/countries", icon: Globe2 },
  { label: "Membership Plans", path: "/admin/membership-plans", icon: Crown },
  { label: "Reviews", path: "/admin/reviews", icon: Star, phase: "Phase 2" },
  { label: "Notifications", path: "/admin/notifications", icon: Bell, phase: "Phase 2" },
  { label: "Payments", path: "/admin/payments", icon: CreditCard },
  { label: "Support Tickets", path: "/admin/support", icon: LifeBuoy, phase: "Phase 2" },
  { label: "Analytics", path: "/admin/analytics", icon: BarChart3, phase: "Phase 3" },
  { label: "Settings", path: "/admin/settings", icon: Settings },
  { label: "Admin Roles & Permissions", path: "/admin/roles", icon: ShieldCheck, phase: "Phase 3" },
  { label: "Audit Logs", path: "/admin/audit-logs", icon: ScrollText, phase: "Phase 3" },
  { label: "Backups", path: "/admin/backups", icon: DatabaseBackup, phase: "Phase 3" },
];

function adminAllowed(user) {
  const r = (user?.role || "").toLowerCase();
  return r === "admin" || r === "founder" || r === "staff";
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!adminAllowed(user)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-forest-secondary/60 px-4">
        <div className="text-center max-w-md">
          <ShieldCheck className="w-10 h-10 text-[#F5F1E8]/60 mx-auto mb-3" />
          <h1 className="text-xl font-bold text-ivory mb-2">Admin access required</h1>
          <p className="text-sm text-ivory-muted mb-4">
            Your account does not have permission to view the admin backend.
          </p>
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-[#D6B56D] font-semibold">
            <ChevronLeft className="w-4 h-4" /> Back to site
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-forest flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 z-40 lg:z-10 h-screen w-72 bg-[#062B23] border-r border-white/10 flex-shrink-0 transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-16 px-5 flex items-center justify-between border-b border-white/10">
          <Link to="/admin" className="flex items-center gap-2" onClick={() => setSidebarOpen(false)}>
            <div className="w-8 h-8 bg-[#103F35] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-bold text-ivory font-heading">Nelvin Admin</span>
          </Link>
          <button className="lg:hidden text-ivory-dim" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="px-3 py-4 overflow-y-auto h-[calc(100vh-4rem)] scrollbar-hide">
          {NAV.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                `flex items-center justify-between gap-2 px-3 py-2 rounded-lg text-sm mb-0.5 transition-colors ${
                  isActive
                    ? "bg-[#0A3A2F] text-ivory font-semibold"
                    : "text-ivory-muted hover:bg-forest-secondary/60"
                }`
              }
            >
              <span className="flex items-center gap-2.5">
                <item.icon className="w-4 h-4" />
                {item.label}
              </span>
              {item.phase && (
                <span className="text-[10px] uppercase tracking-wide text-ivory-dim bg-white/10 px-1.5 py-0.5 rounded">
                  {item.phase}
                </span>
              )}
            </NavLink>
          ))}
        </nav>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="sticky top-0 z-20 bg-emerald-black border-b border-white/10 h-16 px-4 sm:px-6 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <button
              className="lg:hidden text-ivory-muted"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="w-6 h-6" />
            </button>
            <Link to="/" className="text-sm text-ivory-muted hover:text-ivory flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" /> View site
            </Link>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-ivory leading-tight">
                {user?.full_name || "Admin"}
              </p>
              <p className="text-xs text-ivory-dim capitalize">{user?.role || ""}</p>
            </div>
            <Avatar
              user={user}
              className="w-9 h-9"
              fallbackClassName="bg-[#D6B56D] text-white font-semibold text-sm"
            />
            <button
              onClick={() => logout(true)}
              className="text-xs text-ivory-muted hover:text-rose-600 ml-1"
            >
              Sign out
            </button>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}