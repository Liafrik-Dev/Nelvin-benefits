import React from "react";
import { Star, Quote } from "lucide-react";
import { SectionHeading } from "@/components/nelvin/Brand";

const TESTIMONIALS = [
  {
    quote: "Membership engagement more than tripled in the first quarter. Nelvin made us feel like a global company overnight.",
    name: "Chidi Eze",
    role: "CHRO, West Africa",
    img: "https://randomuser.me/api/portraits/men/32.jpg",
    company: "Continental Bank",
  },
  {
    quote: "The wallet and local payments were the game-changer. Our people actually use their benefits now — every single day.",
    name: "Fatima Al-Mansouri",
    role: "Head of People",
    img: "https://randomuser.me/api/portraits/women/44.jpg",
    company: "Gulf Retail Group",
  },
  {
    quote: "We rolled out Nelvin in 9 markets before lunch. The localisation is effortless — currencies, languages, merchants: it just works.",
    name: "Thabo Mokoena",
    role: "Group Reward Director",
    img: "https://randomuser.me/api/portraits/men/85.jpg",
    company: "Safari Hospitality",
  },
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="surface-nv-secondary section-nv">
      <div className="container-nv">
        <SectionHeading
          eyebrow="Testimonials"
          title={<>Loved by HR teams, member-adored.</>}
        />

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <figure
              key={t.name}
              className="card-nv card-nv-interactive flex flex-col p-7"
            >
              <Quote className="mb-5 h-8 w-8 text-[#0866FF]/30" />
              <div className="mb-4 flex items-center gap-1" aria-label="Rated 5 out of 5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#0866FF] text-[#0866FF]" />
                ))}
              </div>
              <blockquote className="flex-1 text-sm leading-relaxed text-ivory-muted">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3 border-t border-[#F1F1F1] pt-5">
                <img
                  src={t.img}
                  alt=""
                  loading="lazy"
                  className="h-11 w-11 rounded-full object-cover ring-2 ring-[#0866FF]/40"
                />
                <div>
                  <p className="text-sm font-extrabold text-ivory">{t.name}</p>
                  <p className="text-[10px] font-semibold text-ivory-dim">{t.role}</p>
                  <p className="text-[10px] font-bold text-gold">{t.company}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}