import React from "react";

/**
 * Partner logo marquee. The reference keeps this banded, quiet and
 * full-bleed with soft edge fades; the previous version faded to a light
 * cream that clashed with the forest surface, so the fade is now a mask.
 */

const logos = [
  "Anaplan_logo.svg",
  "astrazeneca-vector-logo-v4.svg",
  "Aveva_logo_v2.svg",
  "Bank_of_Ireland_Logo_2020_v2.svg",
  "BNY_Mellon.svg",
  "BT_logo_2019.svg",
  "Budweiser_Anheuser-Busch_logo.svg",
  "Diageo.svg",
  "DXC_Technology_logo_2021.svg",
  "freshfields-logo-2.png",
  "Liberty_Global_2018_logo_2.svg",
  "Logo_Login_Lendlease.svg",
  "lseg-logo-blue.jpg",
  "LS-LOGO-TEAL.png",
  "MarksAndSpencer1884_logo_v2.svg",
  "Ocado_Group_Logo.svg",
  "Philips_logo_new.svg",
  "Salesforce.com_logo_v3.svg",
  "Shopify_logo_2018.svg",
  "Snowflake_Logo.svg",
  "Sony_logo.svg",
  "viavi-solutions-vector-logo_v2.svg",
  "White__Case_logo.svg",
];

function LogoRow() {
  return (
    <>
      {logos.map((logo) => (
        <span key={logo} className="flex shrink-0 items-center justify-center">
          <img
            src={`/images/benifex/logos/${logo}`}
            alt=""
            loading="lazy"
            className="h-8 w-auto max-w-[124px] object-contain opacity-55 brightness-0 invert transition-opacity duration-300 hover:opacity-100 sm:h-10"
          />
        </span>
      ))}
    </>
  );
}

export default function TrustedBrands() {
  return (
    <section className="surface-nv-secondary py-12 lg:py-16" aria-label="Trusted by">
      <div className="container-nv">
        <p className="text-balance-nv text-center text-[11px] font-bold uppercase tracking-[0.2em] text-ivory-dim">
          Join the remarkable organisations putting people at the heart of what they do
        </p>
      </div>

      <div className="mask-fade-x relative mt-9 overflow-hidden">
        <div className="flex w-max animate-scroll-slow items-center gap-10 sm:gap-16">
          <LogoRow />
          <LogoRow />
        </div>
      </div>
    </section>
  );
}