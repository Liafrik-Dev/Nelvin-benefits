import React from "react";
import { Link } from "react-router-dom";

/**
 * Brand primitives shared by the public surfaces.
 *
 * The NelvinBenefit wordmark renders in brand gold everywhere it appears,
 * in the two shades that keep it legible on light and on blue surfaces.
 */

const SIZES = {
  sm: { tile: "h-8 w-8", letter: "text-sm", word: "text-lg", tag: "text-[9px]" },
  md: { tile: "h-10 w-10", letter: "text-lg", word: "text-2xl", tag: "text-[10px]" },
  lg: { tile: "h-12 w-12", letter: "text-xl", word: "text-3xl", tag: "text-[11px]" },
};

/** Gold monogram tile — the compact mark used in nav, footer and app chrome. */
export function BrandMark({ size = "md", tone = "default", className = "" }) {
  const s = SIZES[size] || SIZES.md;
  const inverse = tone === "inverse";
  return (
    <span
      className={`${s.tile} shrink-0 rounded-xl ${
        inverse ? "bg-white ring-white/40" : "bg-gradient-to-br from-[#0866FF] to-[#1F4CF4] ring-[#0866FF]/25"
      } flex items-center justify-center shadow-nv-card ring-1 ${className}`}
      aria-hidden="true"
    >
      <span className={`${s.letter} font-black tracking-tighter nb-wordmark ${inverse ? "text-[#0866FF]" : "text-white"}`}>N</span>
    </span>
  );
}

/**
 * Full wordmark. `NelvinBenefit` reads as one gold unit; the tagline is
 * optional so the same component works in the header and the footer.
 */
export function BrandWordmark({
  size = "md",
  tagline = null,
  tone = "default",
  as: Tag = "span",
  className = "",
  ...rest
}) {
  const s = SIZES[size] || SIZES.md;
  return (
    <Tag className={`flex flex-col ${className}`} {...rest}>
      <span className={`${s.word} nb-wordmark ${tone === "inverse" ? "text-brand-gold" : "text-gold-gradient"}`}>
        NelvinBenefit
      </span>
      {tagline ? (
        <span className={`${s.tag} mt-0.5 font-bold uppercase tracking-[0.18em] ${tone === "inverse" ? "text-white" : "text-[#484848]"}`}>
          {tagline}
        </span>
      ) : null}
    </Tag>
  );
}

/** Linked brand lockup used by the navbar and the footer. */
export function BrandLogo({
  size = "md",
  tagline = null,
  tone = "default",
  to = "/",
  className = "",
  onClick,
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      aria-label="NelvinBenefit — home"
      className={`group flex items-center gap-2.5 ${className}`}
    >
      <BrandMark size={size} tone={tone} className="transition-transform duration-200 group-hover:scale-105" />
      <BrandWordmark size={size} tagline={tagline} tone={tone} />
    </Link>
  );
}

/** Section eyebrow + display heading + optional lead paragraph. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "center",
  tone = "default",
  className = "",
  children,
}) {
  const alignment =
    align === "left" ? "text-left items-start" : align === "center" ? "text-center items-center" : "text-left items-start";
  const inverse = tone === "inverse";
  const titleTone = inverse ? "text-white" : "text-[#282828]";
  const leadTone = inverse ? "text-white" : "text-[#484848]";

  return (
    <div className={`flex flex-col ${alignment} ${align === "center" ? "mx-auto max-w-3xl" : ""} ${className}`}>
      {eyebrow ? (
        <p className={`mb-3 text-[11px] font-bold uppercase tracking-[0.2em] ${inverse ? "text-white/90" : "text-[#0866FF]"}`}>
          {eyebrow}
        </p>
      ) : null}
      <h2
        className={`text-balance-nv font-heading text-3xl font-black leading-[1.12] tracking-tight sm:text-4xl lg:text-[2.125rem] ${titleTone}`}
      >
        {title}
      </h2>
      {lead ? (
        <p className={`mt-4 text-balance-nv text-base leading-relaxed ${leadTone}`}>{lead}</p>
      ) : null}
      {children}
    </div>
  );
}

export default BrandLogo;