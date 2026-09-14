import React from "react";

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

export default function TrustedBrands() {
  return (
    <section className="bg-forest-secondary py-14 overflow-hidden">
      <p className="text-center text-xs tracking-[0.2em] text-[#F5F1E8]/50 uppercase mb-8 font-semibold">
        Join the remarkable organisations putting people at the heart of what they do
      </p>
      <div className="relative overflow-hidden">
        <div className="flex animate-scroll gap-14 items-center whitespace-nowrap">
          {[...logos, ...logos, ...logos].map((logo, i) => (
            <span key={i} className="flex-shrink-0 opacity-40 hover:opacity-100 transition-opacity">
              <img src={`/images/benifex/logos/${logo}`} alt={logo} className="h-12 w-auto max-w-32 object-contain grayscale hover:grayscale-0 transition-all" />
            </span>
          ))}
        </div>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-[#F7F3ED] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-[#F7F3ED] to-transparent" />
      </div>
    </section>
  );
}