import { db } from "@/services/api/base44Client";

import React, { useState, useEffect } from "react";
import { X, Loader2 } from "lucide-react";

export default function AdminEditModal({
  open,
  entityName,
  record,
  fields = [],
  title,
  onClose,
  onSaved,
  createIfNew = true,
}) {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm(record || {});
  }, [open, record]);

  if (!open) return null;

  const isNew = !record || !record.id;

  const set = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const save = async () => {
    setSaving(true);
    try {
      if (isNew && createIfNew) {
        const created = await db.entities[entityName].create(form);
        await onSaved(created);
      } else if (!isNew) {
        await db.entities[entityName].update(record.id, form);
        await onSaved();
      }
      onClose();
    } catch (err) {
      console.error(err);
      alert(err?.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const remove = async () => {
    if (!record?.id) return;
    if (!window.confirm("Are you sure you want to delete this record? This cannot be undone.")) return;
    setSaving(true);
    try {
      await db.entities[entityName].delete(record.id);
      await onSaved();
      onClose();
    } catch (err) {
      console.error(err);
      alert(err?.message || "Failed to delete");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-[#FFFFFF] rounded-lg shadow-2xl border border-[#F1F1F1] w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-[#F1F1F1] flex items-center justify-between sticky top-0 bg-[#FFFFFF] z-10">
          <h2 className="font-bold text-ivory text-lg">
            {title || (isNew ? `New ${entityName}` : `Edit ${entityName}`)}
          </h2>
          <button onClick={onClose} className="text-ivory-dim hover:text-ivory">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          {fields.map((f) => {
            const val = form[f.key] ?? (f.type === "number" ? "" : f.type === "array" ? [] : "");
            if (f.type === "select") {
              return (
                <div key={f.key}>
                  <label className="text-sm font-medium text-ivory block mb-1.5">{f.label}</label>
                  <select
                    value={val}
                    onChange={(e) => set(f.key, e.target.value)}
                    className="w-full border border-[#F1F1F1] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1B4F9C]/20"
                  >
                    <option value="">—</option>
                    {f.options.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
              );
            }
            if (f.type === "textarea") {
              return (
                <div key={f.key}>
                  <label className="text-sm font-medium text-ivory block mb-1.5">{f.label}</label>
                  <textarea
                    value={val}
                    onChange={(e) => set(f.key, e.target.value)}
                    rows={4}
                    className="w-full border border-[#F1F1F1] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1B4F9C]/20"
                  />
                </div>
              );
            }
            if (f.type === "bool") {
              return (
                <div key={f.key} className="flex items-center gap-2">
                  <input
                    id={f.key}
                    type="checkbox"
                    checked={!!val}
                    onChange={(e) => set(f.key, e.target.checked)}
                  />
                  <label htmlFor={f.key} className="text-sm text-ivory">
                    {f.label}
                  </label>
                </div>
              );
            }
            if (f.type === "url") {
              return (
                <div key={f.key}>
                  <label className="text-sm font-medium text-ivory block mb-1.5">{f.label}</label>
                  <input
                    type="text"
                    placeholder="https://"
                    value={val}
                    onChange={(e) => set(f.key, e.target.value)}
                    className="w-full border border-[#F1F1F1] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1B4F9C]/20"
                  />
                  {f.help && <p className="text-xs text-ivory-dim mt-1">{f.help}</p>}
                </div>
              );
            }
            return (
              <div key={f.key}>
                <label className="text-sm font-medium text-ivory block mb-1.5">{f.label}</label>
                <input
                  type={f.type === "number" ? "number" : "text"}
                  value={val}
                  onChange={(e) =>
                    set(f.key, f.type === "number" ? Number(e.target.value) : e.target.value)
                  }
                  className="w-full border border-[#F1F1F1] rounded-xl px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1B4F9C]/20"
                />
              </div>
            );
          })}
        </div>
        <div className="px-6 py-4 border-t border-[#F1F1F1] flex items-center justify-between gap-2 sticky bottom-0 bg-[#FFFFFF]">
          {!isNew && (
            <button
              onClick={remove}
              disabled={saving}
              className="text-sm font-medium text-rose-600 hover:text-rose-700 disabled:opacity-50"
            >
              Delete
            </button>
          )}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-ivory-muted hover:bg-[#F4F4F4] rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={save}
              disabled={saving}
              className="px-4 py-2 text-sm font-semibold bg-[#1B4F9C] hover:bg-[#1B4F9C] text-white rounded-lg flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {isNew ? "Create" : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}