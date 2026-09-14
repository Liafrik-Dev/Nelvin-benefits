import { db } from "@/services/api/base44Client";

import React, { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Loader2, ShieldCheck, ArrowLeft } from "lucide-react";

import { useAuth } from "@/lib/AuthContext";
import { PLANS } from "@/lib/plansData";
import { getPendingPlan, clearPendingPlan } from "@/lib/planPersistence";
import { genSubscriberId } from "@/lib/subscriberId";
import Navbar from "@/components/nelvin/Navbar";
import Footer from "@/components/nelvin/Footer";

export default function Checkout() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { user, isLoadingAuth, isAuthenticated } = useAuth();
  const [status, setStatus] = useState("idle"); // idle | processing | done
  const [error, setError] = useState("");

  const slug = params.get("plan") || getPendingPlan();
  // Re-verify the plan against the authoritative pricing table (slug only; price
  // is derived from the table, never trusted from client input).
  const plan = PLANS.find((p) => p.slug === slug);

  useEffect(() => {
    if (isLoadingAuth) return;
    if (!isAuthenticated) {
      window.location.href = `/login?plan=${slug || ""}`;
      return;
    }
    if (!plan || plan.slug === "free") {
      clearPendingPlan();
      navigate("/dashboard", { replace: true });
    }
  }, [isLoadingAuth, isAuthenticated, plan, slug, navigate]);

  if (!plan || plan.slug === "free") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-forest">
        <Loader2 className="w-6 h-6 animate-spin text-ivory-dim" />
      </div>
    );
  }

  const priceAmount = Number(String(plan.price).replace(/[^0-9.]/g, "")) || 0;

  const handleConfirm = async () => {
    setError("");
    setStatus("processing");
    try {
      // Re-derive the plan + price from the canonical table (ignore any client-supplied amount).
      const verified = PLANS.find((p) => p.slug === plan.slug);
      if (!verified) throw new Error("Invalid plan selection");
      const today = new Date().toISOString().slice(0, 10);
      const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}`;
      const verifiedAmount = Number(String(verified.price).replace(/[^0-9.]/g, "")) || 0;

      // Record the membership payment (pending) — reuses the existing Payment entity
      // and the same admin-confirmation pattern as corporate onboarding.
      await db.entities.Payment.create({
        type: "membership",
        account_type: "individual",
        user_id: user.id,
        user_name: user.full_name,
        user_email: user.email,
        amount: verifiedAmount,
        currency: "USD",
        payment_method: "card",
        reference: invoiceNumber,
        invoice_number: invoiceNumber,
        description: `${verified.name} individual membership — monthly`,
        membership_plan_name: verified.name,
        status: "pending",
        billing_period_start: today,
      });

      // Apply the plan to the user (pending until the payment is confirmed).
      await db.auth.updateMe({
        membership_plan_id: verified.slug,
        plan_tier: verified.name,
        membership_status: "pending",
        membership_start_date: today,
        subscriber_id: user.subscriber_id || genSubscriberId(user.email),
      });

      clearPendingPlan();
      setStatus("done");
      setTimeout(() => navigate("/dashboard"), 1400);
    } catch (err) {
      setError(err?.message || "Checkout failed. Please try again.");
      setStatus("idle");
    }
  };

  return (
    <div className="min-h-screen bg-forest">
      <div className="relative bg-[#062B23] pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <Navbar />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl mx-auto text-center relative z-10"
        >
          <Link to="/choose-plan" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-xs font-medium mb-6 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Change plan
          </Link>
          <p className="text-[#E5C77A] font-semibold text-xs tracking-[0.15em] uppercase mb-3">Checkout</p>
          <h1 className="text-3xl sm:text-4xl font-bold font-heading text-white">Confirm your {plan.name} membership</h1>
        </motion.div>
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#D6B56D]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-20 w-72 h-72 bg-[#103F35]/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-md mx-auto px-4 sm:px-6 lg:px-8 -mt-10 pb-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-emerald-black ring-1 ring-white/10 rounded-lg shadow-sm p-8"
        >
          <AnimatePresence mode="wait">
            {status === "done" ? (
              <motion.div key="done" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center py-6">
                <div className="w-16 h-16 bg-[#103F35]/60 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8 text-[#D6B56D]" />
                </div>
                <h2 className="text-2xl font-bold font-heading text-ivory">You're enrolled!</h2>
                <p className="text-sm text-ivory-muted mt-2">Your {plan.name} membership is pending activation. Redirecting to your dashboard…</p>
                <div className="flex justify-center mt-4"><Loader2 className="w-5 h-5 animate-spin text-[#D6B56D]" /></div>
              </motion.div>
            ) : (
              <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="flex items-baseline justify-between mb-1">
                  <h3 className="font-bold text-lg text-ivory">{plan.name}</h3>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold font-heading">{plan.price}</span>
                    <span className="text-sm text-ivory-dim">{plan.period}</span>
                  </div>
                </div>
                <p className="text-sm text-ivory-muted mb-6">{plan.desc}</p>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-ivory">
                      <Check className="w-4 h-4 mt-0.5 flex-shrink-0 text-[#D6B56D]" /> {f}
                    </li>
                  ))}
                </ul>
                <div className="bg-forest-secondary/60 rounded-xl p-4 mb-6 text-xs text-ivory-muted space-y-1">
                  <p><span className="font-medium text-ivory">Signed in as:</span> {user?.email}</p>
                  <p><span className="font-medium text-ivory">Billing:</span> ${priceAmount}/month · USD</p>
                </div>
                {error && <div className="mb-4 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">{error}</div>}
                <button
                  onClick={handleConfirm}
                  disabled={status === "processing"}
                  className="w-full py-3.5 rounded-full font-semibold text-sm bg-[#D6B56D] hover:bg-[#E5C77A] text-white transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {status === "processing"
                    ? <><Loader2 className="w-4 h-4 animate-spin" />Processing…</>
                    : <>Confirm & Pay ${priceAmount}/mo</>}
                </button>
                <p className="flex items-center justify-center gap-1.5 text-xs text-ivory-dim mt-4">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D6B56D]" /> Secure checkout · plan verified against the pricing table
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}