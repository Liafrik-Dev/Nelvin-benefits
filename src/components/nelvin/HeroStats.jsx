import React, { useEffect, useRef, useState } from "react";

const stats = [
  { value: 54, suffix: "+", label: "Countries" },
  { value: 25000, suffix: "+", label: "Offers" },
  { value: 12000, suffix: "+", label: "Partner Businesses" },
  { value: 2, suffix: "M+", label: "Members" },
  { value: 98, suffix: "%", label: "Customer Satisfaction" },
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
  return (
    <div className="grid grid-cols-3 sm:grid-cols-5 gap-4 sm:gap-6 mt-8 sm:mt-10 max-w-3xl">
      {stats.map((stat) => (
        <div key={stat.label}>
          <Counter value={stat.value} suffix={stat.suffix} />
          <p className="text-white/60 text-xs mt-1 uppercase tracking-wide">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}