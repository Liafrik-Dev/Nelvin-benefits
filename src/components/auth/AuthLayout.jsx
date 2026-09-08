import React from "react";

const LUXE_BG = "https://images.unsplash.com/photo-1618221197710-5a7d3b8f3d1?w=1920&q=80";

export default function AuthLayout({ icon: Icon, title, subtitle, footer, children }) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#082F24] px-4 py-10 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${LUXE_BG})`, opacity: 0.35 }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-[#082F24]/85 via-[#082F24]/70 to-[#180126]/90" />
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-[#B8FF00]/10 blur-3xl" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-[#7637E3]/15 blur-3xl" />

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#B8FF00] mb-4 shadow-lg shadow-[#B8FF00]/20">
            <Icon className="w-7 h-7 text-[#082F24]" aria-hidden="true" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-white">{title}</h1>
          {subtitle && <p className="text-white/60 mt-2 text-sm">{subtitle}</p>}
        </div>
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl ring-1 ring-white/20 p-8">
          {children}
        </div>
        <p className="text-center text-xs text-white/60 mt-6 flex items-center justify-center gap-1.5">
          <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current" aria-hidden="true"><path d="M12 2a4 4 0 0 1 4 4v2h2v12H6V8h2V6a4 4 0 0 1 4-4zam0 2a2 2 0 0 0-2 2v2h4V6a2 2 0 0 0-2-2z"/></svg>
          Protected by enterprise-grade security
        </p>
      </div>
      {footer && (
        <div className="relative text-center text-sm text-white/70 mt-6">{footer}</div>
      )}
    </div>
  );
}
