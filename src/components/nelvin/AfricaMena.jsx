import React from "react";
import { Link } from "react-router-dom";
import { Quote } from "lucide-react";
import LIcon from "@/components/nelvin/LandingIcons";
import { SectionHeading } from "@/components/nelvin/Brand";
import { LANDING_AFRICA_POINTS } from "@/lib/landingData";

const PHOTOS = [
  { src: "/images/benifex/africa/nigeria.jpg", label: "Lagos, Nigeria", tall: true },
  { src: "/images/benifex/africa/kenya.jpg", label: "Nairobi, Kenya" },
  { src: "/images/benifex/africa/morocco.jpg", label: "Marrakech, Morocco" },
  { src: "/images/benifex/africa/egypt.jpg", label: "Cairo, Egypt" },
  { src: "/images/benifex/africa/south-africa.jpg", label: "Cape Town, South Africa" },
  { src: "/images/benifex/africa/tanzania.jpg", label: "Zanzibar, Tanzania" },
];

const COUNTRIES = ["Nigeria", "Kenya", "Egypt", "Morocco", "South Africa", "Ghana", "Tanzania", "Rwanda"];

function RegionPhoto({ photo }) {
  return (
    <div
      className={`group relative overflow-hidden rounded-xl ${
        photo.tall ? "row-span-2 h-full min-h-40" : "h-40"
      }`}
    >
      <img
        src={photo.src}
        alt={photo.label}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
      <span className="absolute bottom-2.5 left-3 text-[11px] font-bold text-white drop-shadow">
        {photo.label}
      </span>
    </div>
  );
}

export default function AfricaMena() {
  return (
    <section id="africa" className="surface-nv-primary section-nv relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-70"
        style={{ backgroundImage: "radial-gradient(50% 50% at 88% 12%, rgba(27,79,156,0.06) 0%, transparent 60%), radial-gradient(45% 45% at 8% 92%, rgba(27,79,156,0.05) 0%, transparent 55%)" }}
        aria-hidden="true"
      />
      <div className="relative z-10 container-nv grid grid-cols-1 items-center gap-14 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading
            align="left"
            eyebrow="Africa & MENA"
            title={<>Built for Africa. Ready for the world.</>}
            lead="We started in Africa because that's where the biggest opportunity — and the greatest complexity — lives. Local payments, local merchants, local languages: Nelvin was born here and works everywhere."
            className="max-w-lg"
          />

          <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
            {LANDING_AFRICA_POINTS.map((pt) => (
              <div
                key={pt.title}
                className="flex items-start gap-3 rounded-xl border border-[#EDEDED] bg-[#F9F8F7] p-3.5 transition-colors hover:border-[#1B4F9C]/35"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1B4F9C]/12">
                  <LIcon name={pt.icon} className="h-4 w-4 text-gold" />
                </span>
                <div className="min-w-0">
                  <p className="text-sm font-extrabold text-[#282828]">{pt.title}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-ivory-muted">{pt.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-2">
            {COUNTRIES.map((c) => (
              <Link
                key={c}
                to={`/country/${c.toLowerCase().replace(/\s+/g, "-")}`}
                className="inline-flex min-h-9 items-center rounded-full border border-[#1B4F9C]/25 bg-[#1B4F9C]/10 px-4 py-2 text-[11px] font-bold text-gold transition-colors hover:bg-gold hover:text-white"
              >
                {c}
              </Link>
            ))}
            <Link
              to="/offers"
              className="inline-flex min-h-9 items-center rounded-full border border-[#F1F1F1] px-4 py-2 text-[11px] font-bold text-ivory-muted transition-colors hover:border-[#1B4F9C]/40 hover:text-gold"
            >
              +46 more
            </Link>
          </div>
        </div>

        <div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:grid-rows-2">
            {PHOTOS.map((p) => (
              <RegionPhoto key={p.label} photo={p} />
            ))}
          </div>

          <blockquote className="mt-6 rounded-2xl border border-[#F1F1F1] bg-[#FFFFFF] p-6 shadow-nv-card">
            <Quote className="h-7 w-7 text-gold" />
            <p className="mt-3 text-sm italic leading-relaxed text-ivory-muted">
              "Nelvin let us roll out benefits in 12 African markets in six weeks —
              localised payments, currencies and deals — something our old provider
              couldn't do in two years."
            </p>
            <footer className="mt-5 flex items-center gap-3">
              <img
                src="https://randomuser.me/api/portraits/women/65.jpg"
                alt=""
                loading="lazy"
                className="h-10 w-10 rounded-full object-cover ring-2 ring-gold"
              />
              <div>
                <p className="text-xs font-extrabold text-[#282828]">Amina Okafor</p>
                <p className="text-[10px] text-ivory-dim">Head of Total Rewards, Pan-African Bank</p>
              </div>
            </footer>
          </blockquote>
        </div>
      </div>
    </section>
  );
}