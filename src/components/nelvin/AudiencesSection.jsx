import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";
import { LANDING_AUDIENCES } from "@/lib/landingData";

export default function AudiencesSection() {
  return (
    <section id="audiences" className="bg-white py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-[#00BD00] font-bold text-xs tracking-[0.2em] uppercase mb-3">Who it's for</p>
          <h2 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold font-heading text-[#180126] tracking-tight leading-tight">
            One platform that keeps{" "}
            <span className="relative inline-block">
              <span className="relative z-10 bg-[#B8FF00] px-2 rounded-2xl">everyone happy.</span>
            </span>
          </h2>
          <p className="mt-4 text-[#180126]/60 leading-relaxed max-w-xl mx-auto">
            Whether you're a member, an employer or a partner — Nelvin has a home for you.

          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {LANDING_AUDIENCES.map((aud) => (
            <div
              key={aud.title}
              className="group relative bg-[#F7F3ED] rounded-3xl overflow-hidden ring-1 ring-[#180126]/10 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
            >
              <div className="relative h-48 overflow-hidden">
                <img src={aud.img} alt={aud.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#180126]/70 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 bg-[#B8FF00] text-[#082F24] text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full">{aud.kicker}</span>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-extrabold font-heading text-[#180126]">{aud.title}</h3>
                <p className="mt-2 text-xs text-[#180126]/60 leading-relaxed">{aud.desc}</p>
                <ul className="mt-4 space-y-2 flex-1">
                  {aud.points.map((pt) => (
                    <li key={pt} className="flex items-center gap-2 text-sm text-[#180126]/75">
                      <span className="w-5 h-5 rounded-full bg-[#00BD00]/10 flex items-center justify-center flex-shrink-0">
                        <Check className="w-3 h-3 text-[#00BD00]" />
                      </span>
                      {pt}
                    </li>
                  ))}
                </ul>
                <Link
                  to={aud.to}
                  className="mt-6 inline-flex items-center justify-center gap-2 bg-[#180126] group-hover:bg-[#7637E3] text-white font-bold text-sm h-11 px-5 rounded-[22px] transition-colors"
                >
                  {aud.cta}
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}