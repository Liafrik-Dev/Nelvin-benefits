import { db } from "@/services/api/base44Client";

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Heart, Users, ShieldCheck, Sparkles, ArrowRight, Phone, LayoutDashboard } from "lucide-react";
import Navbar from "@/components/nelvin/Navbar";
import Footer from "@/components/nelvin/Footer";

import { useAuth } from "@/lib/AuthContext";

const perks = [
  { title: "Employee Happiness", desc: "Improve satisfaction with rewards your team actually uses.", icon: Heart, bg: "bg-[#1B4F9C]", fg: "text-[#282828]" },
  { title: "Talent Attraction", desc: "Stand out during recruitment with a premium lifestyle benefits package.", icon: Users, bg: "bg-[#F4F4F4]", fg: "text-[#1B4F9C]" },
  { title: "Employee Retention", desc: "Increase loyalty and reduce churn with daily, real-world value.", icon: ShieldCheck, bg: "bg-[#1B4F9C]", fg: "text-[#282828]" },
  { title: "Exclusive Savings", desc: "Help employees save money on dining, travel, shopping, and wellness.", icon: Sparkles, bg: "bg-[#1B4F9C]", fg: "text-[#282828]" },
];

const steps = [
  { title: "Sign up your company", desc: "Tell us your business name, industry, and how to reach your billing contact." },
  { title: "Tell us your employee count", desc: "We size the plan to your actual team — no guesswork, no wasted seats." },
  { title: "Get instant pricing (or a call, for larger teams)", desc: "Teams under 10 pay online and launch today. Teams of 10+ get a 30-min call to design a custom plan." },
  { title: "Employees join with their company email", desc: "Domain-based auto-join — no manual provisioning per seat." },
];

const whyCards = [
  { title: "Employee Benefits", desc: "Reward employees with thousands of exclusive offers across Africa.", icon: Heart, bg: "bg-[#1B4F9C]", fg: "text-[#282828]" },
  { title: "HR Dashboard", desc: "Track savings and engagement across departments in real time.", icon: LayoutDashboard, bg: "bg-[#F4F4F4]", fg: "text-[#1B4F9C]" },
  { title: "Real-Time Analytics", desc: "Know exactly who is using benefits and where to invest.", icon: Sparkles, bg: "bg-[#1B4F9C]", fg: "text-[#282828]" },
  { title: "Global Offers", desc: "Benefits available across every African country — and growing.", icon: Users, bg: "bg-[#1B4F9C]", fg: "text-[#282828]" },
  { title: "Corporate Billing", desc: "One invoice, unlimited employees, single monthly cycle.", icon: ShieldCheck, bg: "bg-[#F4F4F4]", fg: "text-[#1B4F9C]" },
  { title: "Dedicated Support", desc: "Email our corporate team directly during onboarding and beyond.", icon: Phone, bg: "bg-[#1B4F9C]", fg: "text-[#282828]" },
];

const demoLogos = ["Atlas Bank", "Sahara Energy", "Mara Tech", "Konga Retail", "Helios Health", "Acacia Foods"];

export default function Corporate() {
  const { user, isAuthenticated, isLoadingAuth } = useAuth();
  const [company, setCompany] = useState(null);
  const [stats, setStats] = useState({ emp: 0, active: 0, redemptions: 0, savings: 0 });

  const isHRAdmin = !isLoadingAuth && isAuthenticated && !!user?.company_id;

  useEffect(() => {
    if (!isHRAdmin) return;
    (async () => {
      try {
        const c = await db.entities.Company.get(user.company_id);
        setCompany(c);
        const emps = await db.entities.Employee.filter({ company_id: c.id }, "-created_date", 500).catch(() => []);
        const ids = emps.filter((e) => e.user_id).map((e) => e.user_id);
        const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0, 0, 0, 0);
        let remCount = 0, saved = 0;
        if (ids.length > 0) {
          const rems = await db.entities.Redemption.filter(
            { redeemed_at: { $gte: monthStart.toISOString() } }, "-redeemed_at", 300
          ).catch(() => []);
          const visible = rems.filter((r) => ids.includes(r.user_id));
          remCount = visible.length;
          saved = visible.reduce((s, r) => s + (r.savings_amount || 0), 0);
        }
        setStats({ emp: emps.length, active: emps.filter((e) => e.status === "active").length, redemptions: remCount, savings: saved });
      } catch { /* best-effort */ }
    })();
  }, [isHRAdmin, user?.company_id]);

  return (
    <div className="min-h-screen bg-forest">
      <div className="relative bg-[#FFFFFF] overflow-hidden">
        <Navbar />
        {isHRAdmin ? (
          <motion.section
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative pt-28 pb-24 px-4 sm:px-6 lg:px-8"
          >
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#1B4F9C]/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-20 w-80 h-80 bg-[#1B4F9C]/20 rounded-full blur-3xl" />
            <div className="relative max-w-4xl mx-auto text-center">
              {company?.logo_url || company?.branding_logo_url ? (
                <img src={company.logo_url || company.branding_logo_url} alt="" className="w-16 h-16 rounded-xl object-cover bg-[#F4F4F4] mx-auto mb-5" />
              ) : (
                <div className="w-16 h-16 rounded-xl bg-[#1B4F9C] flex items-center justify-center mx-auto mb-5 text-white font-bold text-2xl">
                  {(company?.name || "N").slice(0, 1)}
                </div>
              )}
              <span className="text-[#1B4F9C] font-semibold text-xs tracking-[0.2em] uppercase">Welcome back</span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
                className="text-4xl sm:text-5xl font-bold font-heading text-[#282828] mt-3 leading-tight"
              >
                {company?.name || "Your Company"}
              </motion.h1>
              <p className="text-[#484848] mt-4 text-lg">Manage employee benefits from one place.</p>

              <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto">
                <Stat label="Employees" value={stats.emp} />
                <Stat label="Active" value={stats.active} />
                <Stat label="Redemptions" value={stats.redemptions} />
                <Stat label="Saved (USD)" value={`$${stats.savings.toLocaleString()}`} />
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
                className="mt-9 flex justify-center"
              >
                <Link
                  to="/corporate-dashboard"
                  className="inline-flex items-center justify-center gap-2 bg-[#1B4F9C] hover:bg-[#1B4F9C] text-white font-semibold px-7 py-3.5 rounded-full text-sm transition-colors"
                >
                  Open HR Dashboard <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </motion.section>
        ) : (
          <motion.section
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, ease: "easeOut" }}
            className="relative pt-28 pb-24 px-4 sm:px-6 lg:px-8"
          >
            <div className="absolute -top-20 -right-20 w-80 h-80 bg-[#1B4F9C]/30 rounded-full blur-3xl" />
            <div className="absolute -bottom-24 -left-20 w-80 h-80 bg-[#1B4F9C]/20 rounded-full blur-3xl" />
            <div className="relative max-w-4xl mx-auto text-center">
              <span className="text-[#1B4F9C] font-semibold text-xs tracking-[0.2em] uppercase">Nelvin for Business</span>
              <motion.h1
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.15 }}
                className="text-4xl sm:text-6xl font-bold font-heading text-[#282828] mt-5 leading-tight"
              >
                Give Your Employees Benefits<br />They'll Actually Use.
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.25 }}
                className="text-[#484848] mt-6 max-w-2xl mx-auto text-lg leading-relaxed"
              >
                Thousands of discounts. Worldwide coverage. Easy management. One secure platform built for African businesses.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.35 }}
                className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
              >
                <a href="mailto:Nelvin23@proton.me?subject=Corporate%20Demo%20Request" className="inline-flex items-center justify-center gap-2 border border-[#E3E3E3] bg-[#FFFFFF] hover:bg-[#F9F8F7] text-[#282828] font-semibold px-7 py-3.5 rounded-full text-sm transition-colors">
                  <Phone className="w-4 h-4" /> Request Demo
                </a>
                <Link to="/corporate-signup" className="inline-flex items-center justify-center gap-2 bg-[#1B4F9C] hover:bg-[#1B4F9C] text-white font-semibold px-7 py-3.5 rounded-full text-sm transition-colors">
                  Create HR Account <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>
            </div>
          </motion.section>
        )}
      </div>

      <section className="py-14 px-4 sm:px-6 lg:px-8 bg-forest">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-ivory-dim font-semibold text-xs tracking-[0.15em] uppercase">Trusted Companies</p>
            <h2 className="text-xl sm:text-2xl font-heading text-ivory mt-3">Sample and pilot clients across Africa</h2>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
            {demoLogos.map((l) => (
              <div key={l} className="flex items-center gap-2 text-ivory-dim font-semibold text-sm">
                <div className="w-8 h-8 rounded-lg bg-[#F4F4F4] text-[#1B4F9C] ring-1 ring-[#1B4F9C]/25 flex items-center justify-center font-bold text-xs">{l.slice(0, 1)}</div>
                {l}
                <span className="ml-1 text-[10px] uppercase tracking-wide text-[#6B6B6B] border border-[#F1F1F1] rounded px-1">demo</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#1B4F9C] font-semibold text-xs tracking-[0.15em] uppercase">Why Companies Choose Nelvin</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-ivory mt-3">A benefits package your team will actually use.</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyCards.map((p) => (
              <div key={p.title} className="bg-emerald-black rounded-lg ring-1 ring-[#F1F1F1] p-7 hover:ring-[#1B4F9C]/30 transition-all">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${p.bg}`}>
                  <p.icon className={`w-6 h-6 ${p.fg}`} />
                </div>
                <h3 className="font-semibold text-ivory text-lg">{p.title}</h3>
                <p className="text-sm text-ivory-muted mt-2">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-forest">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[#1B4F9C] font-semibold text-xs tracking-[0.15em] uppercase">How It Works</p>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-ivory mt-3">Live in four simple steps.</h2>
          </div>
          <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <li key={s.title} className="relative">
                <span className="absolute -top-2 -left-2 z-10 w-7 h-7 rounded-full bg-[#1B4F9C] text-white text-xs font-bold flex items-center justify-center">{i + 1}</span>
                <div className="bg-emerald-black rounded-lg ring-1 ring-[#F1F1F1] p-7 h-full pt-8">
                  <h3 className="font-semibold text-ivory">{s.title}</h3>
                  <p className="text-sm text-ivory-muted mt-2">{s.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-ivory">Ready to reward your team?</h2>
          <p className="text-ivory-muted mt-3">Self-serve in minutes, or chat with our team for larger orgs.</p>
          <Link to="/corporate-signup" className="inline-flex items-center gap-2 mt-8 bg-[#1B4F9C] hover:bg-[#1B4F9C] text-white font-semibold px-7 py-3.5 rounded-full text-sm transition-colors">
            Sign Up Your Company <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-[#F4F4F4] backdrop-blur-md rounded-xl px-4 py-3 text-left">
      <p className="text-[10px] uppercase tracking-wider text-[#1B4F9C]">{label}</p>
      <p className="text-xl font-bold font-heading text-[#282828]">{value}</p>
    </div>
  );
}