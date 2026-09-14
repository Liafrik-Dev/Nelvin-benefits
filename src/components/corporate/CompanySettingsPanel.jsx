import { db } from "@/services/api/base44Client";

import React, { useState, useEffect } from "react";

import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/AuthContext";
import {
  Save, Building2, Globe, Image as ImageIcon, ShieldCheck, Palette, History as AuditIcon,
} from "lucide-react";

const SSO_OPTIONS = [
  { id: "none", label: "None — employees sign up with email + password" },
  { id: "microsoft_entra", label: "Microsoft Entra ID (Azure AD)" },
  { id: "google_workspace", label: "Google Workspace" },
  { id: "okta", label: "Okta" },
];

export default function CompanySettingsPanel({ company, onChanged }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({
    name: company.name || "",
    industry: company.industry || "",
    country: company.country || "",
    city: company.city || "",
    address: company.address || "",
    website: company.website || "",
    email_domain: company.email_domain || "",
    logo_url: company.logo_url || "",
    branding_logo_url: company.branding_logo_url || "",
    branding_primary_color: company.branding_primary_color || "#059669",
    branding_welcome_message: company.branding_welcome_message || "",
    support_email: company.support_email || "",
    sso_provider: company.sso_provider || "none",
    sso_tenant_id: company.sso_tenant_id || "",
    sso_client_id: company.sso_client_id || "",
    sso_status: company.sso_status || "disabled",
  });
  const [saving, setSaving] = useState(false);
  const [audits, setAudits] = useState([]);
  const [tab, setTab] = useState("profile");

  const update = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    db.entities.AuditLog.filter({}, "-created_date", 50).catch(() => []).then((data) => {
      const mine = (data || []).filter((a) => a.admin_id === user?.id || a.entity_name === company.name);
      setAudits(mine.slice(0, 12));
    });
  }, [user?.id, company.name]);

  const onFile = (key, e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1_500_000) {
      toast({ title: "Image too large", description: "Please choose an image under 1.5MB.", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => update(key, reader.result);
    reader.readAsDataURL(file);
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const ssoStatus = form.sso_provider === "none" ? "disabled" : form.sso_client_id ? "configured" : form.sso_status;
      await db.entities.Company.update(company.id, {
        name: form.name,
        industry: form.industry,
        country: form.country,
        city: form.city,
        address: form.address,
        website: form.website,
        email_domain: form.email_domain.toLowerCase().replace(/^@/, ""),
        logo_url: form.logo_url,
        branding_logo_url: form.branding_logo_url,
        branding_primary_color: form.branding_primary_color,
        branding_welcome_message: form.branding_welcome_message,
        support_email: form.support_email,
        sso_provider: form.sso_provider,
        sso_tenant_id: form.sso_tenant_id,
        sso_client_id: form.sso_client_id,
        sso_status: ssoStatus,
      });
      try {
        await db.entities.AuditLog.create({
          admin_id: user?.id, admin_name: user?.full_name || user?.email,
          action: "update", entity_type: "Company", entity_id: company.id,
          entity_name: company.name, description: "Updated company settings (profile/branding/SSO)",
        });
      } catch {}
      toast({ title: "Saved", description: "Company settings updated." });
      onChanged?.();
    } catch (err) {
      toast({ title: "Save failed", description: err?.message || "Please try again.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-ivory">Settings</h1>
        <p className="text-sm text-ivory-muted mt-1">Company profile, branding, single sign-on, and the audit trail. Branding appears only inside the HR portal — Nelvin's own branding stays intact on the main site and individual subscribers' experience.</p>
      </div>

      <div className="flex flex-wrap gap-1 mb-6 border-b border-white/10 pb-2">
        {[["profile", "Profile"], ["branding", "Branding"], ["sso", "SSO"], ["audit", "Audit Trail"]].map(([id, label]) => (
          <button key={id} onClick={() => setTab(id)} className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${tab === id ? "bg-[#0A3A2F] text-ivory" : "text-ivory-muted hover:bg-[#0A3A2F]/5"}`}>
            {label}
          </button>
        ))}
      </div>

      <form onSubmit={save}>
        {tab === "profile" && (
          <div className="bg-emerald-black ring-1 ring-white/10 rounded-lg p-6 space-y-4 max-w-3xl">
            <h3 className="font-semibold text-ivory flex items-center gap-2"><Building2 className="w-4 h-4 text-[#D6B56D]" /> Company profile</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Company name" value={form.name} onChange={(v) => update("name", v)} full />
              <Input label="Industry" value={form.industry} onChange={(v) => update("industry", v)} />
              <Input label="Country" value={form.country} onChange={(v) => update("country", v)} />
              <Input label="City" value={form.city} onChange={(v) => update("city", v)} />
              <Input label="Address" value={form.address} onChange={(v) => update("address", v)} full />
              <Input label="Website" value={form.website} onChange={(v) => update("website", v)} full />
              <Input label="Support email (shown to employees)" value={form.support_email} onChange={(v) => update("support_email", v)} full />
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-ivory-muted mb-1.5 flex items-center gap-1"><Globe className="w-3 h-3" /> Email domain (used for auto-join)</label>
                <div className="flex items-center">
                  <span className="px-3 py-2 bg-[#0A3A2F]/5 border border-r-0 border-white/12 rounded-l-lg text-ivory-dim text-sm">@</span>
                  <input value={form.email_domain} onChange={(e) => update("email_domain", e.target.value.toLowerCase().replace(/^@/, ""))} className="flex-1 px-3 py-2 text-sm border border-white/12 rounded-r-lg outline-none focus:border-[#D6B56D]/40 focus:ring-2 focus:ring-white/10" />
                </div>
              </div>
            </div>
          </div>
        )}

        {tab === "branding" && (
          <div className="bg-emerald-black ring-1 ring-white/10 rounded-lg p-6 space-y-4 max-w-3xl">
            <h3 className="font-semibold text-ivory flex items-center gap-2"><Palette className="w-4 h-4 text-[#D6B56D]" /> HR portal branding</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-ivory-muted mb-1.5 flex items-center gap-1"><ImageIcon className="w-3 h-3" /> Main logo</label>
                <div className="aspect-square bg-forest-secondary/60 rounded-xl border border-white/12 flex items-center justify-center overflow-hidden">
                  {form.logo_url ? <img src={form.logo_url} alt="" className="w-full h-full object-cover" /> : <span className="text-xs text-ivory-dim">No logo</span>}
                </div>
                <input type="file" accept="image/*" onChange={(e) => onFile("logo_url", e)} className="block w-full text-xs text-ivory-muted file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-[#0A3A2F] file:text-[#D6B56D] file:font-semibold file:text-xs mt-2" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-ivory-muted mb-1.5">HR portal logo (optional, separate)</label>
                <div className="aspect-square bg-forest-secondary/60 rounded-xl border border-white/12 flex items-center justify-center overflow-hidden">
                  {form.branding_logo_url ? <img src={form.branding_logo_url} alt="" className="w-full h-full object-cover" /> : <span className="text-xs text-ivory-dim">No separate logo</span>}
                </div>
                <input type="file" accept="image/*" onChange={(e) => onFile("branding_logo_url", e)} className="block w-full text-xs text-ivory-muted file:mr-3 file:py-2 file:px-3 file:rounded-lg file:border-0 file:bg-[#0A3A2F] file:text-[#D6B56D] file:font-semibold file:text-xs mt-2" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-semibold text-ivory-muted mb-1.5">Primary accent color (HR portal)</label>
              <input type="color" value={form.branding_primary_color} onChange={(e) => update("branding_primary_color", e.target.value)} className="h-10 w-16 rounded-lg border border-white/12" />
              <span className="text-xs text-ivory-dim ml-2">{form.branding_primary_color}</span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-ivory-muted mb-1.5">Welcome message (shown to employees)</label>
              <textarea rows={3} value={form.branding_welcome_message} onChange={(e) => update("branding_welcome_message", e.target.value)} placeholder="Welcome to your company benefits portal!" className="w-full px-3 py-2 text-sm border border-white/12 rounded-lg outline-none focus:border-[#D6B56D]/40" />
            </div>
          </div>
        )}

        {tab === "sso" && (
          <div className="bg-emerald-black ring-1 ring-white/10 rounded-lg p-6 space-y-4 max-w-3xl">
            <h3 className="font-semibold text-ivory flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-[#D6B56D]" /> Single Sign-On</h3>
            <div>
              <label className="block text-xs font-semibold text-ivory-muted mb-1.5">SSO Provider</label>
              <select value={form.sso_provider} onChange={(e) => update("sso_provider", e.target.value)} className="w-full px-3 py-2 text-sm border border-white/12 rounded-lg outline-none focus:border-[#D6B56D]/40">
                {SSO_OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
            </div>
            {form.sso_provider !== "none" && (
              <>
                <Input label="Tenant ID / Directory ID" value={form.sso_tenant_id} onChange={(v) => update("sso_tenant_id", v)} />
                <Input label="Client ID / Application ID" value={form.sso_client_id} onChange={(v) => update("sso_client_id", v)} />
                <p className="text-xs text-ivory-dim">Status: <span className="font-semibold uppercase">{form.sso_client_id ? "configured" : "disabled"}</span>. Live SSO handshake requires Builder+ backend functions — this stores your config so we can provision the connection for you.</p>
              </>
            )}
          </div>
        )}

        {tab === "audit" && (
          <div className="bg-emerald-black ring-1 ring-white/10 rounded-lg p-6 max-w-3xl">
            <h3 className="font-semibold text-ivory flex items-center gap-2 mb-3"><AuditIcon className="w-4 h-4 text-[#D6B56D]" /> Recent changes by your team</h3>
            {audits.length === 0 ? (
              <p className="text-sm text-ivory-dim">No audit events recorded yet for this company.</p>
            ) : (
              <div className="divide-y divide-white/10">
                {audits.map((a) => (
                  <div key={a.id} className="py-3">
                    <p className="text-sm text-ivory"><span className="text-xs uppercase tracking-wider text-ivory-dim mr-2">{a.action}</span>{a.description}</p>
                    <p className="text-xs text-ivory-dim">{a.admin_name || "—"} · {new Date(a.created_date || new Date()).toLocaleString()}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-6 max-w-3xl">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 bg-[#D6B56D] hover:bg-[#E5C77A] disabled:opacity-70 text-white font-semibold px-5 py-2.5 rounded-lg text-sm">
            <Save className="w-4 h-4" /> {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

function Input({ label, value, onChange, full }) {
  return (
    <div className={full ? "sm:col-span-2" : ""}>
      <label className="block text-xs font-semibold text-ivory-muted mb-1.5">{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full px-3 py-2 text-sm border border-white/12 rounded-lg outline-none focus:border-[#D6B56D]/40 focus:ring-2 focus:ring-white/10" />
    </div>
  );
}