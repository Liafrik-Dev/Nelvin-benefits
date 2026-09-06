import React, { useEffect, useRef, useState } from "react";

const images = [
  "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=1920&q=80", // safari
  "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1920&q=80", // hotel pool
  "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80", // fine dining
  "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1920&q=80", // beach resort
  "https://images.unsplash.com/photo-1519567241046-7f570eee3ce6?w=1920&q=80", // shopping mall
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=1920&q=80", // coffee shop
  "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=1920&q=80", // mountains
  "https://images.unsplash.com/photo-1580060839134-75a5edca2e99?w=1920&q=80", // skyline
];

export default function HeroBackground() {
  const [index, setIndex] = useState(0);
  const parallaxRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((i) => (i + 1) % images.length);
    }, 6500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handleMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20;
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translate(${x}px, ${y}px) scale(1.05)`;
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden bg-black">
      <div ref={parallaxRef} className="absolute inset-0 transition-transform duration-300 ease-out">
        {images.map((src, i) => (
          <div
            key={src}
            className={`absolute inset-0 transition-opacity duration-[2000ms] ease-in-out ${
              i === index ? "opacity-100" : "opacity-0"
            }`}
          >
            <img src={src} alt="" className={`w-full h-full object-cover ${i === index ? "animate-zoom-slow" : ""}`} />
          </div>
        ))}
      </div>

      <div className="absolute inset-0 bg-black/50" />

      {[...Array(12)].map((_, i) => (
        <span
          key={i}
          className="absolute w-1.5 h-1.5 bg-white/40 rounded-full animate-float"
          style={{
            left: `${(i * 37) % 100}%`,
            top: `${(i * 53) % 100}%`,
            animationDelay: `${i * 0.6}s`,
            animationDuration: `${5 + (i % 4)}s`,
          }}
        />
      ))}
    </div>
  );
}