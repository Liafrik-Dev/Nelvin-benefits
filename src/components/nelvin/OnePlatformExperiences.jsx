import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Check, ArrowRight, Smartphone, Building2, Store, ShieldCheck } from "lucide-react";
import { LANDING_EXPERIENCES } from "@/lib/landingData";
import { SectionHeading } from "@/components/nelvin/Brand";

/**
 * One platform, four experiences.
 *
 * Each mock is a miniature of the real surface, drawn with the same palette
 * the app uses: corporate blue for chrome and accents, ink for text, hairline
 * borders for card edges. The phone bezel is deliberately dark so the screen
 * reads as a device rather than a white box.
 */

const LINE = "border-[#F1F1F1]";

/** Phone bezel — shared by the member mock. */
function PhoneFrame({ children }) {
  return (
    <div className="mx-auto w-[19rem] rounded-[2rem] bg-[#1A1A1A] p-2 shadow-nv-card-hover">
      <div className="overflow-hidden rounded-[1.6rem] bg-[#FFFFFF]">
        <div className="flex items-center justify-center bg-[#1A1A1A] pb-1 pt-1.5">
          <span className="h-1.5 w-16 rounded-full bg-white/25" />
        </div>
        {children}
      </div>
    </div>
  );
}

/** Browser-style frame for the web consoles. */
function WindowFrame({ label, badge, children }) {
  return (
    <div className="mx-auto w-full max-w-[26rem] overflow-hidden rounded-xl border border-[#E3E3E3] bg-[#FFFFFF] shadow-nv-card-hover">
      <div className={`flex items-center justify-between gap-3 border-b ${LINE} bg-[#F9F8F7] px-4 py-3`}>
        <p className="truncate text-xs font-bold text-[#282828]">{label}</p>
        {badge ? (
          <span className="shrink-0 rounded-full bg-[#1B4F9C]/12 px-2.5 py-1 text-[10px] font-extrabold text-[#1B4F9C]">
            {badge}
          </span>
        ) : null}
      </div>
      {children}
    </div>
  );
}

function EmployeeMock() {
  const offers = [
    { n: "Chicken Republic", d: "30% off · dining", tone: "blue" },
    { n: "MTN Pulse", d: "2GB free data · telecom", tone: "soft" },
    { n: "Radisson Blu", d: "Weekend 20% off · hotel", tone: "soft" },
  ];
  return (
    <PhoneFrame>
      <div className="bg-[#1B4F9C] px-4 pb-4 pt-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-semibold text-white/80">Good morning</p>
            <p className="truncate text-sm font-extrabold text-white">Ada Okafor</p>
          </div>
          <span className="shrink-0 rounded-full bg-white px-2.5 py-1 text-[11px] font-extrabold text-[#1B4F9C]">
            ₦2,450
          </span>
        </div>
      </div>

      <div className={`border-b ${LINE} px-4 py-3`}>
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#6B6B6B]">Today&rsquo;s pick</p>
        <div className="mt-2 flex items-center justify-between gap-3 rounded-lg bg-[#F9F8F7] p-3">
          <p className="text-xs font-bold text-[#282828]">2-for-1 suya night</p>
          <ArrowRight className="h-3.5 w-3.5 shrink-0 text-[#1B4F9C]" />
        </div>
      </div>

      <div className="space-y-2 px-4 py-3">
        {offers.map((o) => (
          <div key={o.n} className={`flex items-center justify-between gap-3 rounded-lg border ${LINE} p-2.5`}>
            <div className="min-w-0">
              <p className="truncate text-[11px] font-bold text-[#282828]">{o.n}</p>
              <p className="truncate text-[10px] text-[#6B6B6B]">{o.d}</p>
            </div>
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-extrabold ${
                o.tone === "blue" ? "bg-[#1B4F9C] text-white" : "bg-[#1B4F9C]/12 text-[#1B4F9C]"
              }`}
            >
              {o.n[0]}
            </span>
          </div>
        ))}
      </div>

      <div className={`flex items-center justify-around border-t ${LINE} bg-[#F9F8F7] px-2 py-2.5`}>
        {[
          { l: "Wallet", on: false },
          { l: "Offers", on: true },
          { l: "Rewards", on: false },
          { l: "Profile", on: false },
        ].map((t) => (
          <span key={t.l} className={`text-[11px] font-bold ${t.on ? "text-[#1B4F9C]" : "text-[#6B6B6B]"}`}>
            {t.l}
          </span>
        ))}
      </div>
    </PhoneFrame>
  );
}

function EmployerMock() {
  const stats = [
    { l: "Members", v: "1,284" },
    { l: "Engagement", v: "92%" },
    { l: "Spend", v: "₦8.2M" },
  ];
  return (
    <WindowFrame label="HR Dashboard · Acme Corp" badge="Admin">
      <div className="p-4">
        <div className="grid grid-cols-3 gap-2">
          {stats.map((s) => (
            <div key={s.l} className={`rounded-lg border ${LINE} bg-[#F9F8F7] p-2.5 text-center`}>
              <p className="text-sm font-extrabold text-[#282828]">{s.v}</p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-[#6B6B6B]">{s.l}</p>
            </div>
          ))}
        </div>

        <div className={`mt-3 rounded-lg border ${LINE} p-3`}>
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-bold text-[#282828]">Budget utilisation</p>
            <p className="text-[11px] font-extrabold text-[#1B4F9C]">66%</p>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#F1F1F1]">
            <div className="h-full w-2/3 rounded-full bg-[#1B4F9C]" />
          </div>
        </div>

        <div className={`mt-2 flex items-center justify-between rounded-lg border ${LINE} p-3`}>
          <p className="text-[11px] font-bold text-[#282828]">Top programme</p>
          <span className="text-[11px] font-extrabold text-[#1B4F9C]">Meal + Fitness</span>
        </div>
      </div>
    </WindowFrame>
  );
}

function PartnerMock() {
  return (
    <WindowFrame label="Merchant Portal · Kilimanjaro Coffee" badge="Live">
      <div className="p-4">
        <div className={`flex items-center justify-between rounded-lg border ${LINE} bg-[#F9F8F7] p-3`}>
          <div>
            <p className="text-[11px] font-bold text-[#282828]">Redemptions today</p>
            <p className="text-lg font-extrabold text-[#282828]">342</p>
          </div>
          <span className="rounded-full bg-[#1B4F9C]/12 px-2.5 py-1 text-[10px] font-extrabold text-[#1B4F9C]">
            +18%
          </span>
        </div>

        <div className={`mt-3 rounded-lg border ${LINE} p-3`}>
          <p className="text-[11px] font-bold text-[#282828]">Campaign reach</p>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#F1F1F1]">
            <div className="h-full w-4/5 rounded-full bg-[#1B4F9C]" />
          </div>
          <p className="mt-1.5 text-[10px] font-semibold text-[#6B6B6B]">18,240 members reached</p>
        </div>

        <div className={`mt-2 flex items-center justify-between rounded-lg border ${LINE} p-3`}>
          <span className="text-[11px] font-bold text-[#282828]">Settle balance</span>
          <span className="text-[11px] font-extrabold text-[#1B4F9C]">₦1.6M due</span>
        </div>
      </div>
    </WindowFrame>
  );
}

function AdminMock() {
  const kpis = [
    { l: "Users", v: "486,120" },
    { l: "Companies", v: "3,402" },
    { l: "Active offers", v: "512,800" },
    { l: "Settlements", v: "₦94.5M" },
  ];
  return (
    <WindowFrame label="Super Admin · Nelvin OS" badge="Platform">
      <div className="p-4">
        <div className="grid grid-cols-2 gap-2">
          {kpis.map((s) => (
            <div key={s.l} className={`rounded-lg border ${LINE} bg-[#F9F8F7] p-3`}>
              <p className="text-base font-extrabold text-[#282828]">{s.v}</p>
              <p className="mt-0.5 text-[10px] font-bold uppercase tracking-wide text-[#6B6B6B]">{s.l}</p>
            </div>
          ))}
        </div>

        <div className={`mt-3 flex items-center justify-between rounded-lg border ${LINE} p-3`}>
          <p className="text-[11px] font-bold text-[#282828]">Compliance &amp; audit</p>
          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-[#1B4F9C]">
            <Check className="h-3.5 w-3.5" /> All green
          </span>
        </div>
      </div>
    </WindowFrame>
  );
}

const MOCKS = {
  employee: EmployeeMock,
  employer: EmployerMock,
  partner: PartnerMock,
  admin: AdminMock,
};

const TAB_ICONS = {
  employee: Smartphone,
  employer: Building2,
  partner: Store,
  admin: ShieldCheck,
};

export default function OnePlatformExperiences() {
  const [active, setActive] = useState("employee");
  const Mock = MOCKS[active] || EmployeeMock;
  const ex = LANDING_EXPERIENCES.find((e) => e.id === active) || LANDING_EXPERIENCES[0];
  const Icon = TAB_ICONS[ex.id] || Smartphone;

  // Rotate the showcase so all four surfaces get seen without interaction.
  useEffect(() => {
    const id = setInterval(() => {
      setActive((cur) => {
        const i = LANDING_EXPERIENCES.findIndex((e) => e.id === cur);
        return LANDING_EXPERIENCES[(i + 1) % LANDING_EXPERIENCES.length].id;
      });
    }, 7000);
    return () => clearInterval(id);
  }, []);

  return (
    <section id="platform" className="surface-nv-secondary section-nv relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(60% 60% at 18% 8%, rgba(27,79,156,0.06) 0%, transparent 60%), radial-gradient(50% 50% at 92% 92%, rgba(27,79,156,0.05) 0%, transparent 55%)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 container-nv">
        <SectionHeading
          eyebrow="One platform"
          title={<>Multiple experiences. One beautiful platform.</>}
          lead="Four tailored experiences, powered by the same engine — members, employers, partners and platform operators each get their own home."
        />

        <div
          className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-1.5 rounded-full border border-[#F1F1F1] bg-[#F9F8F7] p-1.5 sm:grid-cols-4"
          role="tablist"
          aria-label="Platform experiences"
        >
          {LANDING_EXPERIENCES.map((item) => {
            const on = active === item.id;
            const TabIcon = TAB_ICONS[item.id] || Smartphone;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={on}
                onClick={() => setActive(item.id)}
                className={`flex items-center justify-center gap-2 rounded-full px-3 py-3 text-xs font-bold transition-colors ${
                  on
                    ? "bg-[#1B4F9C] text-white shadow-nv-card"
                    : "text-[#484848] hover:bg-white hover:text-[#282828]"
                }`}
              >
                <TabIcon className="h-4 w-4 shrink-0" />
                <span className="truncate">{item.name}</span>
              </button>
            );
          })}
        </div>

        <div className="mt-12 grid grid-cols-1 items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#1B4F9C]/20 bg-[#1B4F9C]/8 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-[#1B4F9C]">
              <Icon className="h-3.5 w-3.5" />
              {ex.name}
            </span>

            <h3 className="mt-5 font-heading text-2xl font-black text-[#282828] sm:text-3xl">
              {ex.name}
            </h3>
            <p className="mt-3 max-w-md leading-relaxed text-[#484848]">{ex.desc}</p>

            <ul className="mt-6 space-y-3">
              {ex.points.map((p) => (
                <li key={p} className="flex items-center gap-3 text-sm text-[#282828]">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1B4F9C]/12">
                    <Check className="h-3 w-3 text-[#1B4F9C]" />
                  </span>
                  {p}
                </li>
              ))}
            </ul>

            <Link to={ex.to} className="btn-nv btn-nv-md btn-nv-gold group mt-8">
              Open {ex.name}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          <div className="flex items-center justify-center">
            <div className="relative w-full max-w-lg">
              <div className="absolute -inset-6 rounded-[3rem] bg-[#1B4F9C]/10 blur-2xl" aria-hidden="true" />
              <div className="relative">
                <Mock />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}