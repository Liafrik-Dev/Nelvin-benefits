import React, { useEffect, useState } from "react";

const messages = [
  "✨ New Offers Added This Week",
  "🌍 Available Across Africa",
  "🏨 New Hotels Now Available",
  "🍽 New Restaurant Offers",
  "🎉 Weekend Deals Live",
  "💎 Premium Member Benefits",
  "🔥 Flash Offers Available",
  "⭐ Verified Businesses Only",
];

export default function HeroBadge() {
  const [index, setIndex] = useState(0);

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