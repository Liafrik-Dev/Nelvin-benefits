import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useLanguage } from "@/lib/i18n";

export default function HeroSection() {
  const { t } = useLanguage();
  return (
    <section className="relative bg-[#F7F3ED] pt-32 sm:pt-40 pb-24 overflow-hidden">
      <div className="max-w-5xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <span className="inline-flex items-center gap-2 bg-white rounded-full px-4 py-1.5 text-xs font-bold text-[#082F24] shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#00BD00]" />
            A global community of changemakers.
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="mt-8 font-heading font-bold text-[#180126] text-[clamp(2.4rem,6vw,4.2rem)] leading-[1.05] tracking-tight mx-auto max-w-4xl"
        >
          Build remarkable experiences your{" "}
          <span className="bg-[#B8FF00] px-2 rounded-2xl">members will love</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mt-6 text-[#180126]/70 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
        >
          At Nelvin we believe your rewards and benefits should be as remarkable as your people –
          engaging them, rewarding them, relevant to them and crucially making a difference to their lives.

        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mt-10 flex items-center justify-center gap-4"
        >
          <Link
            to="/register"
            className="group inline-flex items-center gap-3 bg-[#180126] hover:bg-[#2b0140] text-white font-bold text-sm h-11 px-6 rounded-[23px] transition-colors"
          >
            <span className="transition-transform group-hover:-translate-x-1">Book a Demo</span>
            <span className="w-4 h-4 rounded-full bg-[#B8FF00] flex items-center justify-center text-[#180126] text-xs transition-transform group-hover:scale-110">→</span>
          </Link>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.45, ease: "easeOut" }}
        className="mt-14 sm:mt-20 max-w-6xl mx-auto px-6"
      >
        <div className="relative">
          <div className="rounded-[2rem] overflow-hidden shadow-2xl">
            <img
              src="/images/benifex/homepage-banner-overlap-v4.png"
              alt="Nelvin platform"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}