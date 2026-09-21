import { db } from "@/services/api/base44Client";

import React, { useState, useEffect } from "react";
import { Save, Loader2, RotateCcw } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { writeAudit } from "@/lib/auditLog";

// Stored as one row per key in platform_settings, so the shape can grow without
// a migration. The SMTP block is deliberately NOT here: those are server-side
// credentials and a browser-readable table must not hold them.
const DEFAULTS = {
  website_name: "NelvinBenefit",
  tagline: "Employee benefits that people actually use",
  support_email: "Nelvin23@proton.me",
  languages: "en, fr, de, es, sw, ig, yo",
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
  seo_title: "NelvinBenefit — Employee benefits platform for Africa",
  seo_description: "Unlock exclusive discounts, cashback, and premium experiences for your team across every African country.",
};

const SETTING_KEY = "platform";

export default function AdminSettings() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [rowId, setRowId] = useState(null);
  const [form, setForm] = useState(DEFAULTS);

  useEffect(() => {
    (async () => {
      try {
        const rows = await db.entities.PlatformSetting.filter({ key: SETTING_KEY }, null, 1).catch(() => []);
        const existing = rows && rows[0];
        if (existing) {
          setRowId(existing.id);
          setForm({ ...DEFAULTS, ...(existing.value || {}) });
        }
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const discard = () => { setForm(DEFAULTS); setError(""); };

  const save = async () => {
    setSaving(true);
    setError("");
    try {
      if (rowId) {
        await db.entities.PlatformSetting.update(rowId, { value: form });
      } else {
        const created = await db.entities.PlatformSetting.create({ key: SETTING_KEY, value: form });
        setRowId(created?.id ?? null);
      }
      await writeAudit(user, {
        action: "update",
        entity_type: "PlatformSetting",
        entity_id: rowId || SETTING_KEY,
        entity_name: "Platform settings",
        description: "Updated platform settings (identity, locales, social, legal, SEO)",
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err?.message || "Could not save settings.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-ivory-muted">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading settings…
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-ivory">Settings</h1>
        <p className="text-sm text-ivory-muted mt-1">
          Website identity, locales, social links, legal URLs and SEO. Saved to the platform database for every admin.
        </p>
      </div>

      <div className="space-y-6">
        <Section title="Website">
          <Field label="Website Name"><Input value={form.website_name} onChange={(e) => set("website_name", e.target.value)} /></Field>
          <Field label="Tagline"><Input value={form.tagline} onChange={(e) => set("tagline", e.target.value)} /></Field>
          <Field label="Support Email"><Input type="email" value={form.support_email} onChange={(e) => set("support_email", e.target.value)} /></Field>
        </Section>

        <Section title="Languages & Currencies">
          <Field label="Active Languages" hint="Comma-separated locale codes shipped in src/lib/locales.">
            <Input value={form.languages} onChange={(e) => set("languages", e.target.value)} />
          </Field>
          <Field label="Active Currencies"><Input value={form.currencies} onChange={(e) => set("currencies", e.target.value)} /></Field>
        </Section>

        <Section title="Social Links">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Field label="Instagram"><Input value={form.social_instagram} onChange={(e) => set("social_instagram", e.target.value)} /></Field>
            <Field label="Facebook"><Input value={form.social_facebook} onChange={(e) => set("social_facebook", e.target.value)} /></Field>
            <Field label="X"><Input value={form.social_x} onChange={(e) => set("social_x", e.target.value)} /></Field>
            <Field label="LinkedIn"><Input value={form.social_linkedin} onChange={(e) => set("social_linkedin", e.target.value)} /></Field>
            <Field label="YouTube"><Input value={form.social_youtube} onChange={(e) => set("social_youtube", e.target.value)} /></Field>
            <Field label="TikTok"><Input value={form.social_tiktok} onChange={(e) => set("social_tiktok", e.target.value)} /></Field>
          </div>
        </Section>

        <Section title="Legal & Contact">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
            <label htmlFor="maintenance" className="text-sm text-ivory">Maintenance mode (shows a notice to end users)</label>
          </div>
        </Section>

        {error && (
          <p className="text-sm text-red-600 bg-red-50 ring-1 ring-red-100 rounded-lg px-4 py-3">{error}</p>
        )}

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={save}
            disabled={saving}
            className="bg-[#1B4F9C] hover:opacity-90 text-white rounded-full px-5 py-2.5 text-sm font-semibold flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {saved ? "Saved!" : "Save settings"}
          </button>
          <button
            onClick={discard}
            disabled={saving}
            className="rounded-full px-5 py-2.5 text-sm font-semibold text-ivory-muted hover:text-ivory ring-1 ring-[#F1F1F1] flex items-center gap-2 disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4" /> Reset to defaults
          </button>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-5 sm:p-6">
      <h2 className="font-semibold text-ivory mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div>
      <label className="text-sm font-medium text-ivory block mb-1.5">{label}</label>
      {children}
      {hint && <p className="text-xs text-ivory-dim mt-1">{hint}</p>}
    </div>
  );
}

function Input({ type = "text", ...props }) {
  return (
    <input
      type={type}
      className="w-full border border-[#F1F1F1] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1B4F9C]/20"
      {...props}
    />
  );
}
