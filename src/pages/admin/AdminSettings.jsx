import React, { useState } from "react";
import { Save, Loader2 } from "lucide-react";
import StatusBadge from "@/components/admin/StatusBadge";

export default function AdminSettings() {
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    website_name: "Nelvin",
    tagline: "Africa's savings super app",
    support_email: "Nelvin23@proton.me",
    smtp_host: "",
    smtp_port: "",
    smtp_user: "",
    smtp_password: "",
    languages: "en",
    currencies: "USD, NGN, KES, GHS, ZAR, XAF",
    social_instagram: "",
    social_facebook: "",
    social_x: "",
    social_linkedin: "",
    social_youtube: "",
    social_tiktok: "",
    terms_url: "",
    privacy_policy_url: "",
    contact_phone: "",
    maintenance_mode: false,
    seo_title: "Nelvin — Africa's savings super app",
    seo_description: "Unlock exclusive discounts, cashback, and premium experiences across every African country.",
  });

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const save = async () => {
    setSaving(true);
    // Settings persistence requires a dedicated Settings entity (Phase 2/3).
    // For now we hold config in localStorage until the Settings entity ships.
    localStorage.setItem("nelvin_admin_settings", JSON.stringify(form));
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Website identity, SMTP, languages, currencies, social, legal, SEO.</p>
      </div>

      <div className="space-y-6">
        <Section title="Website">
          <Field label="Website Name"><Input value={form.website_name} onChange={(e) => set("website_name", e.target.value)} /></Field>
          <Field label="Tagline"><Input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} /></Field>
          <Field label="Logo / Favicon URLs" hint="Upload URLs via the UploadFile integration once credits reset."><Input placeholder="Logo URL" /></Field>
        </Section>

        <Section title="Email & SMTP">
          <Field label="Support Email"><Input value={form.support_email} onChange={(e) => set("support_email", e.target.value)} /></Field>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Field label="SMTP Host"><Input value={form.smtp_host} onChange={(e) => set("smtp_host", e.target.value)} /></Field>
            <Field label="SMTP Port"><Input value={form.smtp_port} onChange={(e) => set("smtp_port", e.target.value)} /></Field>
            <Field label="SMTP User"><Input value={form.smtp_user} onChange={(e) => set("smtp_user", e.target.value)} /></Field>
            <Field label="SMTP Password"><Input type="password" value={form.smtp_password} onChange={(e) => set("smtp_password", e.target.value)} /></Field>
          </div>
        </Section>

        <Section title="Languages & Currencies">
          <Field label="Active Languages"><Input value={form.languages} onChange={(e) => set("languages", e.target.value)} /></Field>
          <Field label="Active Currencies"><Input value={form.currencies} onChange={(e) => set("currencies", e.target.value)} /></Field>
        </Section>

        <Section title="Social Links">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <Field label="Instagram"><Input value={form.social_instagram} onChange={(e) => set("social_instagram", e.target.value)} /></Field>
            <Field label="Facebook"><Input value={form.social_facebook} onChange={(e) => set("social_facebook", e.target.value)} /></Field>
            <Field label="X"><Input value={form.social_x} onChange={(e) => set("social_x", e.target.value)} /></Field>
            <Field label="LinkedIn"><Input value={form.social_linkedin} onChange={(e) => set("social_linkedin", e.target.value)} /></Field>
            <Field label="YouTube"><Input value={form.social_youtube} onChange={(e) => set("social_youtube", e.target.value)} /></Field>
            <Field label="TikTok"><Input value={form.social_tiktok} onChange={(e) => set("social_tiktok", e.target.value)} /></Field>
          </div>
        </Section>

        <Section title="Legal & Contact">
          <div className="grid grid-cols-2 gap-3">
            <Field label="Terms URL"><Input value={form.terms_url} onChange={(e) => set("terms_url", e.target.value)} /></Field>
            <Field label="Privacy Policy URL"><Input value={form.privacy_policy_url} onChange={(e) => set("privacy_policy_url", e.target.value)} /></Field>
          </div>
          <Field label="Contact Phone"><Input value={form.contact_phone} onChange={(e) => set("contact_phone", e.target.value)} /></Field>
        </Section>

        <Section title="SEO & Maintenance">
          <Field label="SEO Title"><Input value={form.seo_title} onChange={(e) => set("seo_title", e.target.value)} /></Field>
          <Field label="SEO Description"><Input value={form.seo_description} onChange={(e) => set("seo_description", e.target.value)} /></Field>
          <div className="flex items-center gap-2 pt-2">
            <input id="maintenance" type="checkbox" checked={form.maintenance_mode} onChange={(e) => set("maintenance_mode", e.target.checked)} />
            <label htmlFor="maintenance" className="text-sm text-gray-700">Maintenance Mode (disable public app for end users)</label>
          </div>
        </Section>

        <div className="flex items-center gap-2">
          <button
            onClick={save}
            disabled={saving}
            className="bg-emerald-700 hover:bg-emerald-800 text-white rounded-full px-5 py-2.5 text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saved ? "Saved!" : "Save settings"}
          </button>
          <span className="text-xs text-gray-400">Settings persistence ships with the Settings entity in Phase 2/3. Values are saved to this browser only for now.</span>
          <StatusBadge status="pending" label="Phase 2/3" />
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6">
      <h2 className="font-semibold text-gray-900 mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-700 block mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function Input({ type = "text", ...props }) {
  return (
    <input
      type={type}
      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-emerald-100"
      {...props}
    />
  );
}