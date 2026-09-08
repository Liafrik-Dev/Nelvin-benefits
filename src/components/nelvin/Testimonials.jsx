import React from "react";
import { Star, Quote } from "lucide-react";

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
    <section id="testimonials" className="bg-[#F7F3ED] py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-[#00BD00] font-bold text-xs tracking-[0.2em] uppercase mb-3">Testimonials</p>
          <h2 className="text-3xl sm:text-4xl xl:text-5xl font-extrabold font-heading text-[#180126] tracking-tight leading-tight">
            Loved by HR teams,{" "}
            <span className="bg-[#B8FF00] px-2 rounded-2xl">member-adored.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t) => (
            <figure key={t.name} className="relative bg-white rounded-3xl p-7 ring-1 ring-[#180126]/8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
              <Quote className="w-8 h-8 text-[#00BD00]/30 mb-4" />
              <div className="flex items-center gap-1 mb-4">{[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-[#FFC107] text-[#FFC107]" />
              ))}</div>
              <blockquote className="text-sm text-[#180126]/80 leading-relaxed flex-1">"{t.quote}"</blockquote>
              <figcaption className="mt-6 pt-5 border-t border-[#180126]/8 flex items-center gap-3">
                <img src={t.img} alt={t.name} loading="lazy" className="w-11 h-11 rounded-full object-cover ring-2 ring-[#00BD00]/30" />
                <div>
                  <p className="text-sm font-extrabold text-[#180126]">{t.name}</p>
                  <p className="text-[10px] text-[#180126]/50 font-semibold">{t.role}</p>
                  <p className="text-[10px] font-bold text-[#00BD00]">{t.company}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
