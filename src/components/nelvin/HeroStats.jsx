import React, { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/lib/i18n";

const stats = [
  { value: 54, suffix: "+", labelKey: "hero.stats.countries" },
  { value: 25000, suffix: "+", labelKey: "hero.stats.offers" },
  { value: 12000, suffix: "+", labelKey: "hero.stats.businesses" },
  { value: 2, suffix: "M+", labelKey: "hero.stats.members" },
  { value: 98, suffix: "%", labelKey: "hero.stats.satisfaction" },
];

function Counter({ value, suffix }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1500;
          const start = performance.now();
          const animate = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            setCount(Math.floor(progress * value));
            if (progress < 1) requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <p ref={ref} className="text-white font-heading font-bold text-xl sm:text-3xl lg:text-4xl">
      {count.toLocaleString()}
      {suffix}
    </p>
  );
}

export default function HeroStats() {
  const { t } = useLanguage();
  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 sm:gap-6 mt-8 sm:mt-10 max-w-3xl">
      {stats.map((stat) => (
        <div key={stat.labelKey}>
          <Counter value={stat.value} suffix={stat.suffix} />
          <p className="text-white/60 text-xs mt-1 uppercase tracking-wide">{t(stat.labelKey)}</p>
        </div>
      ))}
    </div>
  );
}