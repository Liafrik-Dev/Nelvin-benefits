import React, { useRef } from "react";
import html2canvas from "html2canvas";
import { Download, QrCode as QrIcon } from "lucide-react";

// Self-contained digital membership card with QR (uses api.qrserver.com).
// Props: { employee, company, accent (hex), downloadable }

export default function MembershipCard({ employee, company, accent = "#059669", downloadable = true }) {
  const cardRef = useRef(null);
  const name = employee?.user_name || employee?.user_email?.split("@")[0] || "Member";
  const email = employee?.user_email || "";
  const subscriberId = employee?.subscriber_id || "";
  const department = employee?.department || "—";
  const tier = employee?.membership_tier || company?.membership_tier || "Corporate";
  const status = employee?.status || "active";
  const logoUrl = company?.branding_logo_url || company?.logo_url;
  const companyName = company?.name || "Nelvin";

  const qrPayload = JSON.stringify({
    sid: subscriberId,
    name,
    company: companyName,
    tier,
    status,
  });
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&margin=0&data=${encodeURIComponent(qrPayload)}`;

  const downloadCard = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, { backgroundColor: null, scale: 2 });
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = `${subscriberId || "nelvin-card"}.png`;
      a.click();
    } catch {
      /* download is best-effort */
    }
  };

  return (
    <div className="space-y-3">
      <div
        ref={cardRef}
        className="rounded-lg overflow-hidden shadow-lg border border-[#F1F1F1]"
        style={{ background: `linear-gradient(135deg, ${accent} 0%, #0f172a 100%)` }}
      >
        <div className="p-5 text-white relative">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              {logoUrl ? (
                <img src={logoUrl} alt="" className="w-9 h-9 rounded-lg object-cover bg-[#F4F4F4]" />
              ) : (
                <div className="w-9 h-9 bg-[#FFFFFF]/15 rounded-lg flex items-center justify-center text-[#0866FF] font-bold">
                  N
                </div>
              )}
              <div>
                <p className="text-[10px] uppercase tracking-wider opacity-70">Nelvin Membership</p>
                <p className="text-sm font-semibold leading-tight">{companyName}</p>
              </div>
            </div>
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${status === "active" ? "bg-[#0866FF]/30 text-ivory" : "bg-rose-400/30 text-rose-50"}`}>
              {status}
            </span>
          </div>

          <div className="mt-6 flex gap-4 items-center">
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wider opacity-60">Member</p>
              <p className="text-lg font-bold leading-tight truncate">{name}</p>
              <p className="text-xs opacity-70 truncate">{email}</p>
              <p className="text-[10px] mt-2 uppercase tracking-wider opacity-60">Member ID</p>
              <p className="font-mono text-base font-bold">{subscriberId || "—"}</p>
              <div className="mt-2 flex items-center gap-3 text-[11px] opacity-80">
                <span><span className="opacity-60">Dept: </span>{department}</span>
                <span><span className="opacity-60">Tier: </span>{tier}</span>
              </div>
            </div>
            <div className="rounded-lg bg-[#FFFFFF] p-1.5 flex-shrink-0">
              <img src={qrUrl} alt="Membership QR" width={84} height={84} />
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[#F1F1F1] flex items-center justify-between text-[10px] opacity-60">
            <span>Scan to verify · Nelvin Africa</span>
            <span className="font-mono">{company?.country || ""}</span>
          </div>
        </div>
      </div>

      {downloadable && (
        <div className="flex gap-2">
          <button onClick={downloadCard} className="inline-flex items-center gap-2 text-xs bg-[#FFFFFF] text-ivory font-semibold px-3 py-2 rounded-lg hover:bg-[#F4F4F4]">
            <Download className="w-3.5 h-3.5" /> Download Card
          </button>
          <a
            href={qrUrl}
            download={`${subscriberId || "nelvin"}-qr.png`}
            className="inline-flex items-center gap-2 text-xs bg-[#F4F4F4] text-ivory font-semibold px-3 py-2 rounded-lg hover:bg-[#F4F4F4]"
          >
            <QrIcon className="w-3.5 h-3.5" /> QR Code
          </a>
        </div>
      )}
    </div>
  );
}