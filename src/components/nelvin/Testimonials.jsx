import React from "react";
import { Star } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const testimonialsData = [
  {
    quoteKey: "testimonials.quote1",
    nameKey: "testimonials.name1",
    roleKey: "testimonials.role1",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80",
  },
  {
    quoteKey: "testimonials.quote2",
    nameKey: "testimonials.name2",
    roleKey: "testimonials.role2",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80",
  },
  {
    quoteKey: "testimonials.quote3",
    nameKey: "testimonials.name3",
    roleKey: "testimonials.role3",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80",
  },
];

export default function Testimonials() {
  const { t } = useLanguage();
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#faf8f5]">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-emerald-700 font-semibold text-xs tracking-[0.15em] uppercase mb-3">{t('testimonials.eyebrow')}</p>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-gray-900">{t('testimonials.title')}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonialsData.map((testimonial, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex gap-0.5 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-gray-800 text-sm leading-relaxed mb-6">{t(testimonial.quoteKey)}</p>
              <div className="flex items-center gap-3">
                <img src={testimonial.avatar} alt={t(testimonial.nameKey)} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <p className="font-semibold text-sm text-gray-900">{t(testimonial.nameKey)}</p>
                  <p className="text-xs text-gray-400">{t(testimonial.roleKey)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}