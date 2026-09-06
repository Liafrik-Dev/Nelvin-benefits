import React from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { PLANS as plans } from "@/lib/plansData";

export default function PricingSection() {
  return (
    <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-gray-400 font-semibold text-xs tracking-[0.2em] uppercase mb-3">Membership</p>
          <h2 className="text-4xl sm:text-5xl font-semibold font-heading text-gray-900 tracking-tight">
            Choose your savings plan.
          </h2>
          <p className="text-gray-500 mt-4 max-w-lg mx-auto text-base">
            From casual weekend spenders to luxury travellers — there's a Nelvin plan built for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-start">
          {plans.map((plan) => (
            <div
              key={plan.slug}
              className={`rounded-[28px] p-8 relative transition-shadow duration-300 ${
                plan.highlight
                  ? "bg-gray-900 text-white shadow-xl md:-mt-4 md:pb-10"
                  : "bg-[#f5f5f7] border border-gray-100 hover:shadow-md"
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-white text-gray-900 text-[11px] font-semibold px-4 py-1 rounded-full uppercase tracking-wider">
                    Most Popular
                  </span>
                </div>
              )}
              <p className={`font-semibold text-xs tracking-[0.15em] mb-5 ${plan.highlight ? "text-white/60" : "text-gray-400"}`}>
                {plan.name}
              </p>
              <div className="flex items-baseline gap-1 mb-1">
                <span className="text-5xl font-semibold font-heading tracking-tight">{plan.price}</span>
                <span className={`text-sm ${plan.highlight ? "text-white/50" : "text-gray-400"}`}>{plan.period}</span>
              </div>
              <p className={`text-sm mb-8 ${plan.highlight ? "text-white/60" : "text-gray-500"}`}>{plan.desc}</p>
              <ul className="space-y-3.5 mb-10">
                {plan.features.map((f, j) => (
                  <li key={j} className="flex items-start gap-2.5 text-sm">
                    <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${plan.highlight ? "text-white/70" : "text-gray-400"}`} />
                    <span className={plan.highlight ? "text-white/90" : "text-gray-700"}>{f}</span>
                  </li>
                ))}
              </ul>
              <Link
                to={`/choose-plan?plan=${plan.slug}`}
                className={`w-full py-3.5 rounded-full font-medium text-sm transition-all block text-center ${
                  plan.highlight
                    ? "bg-white text-gray-900 hover:bg-gray-100"
                    : "bg-gray-900 text-white hover:bg-gray-800"
                }`}
              >
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}