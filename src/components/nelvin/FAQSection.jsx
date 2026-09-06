import React, { useState } from "react";
import { Plus, Minus, MessageCircle } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const faqs = [
  { qKey: "faq.q1", aKey: "faq.a1" },
  { qKey: "faq.q2", aKey: "faq.a2" },
  { qKey: "faq.q3", aKey: "faq.a3" },
  { qKey: "faq.q4", aKey: "faq.a4" },
  { qKey: "faq.q5", aKey: "faq.a5" },
  { qKey: "faq.q6", aKey: "faq.a6" },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-[#faf8f5]">
      <div className="max-w-5xl mx-auto flex flex-col lg:flex-row gap-12">
        <div className="lg:w-1/3">
          <p className="text-gray-400 font-semibold text-xs tracking-[0.15em] uppercase mb-3">{t('faq.title.eyebrow')}</p>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-gray-900 leading-tight">
            {t('faq.title')}{" "}
            <span className="italic text-emerald-700">{t('faq.title.highlight')}</span>
          </h2>
          <p className="text-gray-500 text-sm mt-4 leading-relaxed">
            {t('faq.desc')}
          </p>
          <a href="mailto:Nelvin23@proton.me" className="mt-6 bg-emerald-700 hover:bg-emerald-800 text-white px-6 py-3 rounded-full font-semibold text-sm transition-colors flex items-center gap-2 w-fit">
            <MessageCircle className="w-4 h-4" /> {t('faq.cta')}
          </a>
        </div>

        <div className="lg:w-2/3 space-y-3">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-gray-100 overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-5 text-left"
              >
                <span className="font-semibold text-gray-900 text-sm pr-4">{t(faq.qKey)}</span>
                {openIndex === i ? (
                  <Minus className="w-4 h-4 text-gray-400 flex-shrink-0" />
                ) : (
                  <Plus className="w-4 h-4 text-gray-400 flex-shrink-0" />
                )}
              </button>
              {openIndex === i && (
                <div className="px-6 pb-5">
                  <p className="text-sm text-gray-500 leading-relaxed">{t(faq.aKey)}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}