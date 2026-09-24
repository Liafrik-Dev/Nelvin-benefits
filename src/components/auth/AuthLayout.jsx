import React from "react";
import { Link as RouterLink } from "react-router-dom";
import { ArrowRight, ShieldCheck, Gift, Wallet, HeartPulse } from "lucide-react";
import { BrandLogo } from "@/components/nelvin/Brand";

/**
 * Shell for every authentication screen.
 *
 * The pages using this shell (ForgotPassword, ResetPassword) pass icon, title,
 * subtitle and footer props. Those props were previously accepted and then
 * dropped, so those screens rendered with no heading at all — the heading block
 * below is what makes them complete.
 */

const HIGHLIGHTS = [
  { icon: Gift, title: "500,000+ offers", body: "Dining, travel, retail and leisure — locally and worldwide." },
  { icon: Wallet, title: "Benefits wallet", body: "Allowances, cashback and vouchers in one place." },
  { icon: HeartPulse, title: "Wellbeing", body: "Health, fitness and financial wellbeing built in." },
];

export default function AuthLayout({
  children,
  icon: Icon,
  title,
  subtitle,
  footer,
  eyebrow,
}) {
  const hasHeading = Boolean(title || subtitle || Icon);

  return (
    <div className="flex min-h-screen flex-col bg-[#F9F8F7] font-sans lg:flex-row">
      {/* ---------- Brand panel: savanna footage, desktop only ---------- */}
      <aside className="relative hidden w-full overflow-hidden bg-[#0B1B3A] lg:flex lg:w-[44%] xl:w-[42%]">
        {/* Savanna backdrop. Decorative only, so it is hidden from assistive
            tech and skipped entirely when the visitor prefers reduced motion —
            the poster frame stands in, keeping the panel from going flat. */}
        <video
          className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
          poster="/videos/auth-savanna-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          aria-hidden="true"
        >
          <source src="/videos/auth-savanna.mp4" type="video/mp4" />
        </video>

        {/* Sits under the video too, so reduced-motion visitors still get a
            backdrop rather than bare panel blue. */}
        <img
          src="/videos/auth-savanna-poster.jpg"
          alt=""
          aria-hidden="true"
          className="absolute inset-0 hidden h-full w-full object-cover motion-reduce:block"
        />

        {/* The panel colour at high coverage is what keeps white type legible
            over moving footage; the blue tint is kept light on purpose so the
            savanna stays recognisable rather than reading as a flat blue slab. */}
        <div className="absolute inset-0 bg-[#0B1B3A]/80" aria-hidden="true" />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(180deg, rgba(11,27,58,0.80) 0%, rgba(11,27,58,0.45) 42%, rgba(11,27,58,0.88) 100%)",
          }}
          aria-hidden="true"
        />

        <div className="relative z-10 flex w-full flex-col justify-between p-10 xl:p-14">
          <BrandLogo size="lg" tone="inverse" />

          <div>
            <h2 className="font-heading text-3xl font-black leading-tight tracking-tight text-white xl:text-4xl">
              Employee benefits
              <br />
              people actually use.
            </h2>
            <p className="mt-4 max-w-sm leading-relaxed text-white/75">
              One platform for benefits, discounts, reward, wellbeing and wallet — for
              members, HR teams and partners.
            </p>

            <ul className="mt-10 space-y-5">
              {HIGHLIGHTS.map(({ icon: HIcon, title: t, body }) => (
                <li key={t} className="flex items-start gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 backdrop-blur">
                    <HIcon className="h-4.5 w-4.5 text-brand-gold" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-white">{t}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-white/65">{body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <p className="flex items-center gap-2 text-xs text-white/60">
            <ShieldCheck className="h-4 w-4 text-brand-gold" />
            Enterprise ISO-27001 secured
          </p>
        </div>
      </aside>

      {/* ---------- Form column ---------- */}
      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-50 border-b border-[#F1F1F1] bg-[#FFFFFF]/90 backdrop-blur-md">
          <div className="flex h-16 items-center justify-between gap-4 px-5 sm:px-8">
            <div className="lg:hidden">
              <BrandLogo size="md" />
            </div>
            {/* The brand panel already carries the wordmark on desktop. */}
            <nav className="hidden items-center gap-7 text-sm font-semibold text-[#484848] lg:flex">
              <RouterLink to="/offers" className="transition-colors hover:text-[#1B4F9C]">Discounts</RouterLink>
              <RouterLink to="/corporate" className="transition-colors hover:text-[#1B4F9C]">Pricing</RouterLink>
              <RouterLink to="/support" className="transition-colors hover:text-[#1B4F9C]">Contact</RouterLink>
              <RouterLink to="/partner" className="transition-colors hover:text-[#1B4F9C]">Request a Brand</RouterLink>
            </nav>

            <div className="flex items-center gap-3">
              <RouterLink
                to="/login"
                className="btn-nv btn-nv-sm btn-nv-gold"
              >
                <ArrowRight className="h-3.5 w-3.5" /> Login
              </RouterLink>
            </div>
          </div>
        </header>

        <main className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8 sm:py-14">
          <div className="w-full max-w-md">
            {hasHeading ? (
              <div className="mb-7 text-center">
                {Icon ? (
                  <span className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[#1B4F9C]/10 text-[#1B4F9C]">
                    <Icon className="h-5 w-5" />
                  </span>
                ) : null}
                {eyebrow ? (
                  <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.18em] text-[#1B4F9C]">
                    {eyebrow}
                  </p>
                ) : null}
                {title ? (
                  <h1 className="font-heading text-2xl font-black tracking-tight text-[#282828] sm:text-3xl">
                    {title}
                  </h1>
                ) : null}
                {subtitle ? (
                  <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-[#6B6B6B]">
                    {subtitle}
                  </p>
                ) : null}
              </div>
            ) : null}

            {children}

            {footer ? (
              <div className="mt-6 text-center text-sm text-[#484848] [&_a]:font-semibold [&_a]:text-[#1B4F9C] [&_a:hover]:underline">
                {footer}
              </div>
            ) : null}
          </div>
        </main>

        <footer className="border-t border-[#F1F1F1] bg-[#FFFFFF] py-4 text-center text-xs text-[#6B6B6B]">
          <span className="inline-flex items-center justify-center gap-2">
            <ShieldCheck className="h-4 w-4 text-[#1B4F9C]" />
            <span className="text-gold-gradient font-bold">NelvinBenefit</span> Platform
          </span>
        </footer>
      </div>
    </div>
  );
}