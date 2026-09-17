import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Check, ExternalLink, Building2, Mail, Phone, MapPin, Globe, User, BadgeCheck,
} from "lucide-react";

function Detail({ label, value, icon }) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-2.5 py-2 border-b border-gray-50">
      {icon && <span className="text-ivory-dim mt-1">{icon}</span>}
      <div className="flex-1">
        <p className="text-[11px] uppercase tracking-wider text-ivory-dim">{label}</p>
        <p className="text-sm text-ivory break-words">{value}</p>
      </div>
    </div>
  );
}

function MediaRow({ label, src }) {
  if (!src) return null;
  return (
    <div className="mb-2">
      <p className="text-[11px] uppercase tracking-wider text-ivory-dim mb-1">{label}</p>
      <a href={src} target="_blank" rel="noopener noreferrer" className="block w-full h-28 rounded-full overflow-hidden border border-[#F1F1F1] bg-[#F9F8F7]">
        <img src={src} alt={label} className="w-full h-full object-cover" />
      </a>
    </div>
  );
}

export default function ApplicationReviewPanel({
  app, publishedOffer, onClose, onApprovePublish, onReject, onUnpublish,
}) {
  const [rejectMode, setRejectMode] = useState(false);
  const [reason, setReason] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <AnimatePresence>
      {app && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 z-40"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed right-0 top-0 bottom-0 w-full sm:w-[440px] bg-[#FFFFFF] shadow-xl z-50 overflow-y-auto flex flex-col"
          >
            <div className="sticky top-0 bg-emerald-black border-b border-[#F1F1F1] px-6 py-4 flex items-center justify-between z-10">
              <div>
                <p className="text-[11px] uppercase tracking-wider text-ivory-dim">{app.status}</p>
                <h2 className="font-bold text-ivory text-lg">{app.business_name}</h2>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-[#F4F4F4] flex items-center justify-center">
                <X className="w-4 h-4 text-ivory-muted" />
              </button>
            </div>

            <div className="px-6 py-4 flex-1">
              <Detail label="Contact name" value={app.contact_name} icon={<User className="w-4 h-4" />} />
              <Detail label="Email" value={app.email} icon={<Mail className="w-4 h-4" />} />
              <Detail label="Phone" value={app.phone} icon={<Phone className="w-4 h-4" />} />
              <Detail label="Category" value={app.category} icon={<Building2 className="w-4 h-4" />} />
              <Detail label="Country" value={app.country} icon={<MapPin className="w-4 h-4" />} />
              <Detail label="City" value={app.city} icon={<MapPin className="w-4 h-4" />} />
              <Detail label="Business address" value={app.business_address} />
              <Detail label="Website" value={app.website} icon={<Globe className="w-4 h-4" />} />
              <Detail label="Description" value={app.description} />
              <Detail label="Document type" value={app.document_type?.replace(/_/g, " ")} />
              <Detail label="Authorized" value={app.authorized_confirmation ? "Yes, applicant confirmed authorization" : "Not confirmed"} />

              {app.business_image_urls?.length > 0 && (
                <div className="mt-4">
                  <p className="text-[11px] uppercase tracking-wider text-ivory-dim mb-2">Business images</p>
                  <div className="grid grid-cols-2 gap-2">
                    {app.business_image_urls.map((url, i) => (
                      <a key={i} href={url} target="_blank" rel="noopener noreferrer" className="block h-24 rounded-full overflow-hidden border border-[#F1F1F1] bg-[#F9F8F7]">
                        <img src={url} alt="business" className="w-full h-full object-cover" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-3 space-y-2">
                <MediaRow label="Logo" src={app.logo_url} />
                <MediaRow label="Selfie" src={app.selfie_url} />
                <MediaRow label="ID document" src={app.id_document_url} />
                <MediaRow label="Business document" src={app.document_url} />
              </div>

              {publishedOffer && (
                <div className="mt-4 p-3 rounded-xl bg-[#FFFFFF] border border-[#F1F1F1]">
                  <p className="text-xs text-[#1B4F9C] font-semibold mb-1 flex items-center gap-1">
                    <BadgeCheck className="w-3.5 h-3.5" /> Published as live offer
                  </p>
                  <Link to={`/offer/${publishedOffer.id}`} target="_blank" className="text-xs text-[#1B4F9C] underline flex items-center gap-1">
                    View live offer <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
              )}

              {app.rejection_reason && (
                <div className="mt-3 p-3 rounded-xl bg-[#F9F8F7] border border-rose-100">
                  <p className="text-xs text-rose-700 font-semibold">Rejection reason</p>
                  <p className="text-xs text-rose-600 mt-0.5">{app.rejection_reason}</p>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-[#FFFFFF] border-t border-[#F1F1F1] px-6 py-4 space-y-2.5">
              {!rejectMode ? (
                <>
                  {app.status !== "approved" ? (
                    <button
                      disabled={busy}
                      onClick={async () => { setBusy(true); await onApprovePublish(app); setBusy(false); }}
                      className="w-full bg-[#1B4F9C] text-white py-3 rounded-full font-medium text-sm hover:bg-[#1B4F9C] disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" /> Approve & Publish
                    </button>
                  ) : (
                    <button
                      disabled={busy}
                      onClick={async () => { setBusy(true); await onUnpublish(app); setBusy(false); }}
                      className="w-full bg-[#F9F8F7] text-[#1B4F9C] ring-1 ring-[#1B4F9C]/20 py-3 rounded-full font-medium text-sm hover:bg-[#F9F8F7] disabled:opacity-50"
                    >
                      Unpublish (move back to pending)
                    </button>
                  )}
                  {app.status !== "rejected" && (
                    <button
                      onClick={() => setRejectMode(true)}
                      className="w-full text-rose-600 py-2.5 rounded-full font-medium text-sm hover:bg-[#F9F8F7]"
                    >
                      Reject
                    </button>
                  )}
                </>
              ) : (
                <div className="space-y-2.5">
                  <textarea
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Reason for rejection (optional)"
                    className="w-full rounded-xl border border-[#F1F1F1] p-3 text-sm outline-none focus:border-gray-400"
                    rows={3}
                  />
                  <div className="flex gap-2">
                    <button onClick={() => setRejectMode(false)} className="flex-1 py-3 rounded-full font-medium text-sm bg-[#F4F4F4] text-ivory-muted hover:bg-[#F4F4F4]">Cancel</button>
                    <button
                      disabled={busy}
                      onClick={async () => { setBusy(true); await onReject(app, reason); setRejectMode(false); setReason(""); setBusy(false); }}
                      className="flex-1 py-3 rounded-full font-medium text-sm bg-rose-950/50 text-rose-200 ring-1 ring-rose-400/30 hover:bg-rose-900/60 disabled:opacity-50"
                    >Confirm reject</button>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}