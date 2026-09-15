import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Check, ArrowRight } from "lucide-react";
import { LANDING_EXPERIENCES } from "@/lib/landingData";
import { SectionHeading } from "@/components/nelvin/Brand";

function EmployeeMock() {
  return (
    <div className="mx-auto w-72 rounded-xl border-8 border-[#D6B56D]/25 bg-emerald-black/90 shadow-2xl overflow-hidden">
      <div className="bg-[#062B23] p-4 text-white">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold">Good morning, Ada</span>
          <span className="bg-[#D6B56D] rounded-full px-2 py-0.5 text-[8px] font-extrabold text-[#062B23]">₦2,450</span>
        </div>
        <div className="mt-3 bg-[#0A3A2F]/10 rounded-lg p-3">
          <p className="text-[8px] text-white/60 font-bold uppercase">Today's pick</p>
          <p className="text-xs font-bold mt-1">2-for-1 suya night</p>
        </div>
      </div>
      <div className="p-3.5 space-y-2.5">
        {[
          { n: "Chicken Republic", d: "30% off · dining", c: "bg-[#D6B56D]" },
          { n: "MTN Pulse", d: "2GB free data · telecom", c: "bg-[#0A3A2F]" },
          { n: "Radisson Blu", d: "Weekend 20% off · hotel", c: "bg-[#0A3A2F]" },
        ].map((o) => (
          <div key={o.n} className="flex items-center justify-between bg-forest-secondary rounded-xl p-2.5">
            <div>
              <p className="text-[11px] font-bold text-[#F5F1E8]">{o.n}</p>
              <p className="text-[9px] text-[#F5F1E8]/55">{o.d}</p>
            </div>
            <span className={`${o.c} w-7 h-7 rounded-full flex items-center justify-center text-white text-[10px] font-extrabold`}>{o.n[0]}</span>
          </div>
        ))}
      </div>
      <div className="border-t border-[#D6B56D]/15 p-3 flex items-center justify-around text-[#F5F1E8]/60">
        <span className="text-[10px] font-bold">Wallet</span>
        <span className="text-[10px] font-bold">Offers</span>
        <span className="text-[10px] font-bold">Rewards</span>
        <span className="text-[10px] font-bold text-[#E5C77A]">Profile</span>
      </div>
    </div>
  );
}

function EmployerMock() {
  return (
    <div className="mx-auto w-[380px] rounded-xl border-8 border-[#062B23] bg-forest-secondary shadow-2xl overflow-hidden">
      <div className="bg-[#062B23] p-4 text-white flex items-center justify-between">
        <p className="text-xs font-bold">HR Dashboard · Acme Corp</p>
        <span className="w-6 h-6 rounded-full bg-[#D6B56D] flex items-center justify-center text-[#062B23] text-[10px] font-extrabold">A</span>
      </div>
      <div className="p-4 grid grid-cols-3 gap-2">
        {[{ l: "Members", v: "1,284" }, { l: "Engagement", v: "92%" }, { l: "Spend", v: "₦8.2M" }].map((s) => (
          <div key={s.l} className="bg-emerald-black/90 rounded-xl p-2.5 text-center">
            <p className="text-sm font-extrabold text-[#F5F1E8]">{s.v}</p>
            <p className="text-[8px] text-[#F5F1E8]/50 font-bold uppercase">{s.l}</p>
          </div>
        ))}
      </div>
      <div className="px-4 pb-4 space-y-2">
        <div className="bg-emerald-black/90 rounded-xl p-3">
          <p className="text-[9px] font-bold text-[#F5F1E8] mb-2">Budget utilisation</p>
          <div className="h-2 bg-[#103F35]/10 rounded-full overflow-hidden">
            <div className="h-full w-2/3 bg-[#0A3A2F] rounded-full" />
          </div>
        </div>
        <div className="bg-emerald-black/90 rounded-xl p-3 flex items-center justify-between">
          <p className="text-[9px] font-bold text-[#F5F1E8]">Top program</p>
          <span className="text-[9px] font-extrabold text-[#D6B56D]">Meal + Fitness</span>
        </div>
      </div>
    </div>
  );
}

function PartnerMock() {
  return (
    <div className="mx-auto w-[380px] rounded-xl border-8 border-[#D6B56D] bg-emerald-black/90 shadow-2xl overflow-hidden">
      <div className="bg-[#103F35] p-4 text-white flex items-center justify-between">
        <p className="text-xs font-bold">Merchant Portal · Kilimanjaro Coffee</p>
        <span className="text-[9px] font-extrabold text-[#D6B56D]">Live</span>
      </div>
      <div className="p-4 space-y-2.5">
        <div className="bg-forest-secondary rounded-xl p-3 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-[#F5F1E8]">Redemptions today</p>
            <p className="text-lg font-extrabold text-[#F5F1E8]">342</p>
          </div>
          <span className="text-[9px] font-bold text-[#E5C77A] bg-[#0A3A2F]/10 px-2 py-1 rounded-full">+18%</span>
        </div>
        <div className="bg-forest-secondary rounded-xl p-3">
          <p className="text-[9px] font-bold text-[#F5F1E8] mb-2">Campaign reach</p>
          <div className="h-2 bg-[#103F35]/10 rounded-full overflow-hidden">
            <div className="h-full w-4/5 bg-[#0A3A2F] rounded-full" />
          </div>
          <p className="text-[8px] text-[#F5F1E8]/50 mt-1.5 font-bold">18,240 members reached</p>
        </div>
        <div className="flex justify-between bg-[#103F35] text-white rounded-xl p-3">
          <span className="text-[9px] font-bold">Settle balance</span>
          <span className="text-[9px] font-extrabold text-[#D6B56D]">₦1.6M due</span>
        </div>
      </div>
    </div>
  );
}

function AdminMock() {
  return (
    <div className="mx-auto w-[380px] rounded-xl border-8 border-[#D6B56D] bg-forest-secondary shadow-2xl overflow-hidden">
      <div className="bg-[#0A3A2F] p-4 text-white flex items-center justify-between">
        <p className="text-xs font-bold">Super Admin · Nelvin OS</p>
        <span className="w-6 h-6 rounded-full bg-emerald-black/35 flex items-center justify-center text-[10px] font-extrabold">admin</span>
      </div>
      <div className="p-4 grid grid-cols-2 gap-2">
        {[{ l: "Users", v: "486,120" }, { l: "Companies", v: "3,402" }, { l: "Active offers", v: "512,800" }, { l: "Settlements", v: "₦94.5M" }].map((s) => (
          <div key={s.l} className="bg-emerald-black/90 rounded-xl p-3">
            <p className="text-base font-extrabold text-[#F5F1E8]">{s.v}</p>
            <p className="text-[8px] text-[#F5F1E8]/50 font-bold uppercase">{s.l}</p>
          </div>
        ))}
      </div>
      <div className="px-4 pb-4">
        <div className="bg-emerald-black/90 rounded-xl p-3 flex items-center justify-between">
          <p className="text-[9px] font-bold text-[#F5F1E8]">Compliance &amp; audit</p>
          <span className="inline-flex items-center gap-1 text-[9px] font-extrabold text-[#E5C77A]"><Check className="w-3 h-3" /> All green</span>
        </div>
      </div>
    </div>
  );
}

const MOCKS = {
  employee: EmployeeMock,
  employer: EmployerMock,
  partner: PartnerMock,
  admin: AdminMock,
};

export default function OnePlatformExperiences() {
  const [active, setActive] = useState("employee");
  const Mock = MOCKS[active] || EmployeeMock;

  return (
    <section id="platform" className="surface-nv-raised section-nv relative overflow-hidden">
      <div
        className="absolute inset-0 opacity-40"
        style={{ backgroundImage: "radial-gradient(60% 60% at 18% 8%, rgba(214,181,109,0.14) 0%, transparent 60%), radial-gradient(50% 50% at 92% 92%, rgba(6,43,35,0.85) 0%, transparent 55%)" }}
        aria-hidden="true"
      />
      <div className="relative z-10 container-nv">
        <SectionHeading
          tone="white"
          eyebrow="One platform"
          title={<>Multiple experiences. One beautiful platform.</>}
          lead="Four tailored experiences, powered by the same engine — members, employers, partners and platform operators each get their own home."
        />

        <div className="mt-12 grid grid-cols-2 gap-2 sm:gap-3 lg:grid-cols-4">
          {LANDING_EXPERIENCES.map((ex) => {
            const on = active === ex.id;
            return (
              <button
                key={ex.id}
                type="button"
                onClick={() => setActive(ex.id)}
                aria-selected={on}
                role="tab"
                className={`rounded-xl border p-4 text-left transition-colors sm:px-5 sm:py-4 ${
                  on
                    ? "border-gold bg-gold text-[#062B23] shadow-nv-card"
                    : "border-white/12 bg-white/[0.04] text-ivory-muted hover:border-[#D6B56D]/35 hover:text-ivory"
                }`}
              >
                <p className="text-sm font-extrabold">{ex.name}</p>
                <p className={`mt-1 text-[10px] font-semibold ${on ? "text-[#062B23]/70" : "text-ivory-dim"}`}>
                  {ex.points[0]}
                </p>
              </button>
            );
          })}
        </div>

        <div className="mt-12 grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            {(() => {
              const ex = LANDING_EXPERIENCES.find((e) => e.id === active);
              return (
                <>
                  <h3 className="text-2xl font-extrabold font-heading text-white sm:text-3xl">{ex.name}</h3>
                  <p className="mt-3 max-w-md leading-relaxed text-white/70">{ex.desc}</p>
                  <ul className="mt-6 space-y-2.5">
                    {ex.points.map((p) => (
                      <li key={p} className="flex items-center gap-2.5 text-sm text-white/85">
                        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#D6B56D]/15">
                          <Check className="h-3 w-3 text-gold" />
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                  <Link to={ex.to} className="btn-nv btn-nv-md btn-nv-gold group mt-8">
                    Open {ex.name}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </>
              );
            })()}
          </div>
          <div className="flex scale-90 items-center justify-center sm:scale-100">
            <div className="relative">
              <div className="absolute -inset-6 rounded-[3rem] bg-[#D6B56D]/10 blur-2xl" aria-hidden="true" />
              <Mock />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}