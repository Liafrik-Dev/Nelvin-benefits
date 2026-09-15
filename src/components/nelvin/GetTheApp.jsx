import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import AppleIcon from "@/components/shared/AppleIcon";
import GoogleIcon from "@/components/shared/GoogleIcon";

/**
 * App download band — mirrors the reference's full-bleed CTA strip with the
 * store badges grouped beside a single primary action.
 */
export default function GetTheApp() {
  return (
    <section className="relative isolate overflow-hidden bg-[#0B0F19]">
      <img
        src="/images/benifex/africa/south-africa.jpg"
        alt=""
        aria-hidden="true"
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-[#0B1B3A]/95 via-[#0866FF]/80 to-[#0866FF]/55" aria-hidden="true" />

      <div className="relative z-10 container-nv py-16 lg:py-20">
        <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur">
              Join the movement
            </span>
            <h2 className="text-balance-nv mt-5 text-2xl font-extrabold font-heading tracking-tight text-white sm:text-3xl lg:text-4xl">
              Ready to connect your employee experience?
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-white/85">
              Join remarkable organisations putting people at the heart of what they do.
              Book a demo today.
            </p>
          </div>

          <div className="flex shrink-0 flex-col items-center gap-4 sm:flex-row">
            <Link to="/corporate" className="btn-nv btn-nv-lg btn-nv-gold group">
              Book free demo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <div className="flex items-center gap-2">
              <a
                href="#"
                className="btn-nv btn-nv-md border border-white/30 bg-white/10 px-4 text-white backdrop-blur transition-colors hover:bg-white/20"
              >
                <AppleIcon className="h-4 w-4" />
                <span className="text-[11px] font-bold">App Store</span>
              </a>
              <a
                href="#"
                className="btn-nv btn-nv-md border border-white/30 bg-white/10 px-4 text-white backdrop-blur transition-colors hover:bg-white/20"
              >
                <GoogleIcon className="h-4 w-4" />
                <span className="text-[11px] font-bold">Google Play</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}