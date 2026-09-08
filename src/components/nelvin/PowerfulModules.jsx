import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import LIcon from "@/components/nelvin/LandingIcons";
import { LANDING_MODULES } from "@/lib/landingData";

export default function PowerfulModules() {
  return (
    <section id="modules" className="bg-[#F7F3ED] py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-14">
          <div className="max-w-2xl">
            <p className="text-[#00BD00] font-bold text-xs tracking-[0.2em] uppercase mb-3">Powerful modules</p>
            <h2 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold font-heading text-[#180126] tracking-tight leading-tight">
              Everything a modern{" "}
              <span className="bg-[#B8FF00] px-2 rounded-2xl">benefits platform</span>{" "}
              needs — built in.
            </h2>
            <p className="mt-4 text-[#180126]/60 leading-relaxed max-w-xl">
              Twenty battle-tested modules, deeply integrated. Start with marketplace,
              then grow into the full employee experience platform.

            </p>
          </div>
          <Link to="/choose-plan" className="group inline-flex items-center gap-2 text-[#180126] font-bold text-sm whitespace-nowrap">
            <span className="transition-transform group-hover:-translate-x-1">Compare plans</span>
            <span className="w-7 h-7 rounded-full bg-[#180126] group-hover:bg-[#00BD00] transition-colors flex items-center justify-center text-white text-xs font-extrabold">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {LANDING_MODULES.map((mod) => (
            <Link
              key={mod.name}
              to={mod.link}
              className="group relative bg-white rounded-3xl p-6 ring-1 ring-[#180126]/8 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:ring-[#00BD00]/40 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-28 h-28 rounded-full bg-[#00BD00]/5 group-hover:bg-[#B8FF00]/40 group-hover:scale-150 transition-all duration-500" />
              <div className="relative">
                <div className="w-11 h-11 rounded-2xl bg-[#180126] text-[#B8FF00] flex items-center justify-center mb-4 group-hover:bg-[#7637E3] group-hover:text-white group-hover:scale-110 transition-all duration-300">
                  <LIcon name={mod.icon} className="w-5 h-5" />
                </div>
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-extrabold font-heading text-[#180126] leading-snug">{mod.name}</h3>
                  <span className="w-6 h-6 rounded-full bg-[#180126]/5 flex items-center justify-center text-[#180126]/50 opacity-0 group-hover:opacity-100 transition-all group-hover:rotate-45">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
                <p className="mt-2 text-xs text-[#180126]/55 leading-relaxed">{mod.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}