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
    <section className="surface-nv-raised border-y border-[#F1F1F1]">
      <div className="container-nv py-14 lg:py-16">
        <div className="flex flex-col items-center justify-between gap-8 lg:flex-row">
          <div className="text-center lg:text-left">
            <span className="chip-nv">Join the movement</span>
            <h2 className="text-balance-nv mt-4 text-2xl font-extrabold font-heading tracking-tight text-ivory sm:text-3xl lg:text-4xl">
              Ready to connect your employee experience?
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-ivory-muted">
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
                className="btn-nv btn-nv-md border border-[#F1F1F1] bg-[#F9F8F7] px-4 text-ivory transition-colors hover:border-[#0866FF]/40 hover:text-gold"
              >
                <AppleIcon className="h-4 w-4" />
                <span className="text-[11px] font-bold">App Store</span>
              </a>
              <a
                href="#"
                className="btn-nv btn-nv-md border border-[#F1F1F1] bg-[#F9F8F7] px-4 text-ivory transition-colors hover:border-[#0866FF]/40 hover:text-gold"
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