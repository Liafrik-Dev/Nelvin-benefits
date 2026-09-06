import React, { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n";

const messageKeys = [
  "hero.badge.0",
  "hero.badge.1",
  "hero.badge.2",
  "hero.badge.3",
  "hero.badge.4",
  "hero.badge.5",
  "hero.badge.6",
  "hero.badge.7",
];

export default function HeroBadge() {
  const { t } = useLanguage();
  const [index, setIndex] = useState(0);
  const messages = messageKeys.map((key) => t(key));

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % messages.length);
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 mb-6 lg:mb-8 w-fit animate-fade-up">
      <span key={index} className="text-white/90 text-xs sm:text-sm font-medium animate-fade-in">
        {messages[index]}
      </span>
    </div>
  );
}