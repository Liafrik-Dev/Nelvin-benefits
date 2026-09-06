import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ArrowRight } from "lucide-react";
import HeroBackground from "@/components/nelvin/HeroBackground";
import HeroBadge from "@/components/nelvin/HeroBadge";
import HeroStats from "@/components/nelvin/HeroStats";
import HeroSearchPanel from "@/components/nelvin/HeroSearchPanel";
import { useLanguage } from "@/lib/i18n";

export default function HeroSection() {
  const { t } = useLanguage();
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden bg-black">
      <HeroBackground />

      <div className="relative z-10 flex-1 flex flex-col justify-center sm:px-10 lg:px-16 px-6">
        <HeroBadge />

        <h1 className="font-heading font-bold text-white uppercase leading-[0.95] tracking-tight animate-fade-up-delay-1">
          <span className="block text-[clamp(2rem,9vw,6.5rem)]">{t('hero.titleMain')}</span>
          <span className="block text-[clamp(2rem,9vw,6.5rem)] text-amber-400">{t('hero.titleSub')}</span>
        </h1>

        <p className="text-white/75 leading-relaxed max-w-md mt-6 lg:mt-8 animate-fade-up-delay-2 [font-family:'Bodoni_Moda',_serif] text-base sm:text-base">{t('hero.description')}

        </p>

        <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-3 sm:gap-4 mt-8 lg:mt-10 animate-fade-up-delay-3">
          <Link to="/choose-plan" className="bg-amber-500 hover:bg-amber-600 text-white font-semibold px-7 py-3.5 rounded-full transition-all text-sm flex items-center justify-center gap-2">
            {t('hero.ctaMember')} <ArrowRight className="w-4 h-4" />
          </Link>
          <Link to="/offers" className="bg-white/15 hover:bg-white/25 backdrop-blur-sm text-white font-semibold px-7 py-3.5 rounded-full transition-all text-sm border border-white/20 text-center">
            {t('hero.ctaBrowse')}
          </Link>
          <Link to="/choose-plan" className="text-white/80 hover:text-white font-semibold px-2 py-3.5 transition-all text-sm underline underline-offset-4 text-center sm:text-left">
            {t('hero.ctaMembership')}
          </Link>
        </div>

        <div className="flex items-center gap-2 mt-6 text-white/70 text-xs font-medium animate-fade-up-delay-3">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          {t('hero.verified')}
        </div>

        <div className="animate-fade-up-delay-4">
          <HeroStats />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-3xl mx-auto animate-slide-up px-4 pb-6 sm:pb-10 rounded-sm">
        <HeroSearchPanel />
      </div>
    </section>);

}