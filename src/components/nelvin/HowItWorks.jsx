import React from "react";
import { Link } from "react-router-dom";
import LIcon from "@/components/nelvin/LandingIcons";
import { LANDING_HOWITWORKS } from "@/lib/landingData";

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

        <div className="relative grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="hidden lg:block absolute top-12 left-[12%] right-[12%] h-px bg-[#180126]/10" />
          {LANDING_HOWITWORKS.map((step, i) => (
            <div key={step.num} className="relative bg-white rounded-3xl p-7 ring-1 ring-[#180126]/8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between mb-5">
                <span className={`w-14 h-14 rounded-2xl flex items-center justify-center ${i === 3 ? "bg-[#082F24] text-[#B8FF00]" : "bg-[#180126] text-[#B8FF00]"}`}>
                  <LIcon name={step.icon} className="w-6 h-6" />
                </span>
                <span className="text-4xl font-extrabold font-heading text-[#180126]/10">{step.num}</span>
              </div>
              <h3 className="text-base font-extrabold font-heading text-[#180126]">{step.title}</h3>
              <p className="mt-2 text-xs text-[#180126]/60 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

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
