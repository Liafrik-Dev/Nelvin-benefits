import React from "react";
import Navbar from "@/components/nelvin/Navbar";
import HeroSection from "@/components/nelvin/HeroSection";
import TrustedBrands from "@/components/nelvin/TrustedBrands";
import CategoriesGrid from "@/components/nelvin/CategoriesGrid";
import OnePlatformExperiences from "@/components/nelvin/OnePlatformExperiences";
import PowerfulModules from "@/components/nelvin/PowerfulModules";
import AfricaMena from "@/components/nelvin/AfricaMena";
import AudiencesSection from "@/components/nelvin/AudiencesSection";
import HowItWorks from "@/components/nelvin/HowItWorks";
import StatsSection from "@/components/nelvin/StatsSection";
import Testimonials from "@/components/nelvin/Testimonials";
import FeaturedDeals from "@/components/nelvin/FeaturedDeals";
import GetTheApp from "@/components/nelvin/GetTheApp";
import PricingSection from "@/components/nelvin/PricingSection";
import FAQSection from "@/components/nelvin/FAQSection";
import Footer from "@/components/nelvin/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-forest-secondary font-sans">
      <Navbar />
      <HeroSection />
      <TrustedBrands />
      <CategoriesGrid />
      <OnePlatformExperiences />
      <PowerfulModules />
      <AfricaMena />
      <AudiencesSection />
      <HowItWorks />
      <StatsSection />
      <Testimonials />
      <FeaturedDeals />
      <GetTheApp />
      <PricingSection />
      <FAQSection />
      <Footer />
    </div>
  );
}