import React from "react";
import { Quote } from "lucide-react";

const stats = [
  { value: "5m", label: "Employees supported" },
  { value: "126", label: "Countries" },
  { value: "3000+", label: "Customers" },
  { value: "4x", label: "Increase in engagement in benefits" },
];

const testimonials = [
  {
    quote: "You've made our international benefits dreams come true! We're able to showcase benefits in a way we've never done before.",
    name: "Samantha Sergent",
    role: "Director of International Benefits",
    logo: "/images/benifex/logos/microsoft-logo.png",
  },
  {
    quote: "We wanted a platform that could be a single source of truth... We went from very manual processes to complete digital transformation.",
    name: "Jennifer Burnett",
    role: "Director of US Benefits",
    logo: "/images/benifex/logos/snowflake-logo.png",
  },
];

export default function StatsSection() {
  return (
    <section className="bg-[#180126] py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "radial-gradient(circle at 20% 20%, #7637E3 0, transparent 40%), radial-gradient(circle at 80% 80%, #00BD00 0, transparent 40%)",
        }}
      />
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <p className="text-[#B8FF00] font-semibold text-xs tracking-[0.2em] uppercase mb-3">The Nelvin platform</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-white tracking-tight max-w-3xl mx-auto leading-tight">
            Create remarkable rewards and benefits experiences with a global platform
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-20">
          {stats.map((stat) => (
            <div key={stat.label} className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center">
              <p className="text-4xl sm:text-5xl font-extrabold font-heading text-[#B8FF00]">{stat.value}</p>
              <p className="text-white/60 text-sm mt-2 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <figure key={t.name} className="border-2 border-[#B8FF00] rounded-3xl p-8">
              <Quote className="w-8 h-8 text-[#7637E3]" />
              <blockquote className="mt-4 text-white/90 text-base sm:text-lg leading-relaxed">
                "{t.quote}"
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-4">
                <img src={t.logo} alt={t.name} className="h-10 w-auto max-w-32 object-contain brightness-200" />
                <div>
                  <p className="font-bold text-white text-sm">{t.name}</p>
                  <p className="text-white/50 text-xs">{t.role}</p>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
