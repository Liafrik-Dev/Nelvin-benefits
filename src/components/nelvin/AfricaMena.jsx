import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Quote } from "lucide-react";
import LIcon from "@/components/nelvin/LandingIcons";
import { LANDING_AFRICA_POINTS } from "@/lib/landingData";

const PHOTOS = [
  { src: "/images/benifex/africa/nigeria.jpg", label: "Lagos, Nigeria", w: "col-span-2 row-span-2" },
  { src: "/images/benifex/africa/kenya.jpg", label: "Nairobi, Kenya", w: "" },
  { src: "/images/benifex/africa/morocco.jpg", label: "Marrakech, Morocco", w: "" },
  { src: "/images/benifex/africa/egypt.jpg", label: "Cairo, Egypt", w: "" },
  { src: "/images/benifex/africa/south-africa.jpg", label: "Cape Town, South Africa", w: "" },
  { src: "/images/benifex/africa/tanzania.jpg", label: "Zanzibar, Tanzania", w: "col-span-2" },
];

function AfricaPhoto({ p }) {
  return (
    <div className={`relative ${p.w} h-40 sm:h-44 overflow-hidden rounded-2xl group`}>
      <img src={p.src} alt={p.label} loading="lazy" className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#180126]/70 via-transparent to-transparent" />
      <span className="absolute bottom-2.5 left-3 text-[11px] font-bold text-white drop-shadow">{p.label}</span>
    </div>
  );
}

export default function AfricaMena() {
  return (
    <section id="africa" className="bg-[#082F24] py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-15"
        style={{ backgroundImage: "radial-gradient(50% 50% at 85% 15%, rgba(184,255,0,0.3) 0%, transparent 60%), radial-gradient(45% 45% at 10% 90%, rgba(118,55,227,0.4) 0%, transparent 55%)" }}
      />
      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
        <div>
          <p className="text-[#B8FF00] font-bold text-xs tracking-[0.2em] uppercase mb-3">Africa &amp; MENA</p>
          <h2 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold font-heading text-white tracking-tight leading-tight">
            Built for Africa.<br />Ready for{" "}
            <span className="bg-[#B8FF00] text-[#082F24] px-2 rounded-2xl">the world.</span>
          </h2>
          <p className="mt-5 text-white/70 leading-relaxed max-w-lg">
            We started in Africa because that's where the biggest opportunity — and the greatest
            complexity — lives. Local payments, local merchants, local languages:
            Nelvin was born here and works everywhere.

          </p>

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
            {LANDING_AFRICA_POINTS.map((pt) => (
              <div key={pt.title} className="flex items-start gap-3 bg-white/5 backdrop-blur rounded-2xl p-3.5 ring-1 ring-white/10 hover:ring-[#B8FF00]/40 hover:bg-white/10 transition-all">
                <span className="w-9 h-9 rounded-xl bg-[#B8FF00]/15 flex items-center justify-center flex-shrink-0">
                  <LIcon name={pt.icon} className="w-4.5 h-4.5 text-[#B8FF00]" />
                </span>
                <div>
                  <p className="text-sm font-extrabold text-white">{pt.title}</p>
                  <p className="text-[11px] text-white/55 mt-1 leading-relaxed">{pt.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            {["Nigeria", "Kenya", "Egypt", "Morocco", "South Africa", "Ghana", "Tanzania", "Rwanda", "+46 more"].map((c) => (
              <Link
                key={c}
                to={c.endsWith("more") ? "/country/nigeria" : `/country/${c.toLowerCase().replace(/\s+/g,"-")}`}
                className="text-[11px] font-bold text-[#082F24] bg-[#B8FF00] hover:bg-white px-3.5 py-1.5 rounded-full transition-colors"
              >
                {c}
              </Link>
            ))}
          </div>
        </div>

        <div className="lg:pl-6">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-3">
              {PHOTOS.slice(0, 3).map((p) => <AfricaPhoto key={p.label} p={p} />)}
            </div>
            <div className="flex flex-col gap-3 mt-10">
              {PHOTOS.slice(3).map((p) => <AfricaPhoto key={p.label} p={p} />)}
            </div>
          </div>
          <div className="relative mt-8 bg-[#180126] rounded-3xl p-6 ring-1 ring-white/10 shadow-2xl">
            <Quote className="w-8 h-8 text-[#B8FF00]" />
            <p className="mt-3 text-sm text-white/85 leading-relaxed italic">
              "Nelvin let us roll out benefits in 12 African markets in six weeks —
              localised payments, currencies and deals — something our old provider couldn't
              do in two years."

            </p>
            <div className="mt-4 flex items-center gap-3">
              <img
                src="https://randomuser.me/api/portraits/women/65.jpg"
                alt=""
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#B8FF00]"
              />
              <div>
                <p className="text-xs font-extrabold text-white">Amina Okafor</p>
                <p className="text-[10px] text-white/50">Head of Total Rewards, Pan-African Bank</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}