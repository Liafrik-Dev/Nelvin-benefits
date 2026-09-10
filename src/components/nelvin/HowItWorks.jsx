import React, { useState } from "react";
import { Link } from "react-router-dom";
import LIcon from "@/components/nelvin/LandingIcons";
import { LANDING_HOWITWORKS } from "@/lib/landingData";

function HowItWorksMultiTab() {
  const [activeStep, setActiveStep] = useState(0);
  const current = LANDING_HOWITWORKS[activeStep];

  return (
    <div className="bg-white rounded-3xl border border-[#180126]/10 p-6 sm:p-8 shadow-sm space-y-6 max-w-4xl mx-auto">
      {/* Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#F7F3ED] p-1.5 rounded-2xl">
        {LANDING_HOWITWORKS.map((step, idx) => (
          <button
            key={step.num}
            onClick={() => setActiveStep(idx)}
            className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
              activeStep === idx
                ? "bg-[#082F24] text-[#B8FF00] shadow-sm"
                : "text-[#180126]/70 hover:text-[#180126]"
            }`}
          >
            <span className="font-extrabold">{step.num}.</span>
            <span className="truncate">{step.title}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex flex-col md:flex-row items-center gap-6 pt-2">
        <div className="w-16 h-16 rounded-2xl bg-[#082F24] text-[#B8FF00] flex items-center justify-center flex-shrink-0 shadow-md">
          <LIcon name={current.icon} className="w-8 h-8" />
        </div>
        <div className="space-y-2 text-center md:text-left flex-1">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <span className="text-xs font-extrabold uppercase bg-[#B8FF00] text-[#082F24] px-2.5 py-0.5 rounded-full">
              Step {current.num}
            </span>
            <h3 className="text-xl font-extrabold font-heading text-[#180126]">{current.title}</h3>
          </div>
          <p className="text-sm text-[#180126]/70 leading-relaxed">{current.desc}</p>
        </div>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-[#F7F3ED] py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-[#00BD00] font-bold text-xs tracking-[0.2em] uppercase mb-3">How it works</p>
          <h2 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold font-heading text-[#180126] tracking-tight leading-tight">
            Live in weeks,{" "}
            <span className="bg-[#B8FF00] px-2 rounded-2xl">not years.</span>
          </h2>
          <p className="mt-4 text-[#180126]/60 leading-relaxed max-w-xl mx-auto">
            From sign-up to first redemption in four simple steps — we handle the heavy lifting.

          </p>
        </div>

        <HowItWorksMultiTab />

        <div className="mt-12 text-center">
          <Link to="/register" className="inline-flex items-center justify-center gap-2.5 bg-[#180126] hover:bg-[#2b0140] text-white font-bold text-sm h-12 px-8 rounded-[24px] hover:shadow-xl hover:-translate-y-0.5 transition-all">
            Start free today
            <span className="w-5 h-5 rounded-full bg-[#B8FF00] flex items-center justify-center text-[#180126] text-xs font-extrabold">→</span>
          </Link>
          <p className="mt-3 text-[11px] text-[#180126]/45">No credit card required · 14-day free trial</p>
        </div>
      </div>
    </section>
  );
}
