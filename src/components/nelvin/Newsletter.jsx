import React, { useState } from "react";
import { Mail, Check, ArrowRight } from "lucide-react";

/**
 * Newsletter — a single quiet capture band. Unused by the current Home
 * composition but kept functional and restyled for consistency.
 */
export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  return (
    <section className="surface-nv-primary section-nv">
      <div className="container-nv">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#0866FF]/20 bg-[#FFFFFF] p-8 text-center shadow-nv-card sm:p-12">
          <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFFFFF]">
            <Mail className="h-5 w-5 text-gold" />
          </span>

          <h2 className="text-2xl font-bold font-heading text-ivory sm:text-3xl">
            Never miss a drop.
          </h2>
          <p className="mt-3 text-sm text-ivory-muted">
            Get the week's best offers, cashback drops and luxury reveals —
            straight to your inbox.
          </p>

          {done ? (
            <p className="btn-nv btn-nv-md btn-nv-gold mx-auto mt-8">
              <Check className="h-4 w-4" />
              Thank you! You are subscribed.
            </p>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); if (email) setDone(true); }}
              className="mx-auto mt-8 flex max-w-md flex-col items-stretch gap-2 sm:flex-row sm:items-center"
            >
              <label className="sr-only" htmlFor="newsletter-email">Your best email</label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your best email"
                className="flex-1 rounded-lg border border-[#F1F1F1] bg-white/[0.05] px-5 py-3 text-sm text-ivory outline-none placeholder:text-ivory-dim focus:border-gold"
              />
              <button type="submit" className="btn-nv btn-nv-md btn-nv-gold group shrink-0">
                Subscribe
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </form>
          )}

          <p className="mt-4 text-xs text-ivory-dim">
            By subscribing you agree to Nelvin's Privacy Policy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}