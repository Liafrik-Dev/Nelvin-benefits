import React, { useState } from "react";
import { Check } from "lucide-react";

/**
 * Demo request — the reference closes the page with a photographic band
 * carrying a short form. The submit handler is unchanged (local success
 * state, no backend call).
 */
export default function PricingSection() {
  const [submitted, setSubmitted] = useState(false);

  const fieldClass =
    "w-full rounded-lg border border-[#F1F1F1] bg-white/[0.05] px-4 py-2.5 text-sm text-ivory outline-none transition-colors placeholder:text-ivory-dim focus:border-gold";

  return (
    <section className="surface-nv-primary section-nv">
      <div className="container-nv">
        <div className="relative overflow-hidden rounded-2xl">
          <img
            src="/images/benifex/footer-banner-v2.jpg"
            alt=""
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B1B3A]/95 via-[#0B1B3A]/85 to-[#0B1B3A]/60" aria-hidden="true" />

          <div className="relative z-10 grid grid-cols-1 items-center gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:p-14">
            <div>
              <h2 className="text-balance-nv text-3xl font-bold font-heading leading-tight tracking-tight text-white sm:text-4xl">
                Ready to connect your employee experience?
              </h2>
              <p className="mt-4 max-w-md text-base leading-relaxed text-white/85">
                Join the remarkable organisations putting people at the heart of what
                they do. Book a free demo today.
              </p>
            </div>

            <div className="rounded-2xl border border-[#F1F1F1] bg-[#F9F8F7] p-8 shadow-nv-card backdrop-blur">
              {submitted ? (
                <div className="py-10 text-center">
                  <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold">
                    <Check className="h-7 w-7 text-[#282828]" />
                  </span>
                  <h3 className="mb-2 text-xl font-bold text-ivory">Thank you!</h3>
                  <p className="text-sm text-ivory-muted">
                    We'll be in touch shortly to arrange your demo.
                  </p>
                </div>
              ) : (
                <form
                  onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}
                  className="space-y-4"
                >
                  <h3 className="text-lg font-bold text-ivory">Book a free demo</h3>

                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <label className="sr-only" htmlFor="demo-first-name">First name</label>
                    <input id="demo-first-name" required placeholder="First name" className={fieldClass} />
                    <label className="sr-only" htmlFor="demo-surname">Surname</label>
                    <input id="demo-surname" required placeholder="Surname" className={fieldClass} />
                  </div>

                  <label className="sr-only" htmlFor="demo-email">Work email</label>
                  <input
                    id="demo-email"
                    required
                    type="email"
                    placeholder="Work email"
                    className={fieldClass}
                  />

                  <button type="submit" className="btn-nv btn-nv-md btn-nv-gold group w-full">
                    Request my demo
                    <span className="transition-transform group-hover:translate-x-0.5">→</span>
                  </button>

                  <p className="text-[10px] leading-relaxed text-ivory-dim">
                    Nelvin will use your personal information to contact you from time to
                    time about other products, services and events that we feel may be of
                    interest to you.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}