import React from "react";
import { Link } from "react-router-dom";

/**
 * Brand primitives shared by the public surfaces.
 *
 * NelvinBenefit always renders in champagne gold — the wordmark, the
 * monogram tile, and the nav/footer identity all use it — so the mark
 * stays recognisable against every forest-tone surface.
 */

const SIZES = {
  sm: { tile: "h-8 w-8", letter: "text-sm", word: "text-lg", tag: "text-[9px]" },
  md: { tile: "h-10 w-10", letter: "text-lg", word: "text-2xl", tag: "text-[10px]" },
  lg: { tile: "h-12 w-12", letter: "text-xl", word: "text-3xl", tag: "text-[11px]" },
};

/** Gold monogram tile — the compact mark used in nav, footer and app chrome. */
export function BrandMark({ size = "md", className = "" }) {
  const s = SIZES[size] || SIZES.md;
  return (
    <span
      className={`${s.tile} shrink-0 rounded-xl bg-gradient-to-br from-[#E5C77A] via-[#D6B56D] to-[#B9944C] flex items-center justify-center shadow-nv-card ring-1 ring-[#F0DFAE]/40 ${className}`}
      aria-hidden="true"
    >
      <span className={`${s.letter} font-black tracking-tighter text-[#062B23] nb-wordmark`}>N</span>
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
  as: Tag = "span",
  className = "",
  ...rest
}) {
  const s = SIZES[size] || SIZES.md;
  return (
    <Tag className={`flex flex-col ${className}`} {...rest}>
      <span className={`${s.word} nb-wordmark text-gold-gradient`}>
        NelvinBenefit
      </span>
      {tagline ? (
        <span className={`${s.tag} mt-0.5 font-bold uppercase tracking-[0.18em] text-[#D6B56D]/80`}>
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
      <BrandMark size={size} className="transition-transform duration-200 group-hover:scale-105" />
      <BrandWordmark size={size} tagline={tagline} />
    </Link>
  );
}

/** Section eyebrow + display heading + optional lead paragraph. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "center",
  tone = "ivory",
  className = "",
  children,
}) {
  const alignment =
    align === "left" ? "text-left items-start" : align === "center" ? "text-center items-center" : "text-left items-start";
  const titleTone = tone === "white" ? "text-white" : "text-ivory";
  const leadTone = tone === "white" ? "text-white/70" : "text-ivory-muted";

  return (
    <div className={`flex flex-col ${alignment} ${align === "center" ? "mx-auto max-w-3xl" : ""} ${className}`}>
      {eyebrow ? <p className="eyebrow-nv mb-3">{eyebrow}</p> : null}
      <h2
        className={`text-balance-nv text-3xl font-extrabold font-heading leading-[1.12] tracking-tight sm:text-4xl lg:text-[2.5rem] ${titleTone}`}
      >
        {title}
      </h2>
      {lead ? (
        <p className={`mt-4 text-balance-nv text-sm leading-relaxed sm:text-base ${leadTone}`}>{lead}</p>
      ) : null}
      {children}
    </div>
  );
}

export default BrandLogo;