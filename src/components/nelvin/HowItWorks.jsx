import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import LIcon from "@/components/nelvin/LandingIcons";
import { SectionHeading } from "@/components/nelvin/Brand";
import { LANDING_HOWITWORKS } from "@/lib/landingData";

/**
 * How it works — the reference keeps this as a numbered four-step rail with
 * one expanded detail. Same steps and copy, restyled to the shared system.
 */

function HowItWorksMultiTab() {
  const [activeStep, setActiveStep] = useState(0);
  const current = LANDING_HOWITWORKS[activeStep];

  return (
    <div className="card-nv mx-auto mt-12 max-w-4xl p-6 sm:p-8">
      <div
        className="grid grid-cols-2 gap-1.5 rounded-full border border-[#F1F1F1] bg-[#F9F8F7] p-1.5 sm:grid-cols-4"
        role="tablist"
        aria-label="Implementation steps"
      >
        {LANDING_HOWITWORKS.map((step, idx) => {
          const on = activeStep === idx;
          return (
            <button
              key={step.num}
              type="button"
              role="tab"
              aria-selected={on}
              onClick={() => setActiveStep(idx)}
              className={`flex items-center justify-center gap-2 rounded-full px-3 py-2.5 text-xs font-bold transition-colors ${
                on
                  ? "bg-gold text-white shadow-nv-card"
                  : "text-ivory-muted hover:bg-[#F9F8F7] hover:text-ivory"
              }`}
            >
              <span className="font-extrabold">{step.num}.</span>
              <span className="truncate">{step.title}</span>
            </button>
          );
        })}
      </div>

      <div className="mt-8 flex flex-col items-center gap-6 md:flex-row md:items-center">
        <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-[#1B4F9C]/10 text-gold shadow-nv-card">
          <LIcon name={current.icon} className="h-8 w-8" />
        </span>
        <div className="flex-1 text-center md:text-left">
          <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
            <span className="rounded-full bg-gold px-2.5 py-0.5 text-[11px] font-extrabold text-white">
              Step {current.num}
            </span>
            <h3 className="text-xl font-extrabold font-heading text-ivory">{current.title}</h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ivory-muted">{current.desc}</p>
        </div>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="surface-nv-primary section-nv">
      <div className="container-nv">
        <SectionHeading
          eyebrow="How it works"
          title={<>Live in weeks, not years.</>}
          lead="From sign-up to first redemption in four simple steps — we handle the heavy lifting."
        />

        <HowItWorksMultiTab />

        <div className="mt-12 text-center">
          <Link to="/register" className="btn-nv btn-nv-lg btn-nv-gold group">
            Start free today
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
          <p className="mt-3 text-[11px] text-ivory-dim">No credit card required · 14-day free trial</p>
        </div>
      </div>
    </section>
  );
}