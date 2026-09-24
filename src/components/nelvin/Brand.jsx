import React from "react";
import { Link } from "react-router-dom";

/**
 * Brand primitives shared by the public surfaces.
 *
 * Renders the real NelvinBenefits artwork: a square icon mark
 * (public/images/brand/nelvin-icon.png) for compact spots, and the full
 * horizontal lockup (public/images/brand/nelvin-logo-horizontal.png,
 * icon + wordmark baked into one image) everywhere the full logo is shown.
 * Both are transparent gold-on-white and read fine on light or on the
 * brand-blue surfaces, so `tone` no longer needs to swap artwork.
 */

const ICON_SRC = "/images/brand/nelvin-icon.png";
const LOGO_SRC = "/images/brand/nelvin-logo-horizontal.png";
const LOGO_ASPECT = 2143 / 684; // width / height of the source artwork

const SIZES = {
  sm: { tile: "h-8 w-8", wordH: "h-6", tag: "text-[9px]" },
  md: { tile: "h-10 w-10", wordH: "h-8", tag: "text-[10px]" },
  lg: { tile: "h-12 w-12", wordH: "h-10", tag: "text-[11px]" },
};

/** Square icon mark — used in nav collapsed states, avatars, app chrome. */
export function BrandMark({ size = "md", tone = "default", className = "" }) {
  const s = SIZES[size] || SIZES.md;
  return (
    <img
      src={ICON_SRC}
      alt=""
      aria-hidden="true"
      className={`${s.tile} shrink-0 object-contain ${className}`}
    />
  );
}

/** The full "icon + NelvinBenefits" wordmark image, with an optional tagline. */
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
      <img
        src={LOGO_SRC}
        alt="NelvinBenefits"
        className={`${s.wordH} object-contain object-left`}
        style={{ width: "auto", aspectRatio: LOGO_ASPECT }}
      />
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
      aria-label="NelvinBenefits — home"
      className={`group flex items-center gap-2.5 ${className}`}
    >
      <BrandWordmark size={size} tagline={tagline} tone={tone} className="transition-transform duration-200 group-hover:scale-105" />
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
        <p className={`mb-3 text-[11px] font-bold uppercase tracking-[0.2em] ${inverse ? "text-white/90" : "text-[#1B4F9C]"}`}>
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