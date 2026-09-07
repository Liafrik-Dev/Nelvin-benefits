import React from "react";
import { Star, Quote } from "lucide-react";

const testimonial = {
  quote: "Nelvin transformed how we reward and engage our people across Africa. One platform, one home for everything at work — our members finally feel the value of every benefit we offer.",
  name: "Amina Yusuf",
  role: "Head of People, Pan-African Group",
  avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a?w=120&q=80",
};

export default function Testimonials() {
  return (
    <section className="bg-[#F7F3ED] py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <div className="w-12 h-12 rounded-full bg-[#7637E3] flex items-center justify-center mx-auto mb-6">
          <Quote className="w-5 h-5 text-white" />
        </div>
        <div className="flex justify-center gap-1 mb-6">
          {[...Array(5)].map((_, j) => (
            <Star key={j} className="w-5 h-5 fill-[#B8FF00] text-[#B8FF00]" />
          ))}
        </div>
        <blockquote className="text-xl sm:text-2xl md:text-3xl font-bold font-heading text-[#180126] leading-snug max-w-3xl mx-auto">
          "{testimonial.quote}"
        </blockquote>
        <div className="mt-8 flex items-center justify-center gap-4">
          <img src={testimonial.avatar} alt={testimonial.name} className="w-14 h-14 rounded-full object-cover ring-4 ring-white" />
          <div className="text-left">
            <p className="font-bold text-[#180126]">{testimonial.name}</p>
            <p className="text-sm text-[#180126]/60">{testimonial.role}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
