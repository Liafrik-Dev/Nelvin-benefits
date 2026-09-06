import React from "react";
import Navbar from "@/components/nelvin/Navbar";
import HeroSection from "@/components/nelvin/HeroSection";
import TrustedBrands from "@/components/nelvin/TrustedBrands";
import FeaturedDeals from "@/components/nelvin/FeaturedDeals";
import CategoriesGrid from "@/components/nelvin/CategoriesGrid";
import StatsSection from "@/components/nelvin/StatsSection";
import CountriesSection from "@/components/nelvin/CountriesSection";
import HowItWorks from "@/components/nelvin/HowItWorks";
import PricingSection from "@/components/nelvin/PricingSection";
import Testimonials from "@/components/nelvin/Testimonials";
import GetTheApp from "@/components/nelvin/GetTheApp";
import Newsletter from "@/components/nelvin/Newsletter";
import FAQSection from "@/components/nelvin/FAQSection";
import Footer from "@/components/nelvin/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <Navbar />
      <HeroSection />
      <TrustedBrands />
      <FeaturedDeals />
      <CategoriesGrid />
      <StatsSection />
      <CountriesSection />
      <HowItWorks />
      <PricingSection />
      <Testimonials />
      <GetTheApp />
      <Newsletter />
      <FAQSection />
      <Footer />
    </div>
  );
}