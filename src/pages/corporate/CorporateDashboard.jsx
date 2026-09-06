import { db } from "@/services/api/base44Client";

import React, { useState, useEffect, useCallback } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";

import { useAuth } from "@/lib/AuthContext";
import MembershipCard from "@/components/corporate/MembershipCard";
import CorporateDashboardHome from "@/components/corporate/CorporateDashboardHome";
import EmployeesPanel from "@/components/corporate/EmployeesPanel";
import DepartmentsPanel from "@/components/corporate/DepartmentsPanel";
import BenefitsPanel from "@/components/corporate/BenefitsPanel";
import OfferUsagePanel from "@/components/corporate/OfferUsagePanel";
import SavingsPanel from "@/components/corporate/SavingsPanel";
import MembershipPanel from "@/components/corporate/MembershipPanel";
import ReportsPanel from "@/components/corporate/ReportsPanel";
import AnalyticsPanel from "@/components/corporate/AnalyticsPanel";
import BillingPanel from "@/components/corporate/BillingPanel";
import NotificationsPanel from "@/components/corporate/NotificationsPanel";
import CompanySettingsPanel from "@/components/corporate/CompanySettingsPanel";
import {
  LayoutDashboard, Users, Boxes, Gift, BarChart3, PiggyBank, CreditCard,
  FileText, PieChart, Receipt, Bell, Settings as SettingsIcon,
  Building2, LogOut, RefreshCw,
} from "lucide-react";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "employees", label: "Employees", icon: Users },
  { id: "departments", label: "Departments", icon: Boxes },
  { id: "benefits", label: "Benefits", icon: Gift },
  { id: "offer-usage", label: "Offer Usage", icon: BarChart3 },
  { id: "savings", label: "Savings", icon: PiggyBank },
  { id: "membership", label: "Membership", icon: CreditCard },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "analytics", label: "Analytics", icon: PieChart },
  { id: "billing", label: "Billing", icon: Receipt },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "settings", label: "Settings", icon: SettingsIcon },
];

export default function CorporateDashboard() {
  const { user, isAuthenticated, isLoadingAuth, logout, checkUserAuth } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("dashboard");
  const [company, setCompany] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showWelcome, setShowWelcome] = useState(() => {
    try { return !sessionStorage.getItem("nelvin_corporate_welcomed"); } catch { return false; }
  });
  const dismissWelcome = () => {
    try { sessionStorage.setItem("nelvin_corporate_welcomed", "1"); } catch {}
    setShowWelcome(false);
  };

  const load = useCallback(async () => {
    setLoading(true);
    if (!user?.company_id) { setCompany(null); setEmployees([]); setLoading(false); return; }
    try {
      const c = await db.entities.Company.get(user.company_id);
      setCompany(c);
      const emps = await db.entities.Employee.filter({ company_id: c.id }, "-created_date", 500).catch(() => []);
      setEmployees(emps);
    } catch { setCompany(null); setEmployees([]); }
    setLoading(false);
  }, [user?.company_id, refreshKey]);

  useEffect(() => { if (!isLoadingAuth) load(); }, [isLoadingAuth, load]);

  const refresh = async () => { await checkUserAuth(); setRefreshKey((k) => k + 1); };

  if (isLoadingAuth) return <div className="min-h-screen bg-gray-50" />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-emerald-600 rounded-full animate-spin" />
    </div>
  );

  if (!user?.company_id || !company) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md text-center bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <Building2 className="w-10 h-10 text-emerald-600 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900">No company linked yet</h1>
          <p className="text-sm text-gray-500 mt-2 mb-6">Sign up your company, or your admin will invite you with your work email.</p>
          <button onClick={() => navigate("/corporate-signup")} className="bg-emerald-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold">Sign Up Your Company</button>
        </div>
      </div>
    );
  }

  // Dashboard access gate — dashboard_access must be true to load the dashboard.
  // This is separate from company.status and payment.status; it only flips via
  // admin payment-confirmation (self-serve) or application-approval (custom pricing).
  if (!company.dashboard_access) {
    const isLead = company.activation_type === "custom_pricing";
    const isRejected = company.status === "rejected" || company.application_status === "rejected";
    const isSuspended = company.status === "suspended";
    let title, message, action;
    if (isRejected) {
      title = isLead ? "Application declined" : "Payment unsuccessful";
      message = company.rejection_reason
        ? `Reason: ${company.rejection_reason}`
        : isLead
          ? "Unfortunately your application wasn't approved at this time. Please contact us for details."
          : "Your payment couldn't be confirmed. Please try again or contact support.";
      action = (
        <div className="flex gap-3 justify-center">
          {!isLead && <button onClick={() => navigate("/corporate-signup")} className="bg-emerald-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold">Try again</button>}
          <button onClick={() => navigate("/")} className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-full text-sm font-semibold">Return home</button>
        </div>
      );
    } else if (isSuspended) {
      title = "Account suspended";
      message = "Your corporate account is currently suspended. Please contact your Nelvin account manager.";
      action = <button onClick={() => navigate("/")} className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-full text-sm font-semibold">Return home</button>;
    } else if (isLead) {
      title = "Application under review";
      message = "Thanks for your interest! Our team is reviewing your application and will reach out within 1 business day to finalize your custom plan. You'll get dashboard access automatically once approved.";
      action = <button onClick={() => navigate("/")} className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-full text-sm font-semibold">Return home</button>;
    } else {
      title = "Confirming your payment…";
      message = "We're verifying your payment. This usually takes a few minutes. You'll get access automatically once confirmed.";
      action = (
        <button onClick={refresh} className="bg-emerald-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold inline-flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      );
    }
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md text-center bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          {isRejected || isSuspended ? (
            <Building2 className="w-10 h-10 text-gray-400 mx-auto mb-4" />
          ) : isLead ? (
            <Users className="w-10 h-10 text-emerald-600 mx-auto mb-4" />
          ) : (
            <RefreshCw className="w-10 h-10 text-emerald-600 mx-auto mb-4 animate-spin" />
          )}
          <h1 className="text-xl font-bold text-gray-900">{title}</h1>
          <p className="text-sm text-gray-500 mt-2 mb-6">{message}</p>
          {action}
        </div>
      </div>
    );
  }

  const isHRAdmin = user.role === "hr_admin" || user.role === "admin" || user.role === "founder" || (company.created_by_id === user.id);

  // Employee (subscriber) view — simpler landing
  if (!isHRAdmin) {
    const me = employees.find((e) => e.user_id === user.id) || {};
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              {company.branding_logo_url || company.logo_url ? (
                <img src={company.branding_logo_url || company.logo_url} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0">{(company.name || "?").slice(0, 1)}</div>
              )}
              <div className="min-w-0">
                <p className="font-bold text-gray-900 text-sm truncate">{company.name}</p>
                <p className="text-xs text-gray-400 truncate">Your benefits portal</p>
              </div>
            </div>
            <button onClick={() => logout(true)} className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 px-2 py-1">
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
          </div>
        </header>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {company.branding_welcome_message && (
            <div className="bg-white border border-gray-100 rounded-2xl p-6">
              <p className="text-xs uppercase tracking-wider text-emerald-700 font-semibold mb-1">Welcome</p>
              <p className="text-gray-700">{company.branding_welcome_message}</p>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MembershipCard employee={{ ...me, user_name: user.full_name, user_email: user.email, status: "active", membership_tier: company.membership_tier }} company={company} accent={company.branding_primary_color || "#059669"} />
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h3 className="font-semibold text-gray-900 mb-3">Quick links</h3>
              <div className="space-y-2">
                <Link to="/offers" className="block p-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm font-medium text-gray-700">Browse offers</Link>
                <Link to="/dashboard" className="block p-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm font-medium text-gray-700">My dashboard & savings</Link>
                <Link to="/profile" className="block p-3 rounded-lg bg-gray-50 hover:bg-gray-100 text-sm font-medium text-gray-700">My profile</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // HR Admin view — pending (10+ lead awaiting approval)
  if (company.status !== "approved") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md text-center bg-white rounded-2xl border border-gray-100 p-8 shadow-sm">
          <Users className="w-10 h-10 text-emerald-600 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900">Thanks — we'll be in touch within 1 business day.</h1>
          <p className="text-sm text-gray-500 mt-2 mb-6">Our team is reaching out to schedule a call and set up your company dashboard.</p>
          <button onClick={() => logout(true)} className="bg-emerald-600 text-white px-6 py-2.5 rounded-full text-sm font-semibold">Back to home</button>
        </div>
      </div>
    );
  }

  const accent = company.branding_primary_color || "#059669";

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-100 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {company.branding_logo_url || company.logo_url ? (
              <img src={company.branding_logo_url || company.logo_url} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
            ) : (
              <div className="w-10 h-10 rounded-lg flex items-center justify-center font-bold flex-shrink-0" style={{ background: `${accent}22`, color: accent }}>
                {(company.name || "?").slice(0, 1)}
              </div>
            )}
            <div className="min-w-0">
              <p className="font-bold text-gray-900 text-sm leading-tight truncate">{company.name}</p>
              <p className="text-xs text-gray-400 truncate">{company.membership_tier || "Corporate"} · {company.employee_count || company.seats_purchased || 0} employees</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={refresh} title="Refresh" className="p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100"><RefreshCw className="w-4 h-4" /></button>
            <Link to="/" className="text-xs text-gray-500 hover:text-gray-800 px-3 py-1">View site</Link>
            <button onClick={() => logout(true)} className="text-xs text-gray-500 hover:text-gray-800 flex items-center gap-1 px-2 py-1"><LogOut className="w-3.5 h-3.5" /> Sign out</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 lg:gap-8">
        <aside className="hidden lg:block">
          <nav className="space-y-1 sticky top-20">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  tab === t.id ? "bg-emerald-50 text-emerald-700" : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                }`}>
                <t.icon className="w-4 h-4" /> {t.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="lg:hidden flex gap-1 -mx-4 px-4 pb-3 overflow-x-auto border-b border-gray-100 mb-4 scrollbar-hide">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                tab === t.id ? "bg-emerald-50 text-emerald-700" : "text-gray-600 bg-gray-100"
              }`}>
              <t.icon className="w-3.5 h-3.5" /> {t.label}
            </button>
          ))}
        </div>

        <main className="min-w-0">
          {showWelcome && (
            <div className="mb-4 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center justify-between gap-3">
              <div>
                <p className="font-bold text-emerald-800 text-sm">Welcome to Nelvin, {company.name}!</p>
                <p className="text-xs text-emerald-700">Your corporate benefits dashboard is ready. Invite your team to get started.</p>
              </div>
              <button onClick={dismissWelcome} className="text-emerald-600 hover:text-emerald-800 text-xs font-semibold whitespace-nowrap">Dismiss</button>
            </div>
          )}
          {tab === "dashboard" && <CorporateDashboardHome company={company} employees={employees} onGoEmployees={() => setTab("employees")} />}
          {tab === "employees" && <EmployeesPanel company={company} employees={employees} onChanged={refresh} />}
          {tab === "departments" && <DepartmentsPanel company={company} employees={employees} onChanged={refresh} />}
          {tab === "benefits" && <BenefitsPanel company={company} />}
          {tab === "offer-usage" && <OfferUsagePanel company={company} employees={employees} />}
          {tab === "savings" && <SavingsPanel company={company} employees={employees} />}
          {tab === "membership" && <MembershipPanel company={company} employees={employees} />}
          {tab === "reports" && <ReportsPanel company={company} employees={employees} />}
          {tab === "analytics" && <AnalyticsPanel company={company} employees={employees} />}
          {tab === "billing" && <BillingPanel company={company} onChanged={refresh} />}
          {tab === "notifications" && <NotificationsPanel company={company} />}
          {tab === "settings" && <CompanySettingsPanel company={company} onChanged={refresh} />}
        </main>
      </div>
    </div>
  );
}