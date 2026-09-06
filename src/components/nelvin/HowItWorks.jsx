import React from "react";
import { UserPlus, Search, QrCode, Wallet } from "lucide-react";
import { useLanguage } from "@/lib/i18n";

const steps = [
  { num: "01", icon: UserPlus, titleKey: "home.step1.title", descKey: "home.step1.desc", color: "bg-emerald-700" },
  { num: "02", icon: Search, titleKey: "home.step2.title", descKey: "home.step2.desc", color: "bg-rose-500" },
  { num: "03", icon: QrCode, titleKey: "home.step3.title", descKey: "home.step3.desc", color: "bg-emerald-700" },
  { num: "04", icon: Wallet, titleKey: "home.step4.title", descKey: "home.step4.desc", color: "bg-rose-500" },
];

export default function HowItWorks() {
  const { t } = useLanguage();
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-[#faf8f5]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-emerald-700 font-semibold text-xs tracking-[0.15em] uppercase mb-3">{t('home.eyebrow')}</p>
          <h2 className="text-3xl sm:text-4xl font-bold font-heading text-gray-900">{t('home.title')}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {steps.map((step, i) => (
            <div key={i} className="bg-white rounded-2xl p-6 border border-gray-100 relative">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${step.color}`}>
                  <step.icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-4xl font-bold text-gray-100 font-heading">{step.num}</span>
              </div>
              <h3 className="font-bold text-gray-900 text-lg mb-2">{t(step.titleKey)}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{t(step.descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}