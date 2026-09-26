import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Rocket, ShieldCheck, Globe2 } from "lucide-react";
import { SectionHeading } from "@/components/nelvin/Brand";

/**
 * This used to be three testimonials attributed to named people at named
 * companies ("Chidi Eze, CHRO, Continental Bank"...) with stock photos and
 * specific results ("engagement tripled", "rolled out in 9 markets") — none
 * of it real; there are zero customers on the platform yet. Replaced with an
 * honest founding-partner pitch. Swap this back to real quotes once there
 * are real HR teams to quote.
 */
const REASONS = [
  {
    icon: Rocket,
    title: "Be a founding partner",
    desc: "Early HR teams help shape the roadmap and get preferential terms as we grow across the continent.",
  },
  {
    icon: ShieldCheck,
    title: "Vetted from day one",
    desc: "Every merchant is reviewed before their offers go live — no filler listings, no dead links.",
  },
  {
    icon: Globe2,
    title: "Built for how Africa actually works",
    desc: "Local currencies, local payment rails and local merchants, not a global platform bolted on afterwards.",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="surface-nv-secondary section-nv">
      <div className="container-nv">
        <SectionHeading
          eyebrow="Why teams are joining early"
          title={<>Built with our first partners, not just for them.</>}
        />

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {REASONS.map((r) => (
            <div key={r.title} className="card-nv card-nv-interactive flex flex-col p-7">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#1B4F9C]/10">
                <r.icon className="h-5 w-5 text-gold" />
              </span>
              <p className="mt-5 text-base font-extrabold text-ivory">{r.title}</p>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-ivory-muted">{r.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link to="/corporate" className="btn-nv btn-nv-lg btn-nv-gold group">
            Talk to us about launching early
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}