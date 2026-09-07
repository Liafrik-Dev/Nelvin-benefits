import React, { useState } from "react";
import { Plus, Minus, MessageCircle } from "lucide-react";

const faqs = [
  { q: "How does Nelvin Benefits work?", a: "Nelvin is a membership-based savings platform. Sign up, choose your plan,and instantly access thousands of exclusive offers and cashback rewards from top brands across Africa." },
  { q: "Which countries is Nelvin Benefits available in?", a: "Nelvin is currently live across all 54 African countries,with over 500,000 exclusive offers available from 20,000+ partner brands." },
  { q: "Can I use my membership when I travel?", a: "Yes! Your Nelvin membership works across all African countries. Whether you're dining in Lagos, shopping in Nairobi, or enjoying a spa in Marrakech — your benefits travel with you." },
  { q: "How are merchants verified?", a: "Every merchant on our platform goes through a thorough verification process including business registration, quality checks,and ongoing customer feedback monitoring." },
  { q: "Can businesses join Nelvin Benefits?", a: "Absolutely! Businesses can join as merchant partners to reach millions of engaged members. Visit our For Business page to learn about partnership opportunities." },
  { q: "What about corporate memberships?", a: "We offer tailored corporate plans for businesses that want to provide savings benefits to their employees. Contact our enterprise team for custom packages." },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="bg-[#F7F3ED] py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12">
        <div className="lg:w-1/3">
          <p className="text-[#180126]/50 font-semibold text-xs tracking-[0.15em] uppercase mb-3">Frequently Asked</p>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-[#180126] leading-tight">
            Everything you need to{" "}
            <span className="bg-[#B8FF00] px-1 rounded-xl">know.</span>
          </h2>
          <p className="text-[#180126]/60 text-sm mt-4 leading-relaxed">
            Can't find your answer? Our support team responds in under an hour, seven days a week.

          </p>
          <a href="mailto:Nelvin23@proton.me" className="mt-6 group inline-flex items-center gap-3 bg-[#180126] hover:bg-[#2b0140] text-white px-6 h-11 rounded-[23px] font-bold text-sm transition-colors w-fit">
            <MessageCircle className="w-4 h-4" /> Talk to us
          </a>
        </div>

        <div className="lg:w-2/3 space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-[#180126]/10 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="font-bold text-[#180126] text-sm pr-4">{faq.q}</span>
                {openIndex === i ? (
                  <Minus className="w-4 h-4 text-[#00BD00] flex-shrink-0" />
                ) : (
                  <Plus className="w-4 h-4 text-[#180126] flex-shrink-0" />
                )}
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-[#180126]/60 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}