import { db } from "@/services/api/base44Client";

import React, { useState, useEffect, useCallback } from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";

import { useAuth } from "@/lib/AuthContext";
import MembershipCard from "@/components/corporate/MembershipCard";
import CorporateDashboardHome from "@/components/corporate/CorporateDashboardHome";
import EmployeesPanel from "@/components/corporate/EmployeesPanel";
import DepartmentsPanel from "@/components/corporate/DepartmentsPanel";
import TeamsPanel from "@/components/corporate/TeamsPanel";
import LocationsPanel from "@/components/corporate/LocationsPanel";
import BenefitsPanel from "@/components/corporate/BenefitsPanel";
import BudgetsPanel from "@/components/corporate/BudgetsPanel";
import RewardsPanel from "@/components/corporate/RewardsPanel";
import CampaignsPanel from "@/components/corporate/CampaignsPanel";
import CommunicationsPanel from "@/components/corporate/CommunicationsPanel";
import SurveysPanel from "@/components/corporate/SurveysPanel";
import ClaimsPanel from "@/components/corporate/ClaimsPanel";
import OfferUsagePanel from "@/components/corporate/OfferUsagePanel";
import SavingsPanel from "@/components/corporate/SavingsPanel";
import MembershipPanel from "@/components/corporate/MembershipPanel";
import ReportsPanel from "@/components/corporate/ReportsPanel";
import AnalyticsPanel from "@/components/corporate/AnalyticsPanel";
import IntegrationsPanel from "@/components/corporate/IntegrationsPanel";
import BillingPanel from "@/components/corporate/BillingPanel";
import NotificationsPanel from "@/components/corporate/NotificationsPanel";
import CompanySettingsPanel from "@/components/corporate/CompanySettingsPanel";
import RolesPanel from "@/components/corporate/RolesPanel";
import HRAssistantDrawer from "@/components/corporate/HRAssistantDrawer";

import {
  LayoutDashboard, Users, Boxes, MapPin, Gift, PiggyBank, CreditCard,
  FileText, PieChart, Receipt, Bell, Settings as SettingsIcon,
  Building2, LogOut, RefreshCw, Trophy, Sparkles, Megaphone,
  ClipboardList, Link2, Shield, Bot
} from "lucide-react";

const TABS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "employees", label: "Employees", icon: Users },
  { id: "departments", label: "Departments", icon: Boxes },
  { id: "teams", label: "Teams", icon: Users },
  { id: "locations", label: "Locations", icon: MapPin },
  { id: "benefits", label: "Benefits", icon: Gift },
  { id: "budgets", label: "Budgets & Allowances", icon: PiggyBank },
  { id: "rewards", label: "Rewards & Recognition", icon: Trophy },
  { id: "campaigns", label: "Campaigns", icon: Sparkles },
  { id: "communications", label: "Communications", icon: Megaphone },
  { id: "surveys", label: "Surveys", icon: ClipboardList },
  { id: "claims", label: "Claims & Reimbursements", icon: Receipt },
  { id: "offer-usage", label: "Redemptions & Usage", icon: PieChart },
  { id: "reports", label: "Reports", icon: FileText },
  { id: "analytics", label: "Analytics", icon: PieChart },
  { id: "integrations", label: "Integrations", icon: Link2 },
  { id: "billing", label: "Billing", icon: Receipt },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "settings", label: "Company Settings", icon: SettingsIcon },
  { id: "roles", label: "Roles & Permissions", icon: Shield },
];

export default function CorporateDashboard() {
  const { user, isAuthenticated, isLoadingAuth, logout, checkUserAuth } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("dashboard");
  const [company, setCompany] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isAssistantOpen, setIsAssistantOpen] = useState(false);
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

  if (isLoadingAuth) return <div className="min-h-screen bg-[#F9F8F7]" />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (loading) return (
    <div className="min-h-screen bg-[#F9F8F7] flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-[#F1F1F1] border-t-emerald-600 rounded-full animate-spin" />
    </div>
  );

  if (!user?.company_id || !company) {
    return (
      <div className="min-h-screen bg-[#F9F8F7] flex items-center justify-center px-4">
        <div className="max-w-md text-center bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-8 shadow-sm">
          <Building2 className="w-10 h-10 text-[#0866FF] mx-auto mb-4" />
          <h1 className="text-xl font-bold text-ivory">No company linked yet</h1>
          <p className="text-sm text-ivory-muted mt-2 mb-6">Sign up your company, or your admin will invite you with your work email.</p>
          <button onClick={() => navigate("/corporate-signup")} className="bg-[#0866FF] text-white px-6 py-2.5 rounded-full text-sm font-semibold">Sign Up Your Company</button>
        </div>
      </div>
    );
  }

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
          {!isLead && <button onClick={() => navigate("/corporate-signup")} className="bg-[#0866FF] text-white px-6 py-2.5 rounded-full text-sm font-semibold">Try again</button>}
          <button onClick={() => navigate("/")} className="bg-[#F4F4F4] text-ivory px-6 py-2.5 rounded-full text-sm font-semibold">Return home</button>
        </div>
      );
    } else if (isSuspended) {
      title = "Account suspended";
      message = "Your corporate account is currently suspended. Please contact your Nelvin account manager.";
      action = <button onClick={() => navigate("/")} className="bg-[#F4F4F4] text-ivory px-6 py-2.5 rounded-full text-sm font-semibold">Return home</button>;
    } else if (isLead) {
      title = "Application under review";
      message = "Thanks for your interest! Our team is reviewing your application and will reach out within 1 business day to finalize your custom plan. You'll get dashboard access automatically once approved.";
      action = <button onClick={() => navigate("/")} className="bg-[#F4F4F4] text-ivory px-6 py-2.5 rounded-full text-sm font-semibold">Return home</button>;
    } else {
      title = "Confirming your payment…";
      message = "We're verifying your payment. This usually takes a few minutes. You'll get access automatically once confirmed.";
      action = (
        <button onClick={refresh} className="bg-[#0866FF] text-white px-6 py-2.5 rounded-full text-sm font-semibold inline-flex items-center gap-2">
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      );
    }
    return (
      <div className="min-h-screen bg-[#F9F8F7] flex items-center justify-center px-4">
        <div className="max-w-md text-center bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-8 shadow-sm">
          {isRejected || isSuspended ? (
            <Building2 className="w-10 h-10 text-ivory-dim mx-auto mb-4" />
          ) : isLead ? (
            <Users className="w-10 h-10 text-[#0866FF] mx-auto mb-4" />
          ) : (
            <RefreshCw className="w-10 h-10 text-[#0866FF] mx-auto mb-4 animate-spin" />
          )}
          <h1 className="text-xl font-bold text-ivory">{title}</h1>
          <p className="text-sm text-ivory-muted mt-2 mb-6">{message}</p>
          {action}
        </div>
      </div>
    );
  }

  const isHRAdmin = user.role === "hr_admin" || user.role === "admin" || user.role === "founder" || (company.created_by_id === user.id);

  if (!isHRAdmin) {
    const me = employees.find((e) => e.user_id === user.id) || {};
    return (
      <div className="min-h-screen bg-[#F9F8F7]">
        <header className="bg-emerald-black border-b border-[#F1F1F1] sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0">
              {company.branding_logo_url || company.logo_url ? (
                <img src={company.branding_logo_url || company.logo_url} alt="" className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <div className="w-10 h-10 rounded-lg bg-[#F4F4F4] text-[#0866FF] ring-1 ring-[#0866FF]/25 flex items-center justify-center font-bold flex-shrink-0">{(company.name || "?").slice(0, 1)}</div>
              )}
              <div className="min-w-0">
                <p className="font-bold text-ivory text-sm truncate">{company.name}</p>
                <p className="text-xs text-ivory-dim truncate">Your benefits portal</p>
              </div>
            </div>
            <button onClick={() => logout(true)} className="text-xs text-ivory-muted hover:text-ivory flex items-center gap-1 px-2 py-1">
              <LogOut className="w-3.5 h-3.5" /> Sign out
            </button>
          </div>
        </header>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {company.branding_welcome_message && (
            <div className="bg-emerald-black ring-1 ring-[#F1F1F1] border border-transparent rounded-lg p-6">
              <p className="text-xs uppercase tracking-wider text-[#0866FF] font-semibold mb-1">Welcome</p>
              <p className="text-ivory">{company.branding_welcome_message}</p>
            </div>
          )}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <MembershipCard employee={{ ...me, user_name: user.full_name, user_email: user.email, status: "active", membership_tier: company.membership_tier }} company={company} accent={company.branding_primary_color || "#059669"} />
            <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-6">
              <h3 className="font-semibold text-ivory mb-3">Quick links</h3>
              <div className="space-y-2">
                <Link to="/offers" className="block p-3 rounded-lg bg-[#F9F8F7] hover:bg-[#F4F4F4] text-sm font-medium text-ivory">Browse offers</Link>
                <Link to="/dashboard" className="block p-3 rounded-lg bg-[#F9F8F7] hover:bg-[#F4F4F4] text-sm font-medium text-ivory">My dashboard & savings</Link>
                <Link to="/profile" className="block p-3 rounded-lg bg-[#F9F8F7] hover:bg-[#F4F4F4] text-sm font-medium text-ivory">My profile</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (company.status !== "approved") {
    return (
      <div className="min-h-screen bg-[#F9F8F7] flex items-center justify-center px-4">
        <div className="max-w-md text-center bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-8 shadow-sm">
          <Users className="w-10 h-10 text-[#0866FF] mx-auto mb-4" />
          <h1 className="text-xl font-bold text-ivory">Thanks — we'll be in touch within 1 business day.</h1>
          <p className="text-sm text-ivory-muted mt-2 mb-6">Our team is reaching out to schedule a call and set up your company dashboard.</p>
          <button onClick={() => logout(true)} className="bg-[#0866FF] text-white px-6 py-2.5 rounded-full text-sm font-semibold">Back to home</button>
        </div>
      </div>
    );
  }

  const accent = company.branding_primary_color || "#059669";

  return (
    <div className="min-h-screen bg-[#F9F8F7]">
      <header className="bg-emerald-black border-b border-[#F1F1F1] sticky top-0 z-20">
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
              <p className="font-bold text-ivory text-sm leading-tight truncate">{company.name}</p>
              <p className="text-xs text-ivory-dim truncate">{company.membership_tier || "Corporate"} · {company.employee_count || company.seats_purchased || 0} employees</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsAssistantOpen(true)}
              className="inline-flex items-center gap-1.5 bg-[#FFFFFF] hover:bg-[#F9F8F7] text-[#0866FF] px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
            >
              <Bot className="w-4 h-4" /> Smart Copilot
            </button>
            <button onClick={refresh} title="Refresh" className="p-2 rounded-lg text-ivory-dim hover:text-ivory hover:bg-[#F4F4F4]"><RefreshCw className="w-4 h-4" /></button>
            <Link to="/" className="text-xs text-ivory-muted hover:text-ivory px-3 py-1">View site</Link>
            <button onClick={() => logout(true)} className="text-xs text-ivory-muted hover:text-ivory flex items-center gap-1 px-2 py-1"><LogOut className="w-3.5 h-3.5" /> Sign out</button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 lg:gap-8">
        <aside className="hidden lg:block">
          <nav className="space-y-1 sticky top-20 max-h-[calc(100vh-100px)] overflow-y-auto pr-2 scrollbar-hide">
            {TABS.map((t) => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors ${
                  tab === t.id ? "bg-[#FFFFFF] text-ivory font-bold" : "text-ivory-muted hover:bg-[#F4F4F4] hover:text-ivory"
                }`}>
                <t.icon className="w-4 h-4" /> {t.label}
              </button>
            ))}
          </nav>
        </aside>

        <div className="lg:hidden flex gap-1 -mx-4 px-4 pb-3 overflow-x-auto border-b border-[#F1F1F1] mb-4 scrollbar-hide">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                tab === t.id ? "bg-[#FFFFFF] text-ivory font-bold" : "text-ivory-muted bg-[#F4F4F4]"
              }`}>
              <t.icon className="w-3.5 h-3.5" /> {t.label}
            </button>
          ))}
        </div>

        <main className="min-w-0">
          {showWelcome && (
            <div className="mb-4 bg-[#FFFFFF] border border-[#F1F1F1] rounded-lg p-4 flex items-center justify-between gap-3">
              <div>
                <p className="font-bold text-[#0866FF] text-sm">Welcome to Nelvin, {company.name}!</p>
                <p className="text-xs text-[#0866FF]">Your corporate benefits dashboard is ready. Invite your team to get started.</p>
              </div>
              <button onClick={dismissWelcome} className="text-[#0866FF] hover:text-[#0866FF] text-xs font-semibold whitespace-nowrap">Dismiss</button>
            </div>
          )}
          {tab === "dashboard" && <CorporateDashboardHome company={company} employees={employees} onGoEmployees={() => setTab("employees")} />}
          {tab === "employees" && <EmployeesPanel company={company} employees={employees} onChanged={refresh} />}
          {tab === "departments" && <DepartmentsPanel company={company} employees={employees} onChanged={refresh} />}
          {tab === "teams" && <TeamsPanel company={company} />}
          {tab === "locations" && <LocationsPanel company={company} />}
          {tab === "benefits" && <BenefitsPanel company={company} />}
          {tab === "budgets" && <BudgetsPanel company={company} />}
          {tab === "rewards" && <RewardsPanel company={company} />}
          {tab === "campaigns" && <CampaignsPanel company={company} />}
          {tab === "communications" && <CommunicationsPanel company={company} />}
          {tab === "surveys" && <SurveysPanel company={company} />}
          {tab === "claims" && <ClaimsPanel company={company} />}
          {tab === "offer-usage" && <OfferUsagePanel company={company} employees={employees} />}
          {tab === "reports" && <ReportsPanel company={company} employees={employees} />}
          {tab === "analytics" && <AnalyticsPanel company={company} employees={employees} />}
          {tab === "integrations" && <IntegrationsPanel company={company} />}
          {tab === "billing" && <BillingPanel company={company} onChanged={refresh} />}
          {tab === "notifications" && <NotificationsPanel company={company} />}
          {tab === "settings" && <CompanySettingsPanel company={company} onChanged={refresh} />}
          {tab === "roles" && <RolesPanel company={company} />}
        </main>
      </div>

      <HRAssistantDrawer isOpen={isAssistantOpen} onClose={() => setIsAssistantOpen(false)} />
    </div>
  );
}