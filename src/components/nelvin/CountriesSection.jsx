import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Play, FileText } from "lucide-react";

/**
 * Insights / resources rail. Not part of the current Home composition but
 * kept working and aligned with the shared design tokens.
 */

const resources = [
  {
    type: "Webinar",
    title: "How Red Hat is Modernizing Global Benefits With Data and Technology",
    img: "/images/benifex/8.png",
  },
  {
    type: "Report",
    title: "Is it time to quit the generation game in employee benefits?",
    img: "/images/benifex/9.png",
  },
  {
    type: "Webinar",
    title: "Your workforce is changing. Are your benefits keeping up?",
    img: "/images/benifex/9.png",
  },
  {
    type: "Report",
    title: "Energizing Reward and Benefits",
    img: "/images/benifex/8.png",
  },
];

export default function CountriesSection() {
  return (
    <section id="events" className="surface-nv-secondary section-nv">
      <div className="container-nv">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow-nv mb-3">Insights</p>
            <h2 className="text-balance-nv text-3xl font-bold font-heading tracking-tight text-ivory sm:text-4xl">
              Latest resources, events &amp; insights
            </h2>
          </div>
          <Link to="/offers" className="btn-nv btn-nv-md btn-nv-outline group w-fit shrink-0">
            See all resources
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {resources.map((r) => (
            <Link
              key={r.type + r.title}
              to="/offers"
              className="card-nv card-nv-interactive group overflow-hidden"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={r.img}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-gold px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-[#062B23]">
                  {r.type === "Webinar" ? <Play className="h-3 w-3" /> : <FileText className="h-3 w-3" />}
                  {r.type}
                </span>
              </div>
              <div className="p-5">
                <h3 className="text-sm font-bold leading-snug text-ivory transition-colors group-hover:text-gold">
                  {r.title}
                </h3>
                <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-gold">
                  Read more <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}