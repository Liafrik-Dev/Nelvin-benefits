import { db } from "@/services/api/base44Client";

import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Building2, ArrowLeft, ArrowRight, Check, Phone, Users, Sparkles, Calendar } from "lucide-react";

import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/AuthContext";
import Navbar from "@/components/nelvin/Navbar";
import Footer from "@/components/nelvin/Footer";
import { COUNTRIES } from "@/lib/nelvinData";
import { genSubscriberId } from "@/lib/subscriberId";

const INDUSTRIES = [
  "Technology", "Finance", "Healthcare", "Education", "Manufacturing", "Retail",
  "Consulting", "Media", "Telecom", "Government", "NGO / Non-profit", "Hospitality", "Other",
];

const TIERS = [
  {
    id: "starter",
    name: "Starter",
    range: "1 – 4 employees",
    monthly: 19,
    desc: "Perfect for small startups and boutique teams",
    features: ["Up to 4 employees", "Access to 100+ lifestyle offers", "Mobile app access", "Email support", "Branded employee hub"],
  },
  {
    id: "team",
    name: "Team",
    range: "5 – 9 employees",
    monthly: 39,
    desc: "For growing teams that want VIP perks for everyone",
    features: ["Up to 9 employees", "Unlock VIP-only offers", "Priority support", "Quarterly usage report", "Branded employee hub"],
  },
];

const emptyForm = {
  name: "",
  industry: "",
  country: "",
  email_domain: "",
  billing_contact_name: "",
  billing_contact_email: "",
  billing_contact_phone: "",
  employee_count: "",
};

function ProgressBar({ step, total }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-1 rounded-full transition-all duration-300 ${i <= step ? "w-8 bg-[#D6B56D]" : "w-4 bg-[#0A3A2F]/10"}`} />
      ))}
    </div>
  );
}

function StepCompanyInfo({ form, update, onNext }) {
  return (
    <div>
      <h2 className="text-2xl font-bold font-heading text-ivory text-center">Tell us about your company</h2>
      <p className="text-sm text-ivory-muted text-center mt-1 mb-6">You're the company admin in Nelvin; we'll send invoices to the billing contact.</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Field label="Company Name *" full>
          <input className="corporate-input" value={form.name} onChange={(e) => update("name", e.target.value)} placeholder="Acme Africa Ltd." />
        </Field>
        <Field label="Industry">
          <select className="corporate-input" value={form.industry} onChange={(e) => update("industry", e.target.value)}>
            <option value="">Select industry</option>
            {INDUSTRIES.map((i) => <option key={i} value={i}>{i}</option>)}
          </select>
        </Field>
        <Field label="Country">
          <select className="corporate-input" value={form.country} onChange={(e) => update("country", e.target.value)}>
            <option value="">Select country</option>
            {COUNTRIES.map((c) => <option key={c.slug} value={c.name}>{c.name}</option>)}
          </select>
        </Field>
        <Field label="Company Email Domain *" full>
          <div className="flex items-center">
            <span className="px-3 py-2.5 bg-[#0A3A2F]/5 border border-r-0 border-white/12 rounded-l-lg text-ivory-dim text-sm">@</span>
            <input
              className="corporate-input rounded-l-none"
              value={form.email_domain}
              onChange={(e) => update("email_domain", e.target.value.toLowerCase().replace(/^@/, ""))}
              placeholder="acme.com"
            />
          </div>
          <p className="text-xs text-ivory-dim mt-1">Employees signing up with this domain auto-join your company.</p>
        </Field>
        <Field label="Billing Contact Name *">
          <input className="corporate-input" value={form.billing_contact_name} onChange={(e) => update("billing_contact_name", e.target.value)} placeholder="Jane Doe" />
        </Field>
        <Field label="Billing Contact Email *">
          <input className="corporate-input" type="email" value={form.billing_contact_email} onChange={(e) => update("billing_contact_email", e.target.value)} placeholder="jane@acme.com" />
        </Field>
        <Field label="Billing Phone (optional)" full>
          <input className="corporate-input" value={form.billing_contact_phone} onChange={(e) => update("billing_contact_phone", e.target.value)} placeholder="+237 6XX XX XX XX" />
        </Field>
      </div>
      <div className="flex justify-end mt-8">
        <button
          onClick={onNext}
          disabled={!form.name || !form.industry || !form.country || !form.email_domain || !form.billing_contact_name || !form.billing_contact_email}
          className="inline-flex items-center gap-2 bg-[#D6B56D] disabled:bg-[#103F35] hover:bg-[#E5C77A] text-white font-semibold px-6 py-3 rounded-full text-sm transition-colors"
        >
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function StepEmployeeCount({ form, update, onNext, onBack }) {
  return (
    <div>
      <h2 className="text-2xl font-bold font-heading text-ivory text-center">How many employees will use Nelvin?</h2>
      <p className="text-sm text-ivory-muted text-center mt-1 mb-6">This decides your plan tier. Self-serve is available up to 9 employees; teams of 10+ get custom pricing.</p>
      <div className="max-w-sm mx-auto">
        <div className="bg-forest-secondary/60 rounded-lg border border-white/10 p-6 text-center">
          <input
            type="number"
            min="1"
            value={form.employee_count}
            onChange={(e) => update("employee_count", e.target.value)}
            placeholder="0"
            className="text-5xl font-bold font-heading text-[#D6B56D] text-center w-full bg-transparent outline-none"
          />
          <p className="text-xs text-ivory-dim mt-1">employees</p>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2">
          {[3, 7, 15].map((n) => (
            <button key={n} onClick={() => update("employee_count", String(n))} className="text-xs py-2 rounded-lg border border-white/12 hover:border-[#D6B56D]/30 hover:bg-[#0A3A2F] transition-colors">
              {n}
            </button>
          ))}
        </div>
      </div>
      <div className="flex justify-between mt-8">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-ivory-muted hover:text-ivory text-sm font-medium px-4 py-3">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={onNext}
          disabled={Number(form.employee_count) < 1}
          className="inline-flex items-center gap-2 bg-[#D6B56D] disabled:bg-[#103F35] hover:bg-[#E5C77A] text-white font-semibold px-6 py-3 rounded-full text-sm transition-colors"
        >
          Continue <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function StepPricingOrLead({ form, onPick, onBack, submitting }) {
  const count = Number(form.employee_count) || 0;
  const isLead = count >= 10;
  if (isLead) {
    return (
      <div>
        <h2 className="text-2xl font-bold font-heading text-ivory text-center">Custom pricing for {count} employees</h2>
        <p className="text-sm text-ivory-muted text-center mt-1 mb-6">Teams of 10 or more get custom pricing. Our team will reach out to schedule a call.</p>
        <div className="max-w-md mx-auto space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Box label="Company" value={form.name} />
            <Box label="Employee count" value={String(count)} />
            <Box label="Billing contact" value={form.billing_contact_name} />
            <Box label="Email" value={form.billing_contact_email} />
            <Box label="Phone" value={form.billing_contact_phone || "—"} full />
          </div>
          <p className="text-xs text-ivory-dim text-center pt-2">A team member will email <span className="font-medium text-ivory-muted">{form.billing_contact_email}</span> within 1 business day.</p>
        </div>
        <div className="flex justify-between mt-8 max-w-md mx-auto">
          <button onClick={onBack} className="inline-flex items-center gap-2 text-ivory-muted hover:text-ivory text-sm font-medium px-4 py-3">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
          <button
            onClick={onPick}
            disabled={submitting}
            className="inline-flex items-center gap-2 bg-[#D6B56D] hover:bg-[#E5C77A] disabled:opacity-70 text-white font-semibold px-6 py-3 rounded-full text-sm transition-colors"
          >
            {submitting ? "Submitting..." : "Submit — we'll be in touch"}
          </button>
        </div>
      </div>
    );
  }

  const tier = count <= 4 ? TIERS[0] : TIERS[1];
  const total = tier.monthly * (count === 0 ? 0 : count);

  return (
    <div>
      <h2 className="text-2xl font-bold font-heading text-ivory text-center">Pick your plan</h2>
      <p className="text-sm text-ivory-muted text-center mt-1 mb-8">For {count} employee{count === 1 ? "" : "s"}, you qualify for the <span className="font-semibold text-[#D6B56D]">{tier.name}</span> tier.</p>
      <div className="max-w-md mx-auto bg-[#0A3A2F] rounded-lg border-2 border-white/15 shadow-sm p-8">
        <div className="flex items-baseline justify-between mb-2">
          <h3 className="font-bold text-lg text-ivory">{tier.name}</h3>
          <span className="text-xs font-semibold text-[#D6B56D] bg-[#0A3A2F] px-3 py-1 rounded-full">{tier.range}</span>
        </div>
        <div className="flex items-baseline gap-1 mb-1">
          <span className="text-4xl font-bold font-heading">${tier.monthly}</span>
          <span className="text-sm text-ivory-dim">/ employee / month</span>
        </div>
        <p className="text-sm text-ivory-muted mb-4">{tier.desc}</p>
        <div className="bg-[#0A3A2F] rounded-xl p-4 my-6 text-center">
          <p className="text-xs text-[#D6B56D] font-semibold uppercase tracking-wider">Your monthly total</p>
          <p className="text-3xl font-bold font-heading text-[#D6B56D]">${total}<span className="text-sm font-normal text-[#D6B56D]">/mo</span></p>
          <p className="text-xs text-ivory-muted mt-1">Billed to {form.billing_contact_email}</p>
        </div>
        <ul className="space-y-2 mb-6">
          {tier.features.map((f, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-ivory">
              <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#D6B56D]" /> {f}
            </li>
          ))}
        </ul>
      </div>
      <div className="flex justify-between mt-8 max-w-md mx-auto">
        <button onClick={onBack} className="inline-flex items-center gap-2 text-ivory-muted hover:text-ivory text-sm font-medium px-4 py-3">
          <ArrowLeft className="w-4 h-4" /> Back
        </button>
        <button
          onClick={onPick}
          disabled={submitting}
          className="inline-flex items-center gap-2 bg-[#D6B56D] hover:bg-[#E5C77A] disabled:opacity-70 text-white font-semibold px-6 py-3 rounded-full text-sm transition-colors"
        >
          {submitting ? "Setting up..." : <>Pay & Launch (${total}/mo)</>}
        </button>
      </div>
      <p className="text-xs text-ivory-dim text-center mt-3">Stripe / Flutterwave / Paystack available at checkout (in v1 we record the invoice and your card on file).</p>
    </div>
  );
}

function Box({ label, value, full }) {
  return (
    <div className={`bg-forest-secondary/60 border border-white/10 rounded-lg p-3 ${full ? "col-span-2" : ""}`}>
      <p className="text-xs text-ivory-dim uppercase tracking-wider">{label}</p>
      <p className="text-sm font-semibold text-ivory mt-1">{value}</p>
    </div>
  );
}

function Field({ label, children, full }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="block text-xs font-semibold text-ivory-muted mb-1.5">{label}</label>
      {children}
    </div>
  );
}

export default function CorporateSignup() {
  const { user, isAuthenticated, isLoadingAuth, navigateToLogin, checkUserAuth } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const shouldReduceMotion = useReducedMotion();

  const [step, setStep] = useState(0);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [outcome, setOutcome] = useState(null);

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  if (!isLoadingAuth && !isAuthenticated) {
    navigateToLogin();
  }

  const finishSelfServe = async () => {
    if (!isAuthenticated) { navigateToLogin(); return; }
    setSubmitting(true);
    try {
      const count = Number(form.employee_count);
      const tier = count <= 4 ? TIERS[0] : TIERS[1];
      const today = new Date().toISOString().slice(0, 10);
      const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}`;

      const company = await db.entities.Company.create({
        name: form.name,
        industry: form.industry,
        country: form.country,
        email_domain: form.email_domain.toLowerCase().replace(/^@/, ""),
        billing_contact_name: form.billing_contact_name,
        billing_contact_email: form.billing_contact_email,
        billing_contact_phone: form.billing_contact_phone,
        membership_tier: tier.name,
        seats_purchased: count,
        seats_used: 0,
        employee_count: count,
        status: "pending",
        dashboard_access: false,
        activation_type: "self_serve",
        is_corporate_lead: false,
        lead_status: "pending",
        billing_start_date: today,
        billing_period: "monthly",
        subscription_status: "pending",
        invoice_number: invoiceNumber,
      });

      await db.entities.Payment.create({
        type: "membership",
        account_type: "corporate",
        company_id: company.id,
        company_name: company.name,
        user_id: user.id,
        user_name: user.full_name,
        user_email: user.email,
        amount: tier.monthly * count,
        currency: "USD",
        payment_method: "card",
        reference: invoiceNumber,
        invoice_number: invoiceNumber,
        description: `${tier.name} corporate plan — ${count} seats, monthly`,
        membership_plan_name: tier.name,
        seats: count,
        status: "pending",
        billing_period_start: today,
      });

      await db.auth.updateMe({
        company_id: company.id,
        account_type: "corporate",
        subscriber_id: genSubscriberId(user.email),
      });
      await checkUserAuth();

      // Do NOT grant dashboard_access here. The Nelvin admin confirms payment
      // (acting as the server-side verifier until a webhook function is deployed on Builder+).
      // The dashboard shows a "Confirming your payment…" state until dashboard_access flips to true.
      navigate("/corporate-dashboard");
    } catch (err) {
      toast({ title: "Submission failed", description: err?.message || "Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const finishLead = async () => {
    if (!isAuthenticated) { navigateToLogin(); return; }
    setSubmitting(true);
    try {
      const count = Number(form.employee_count);
      const company = await db.entities.Company.create({
        name: form.name,
        industry: form.industry,
        country: form.country,
        email_domain: form.email_domain.toLowerCase().replace(/^@/, ""),
        billing_contact_name: form.billing_contact_name,
        billing_contact_email: form.billing_contact_email,
        billing_contact_phone: form.billing_contact_phone,
        membership_tier: "Custom",
        seats_purchased: count,
        seats_used: 0,
        employee_count: count,
        status: "pending",
        dashboard_access: false,
        activation_type: "custom_pricing",
        is_corporate_lead: true,
        lead_status: "pending",
        application_status: "pending_approval",
        subscription_status: "pending",
      });

      try {
        await db.entities.Notification.create({
          title: "Corporate Lead — Needs Call",
          message: `${form.name} (${form.billing_contact_email}) signed up with ${count} employees. They are expecting a sales call within 1 business day. Phone: ${form.billing_contact_phone || "n/a"}.`,
          type: "company",
          channel: "system",
          audience: "specific_users",
          target_company_id: company.id,
          recipient_email: "Nelvin23@proton.me",
        });
      } catch { /* notifications are best-effort */ }

      setOutcome({ type: "lead" });
      toast({ title: "Lead captured", description: "Our team will be in touch within 1 business day." });
    } catch (err) {
      toast({ title: "Submission failed", description: err?.message || "Please try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const variants = shouldReduceMotion
    ? { initial: {}, animate: {}, exit: {} }
    : { initial: { opacity: 0, x: 24 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -24 } };

  const steps = [
    <StepCompanyInfo key="0" form={form} update={update} onNext={() => setStep(1)} />,
    <StepEmployeeCount key="1" form={form} update={update} onNext={() => setStep(2)} onBack={() => setStep(0)} />,
    <StepPricingOrLead key="2" form={form} onPick={() => (Number(form.employee_count) >= 10 ? finishLead() : finishSelfServe())} onBack={() => setStep(1)} submitting={submitting} />,
  ];

  return (
    <div className="min-h-screen bg-forest">
      <style>{`.corporate-input { width: 100%; padding: 0.625rem 0.875rem; border: 1px solid #e5e7eb; border-radius: 0.5rem; font-size: 0.875rem; outline: none; transition: border-color 0.15s; } .corporate-input:focus { border-color: #059669; box-shadow: 0 0 0 3px rgba(5, 150, 105, 0.1); }`}</style>

      <div className="relative bg-[#062B23] pt-24 pb-14 px-4 sm:px-6 lg:px-8">
        <Navbar />
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-12 h-12 bg-[#D6B56D] rounded-xl flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-white">Sign up your company</h1>
          <p className="text-white/60 mt-3">Three quick steps. Launch your corporate benefits program today.</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-20">
        <div className="bg-emerald-black ring-1 ring-white/10 rounded-[24px] p-6 sm:p-10 shadow-sm">
          {!outcome && <ProgressBar step={step} total={3} />}
          <AnimatePresence mode="wait">
            {outcome ? (
              <motion.div key="confirmation" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6">
                <div className="w-16 h-16 bg-[#103F35]/60 rounded-full flex items-center justify-center mx-auto mb-4">
                  {outcome.type === "self" ? <Check className="w-8 h-8 text-[#D6B56D]" /> : <Phone className="w-8 h-8 text-[#D6B56D]" />}
                </div>
                {outcome.type === "self" ? (
                  <>
                    <h2 className="text-2xl font-bold font-heading text-ivory">You're all set!</h2>
                    <p className="text-sm text-ivory-muted mt-2 mb-6">Here's your corporate dashboard. Invite your team and they'll auto-join with their {form.email_domain || "company"} email.</p>
                    <button onClick={() => navigate("/corporate-dashboard")} className="inline-flex items-center gap-2 bg-[#D6B56D] hover:bg-[#E5C77A] text-[#062B23] font-semibold px-7 py-3 rounded-full text-sm">
                      Go to Dashboard <ArrowRight className="w-4 h-4" />
                    </button>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold font-heading text-ivory">Thanks — we'll be in touch within 1 business day.</h2>
                    <p className="text-sm text-ivory-muted mt-2 mb-6">Our team is reaching out to schedule a call and design a custom plan for your {Number(form.employee_count)} employees.</p>
                    <button onClick={() => navigate("/")} className="inline-flex items-center gap-2 bg-[#062B23] hover:bg-emerald-black text-white font-semibold px-7 py-3 rounded-full text-sm">
                      Back to home
                    </button>
                  </>
                )}
              </motion.div>
            ) : (
              <motion.div key={step} initial={variants.initial} animate={variants.animate} exit={variants.exit} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                {steps[step]}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <Footer />
    </div>
  );
}