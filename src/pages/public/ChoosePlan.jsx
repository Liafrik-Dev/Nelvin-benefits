import React from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { setPendingPlan } from "@/lib/planPersistence";
import { motion } from "framer-motion";
import { Check, ArrowLeft } from "lucide-react";
import { PLANS } from "@/lib/plansData";
import Navbar from "@/components/nelvin/Navbar";
import Footer from "@/components/nelvin/Footer";

export default function ChoosePlan() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated, isLoadingAuth } = useAuth();
  const preselected = params.get("plan");

  const handlePick = (plan) => {
    setPendingPlan(plan.slug);
    if (isLoadingAuth) return;
    if (isAuthenticated) {
      navigate(plan.slug === "free" ? "/dashboard" : `/checkout?plan=${plan.slug}`);
    } else {
      navigate(`/register?plan=${plan.slug}`);
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
          className="max-w-3xl mx-auto text-center relative z-10"
        >
          <Link to="/" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-xs font-medium mb-6 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to home
          </Link>
          <p className="text-[#E5C77A] font-semibold text-xs tracking-[0.15em] uppercase mb-3">Membership</p>
          <h1 className="text-3xl sm:text-5xl font-bold font-heading text-white">Choose your savings plan.</h1>
          <p className="text-white/60 mt-4 max-w-lg mx-auto">
            From casual weekend spenders to luxury travellers — there's a Nelvin plan built for you.
          </p>
        </motion.div>
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-[#D6B56D]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-20 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
          {PLANS.map((plan, i) => {
            const isSelected = preselected === plan.slug;
            return (
              <motion.div
                key={plan.slug}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.6, delay: i * 0.15, ease: "easeOut" }}
                whileHover={{ y: -6 }}
                className={`rounded-lg p-8 relative transition-shadow ${
                  plan.highlight
                    ? "bg-[#D6B56D] text-white shadow-2xl md:-mt-4 md:pb-10"
                    : "bg-white border border-white/12 hover:shadow-xl"
                } ${isSelected ? "ring-2 ring-amber-400" : ""}`}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-amber-500 text-white text-xs font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                      Most Popular
                    </span>
                  </div>
                )}
                <p className={`font-bold text-sm tracking-wider mb-4 ${plan.nameColor}`}>{plan.name}</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-5xl font-bold font-heading">{plan.price}</span>
                  <span className={`text-sm ${plan.highlight ? "text-white/70" : "text-ivory-dim"}`}>{plan.period}</span>
                </div>
                <p className={`text-sm mb-6 ${plan.highlight ? "text-white/70" : "text-ivory-muted"}`}>{plan.desc}</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-start gap-2.5 text-sm">
                      <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlight ? "text-[#E5C77A]" : "text-[#D6B56D]"}`} />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handlePick(plan)}
                  className={`w-full py-3 rounded-full font-semibold text-sm transition-colors block text-center ${
                    plan.highlight
                      ? "bg-white text-[#D6B56D] hover:bg-white/5"
                      : "bg-[#D6B56D] text-white hover:bg-[#E5C77A]"
                  }`}
                >
                  {plan.cta}
                </button>
              </motion.div>
            );
          })}
        </div>
      </div>
      <Footer />
    </div>
  );
}