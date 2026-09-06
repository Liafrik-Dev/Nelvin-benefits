const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ShieldAlert, Check, Trash2, Eye, ExternalLink } from "lucide-react";

import { useAuth } from "@/lib/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/nelvin/Navbar";
import Footer from "@/components/nelvin/Footer";
import ApplicationReviewPanel from "@/components/admin/ApplicationReviewPanel";

const STATUS_FILTERS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "approved", label: "Approved" },
  { key: "rejected", label: "Rejected" },
];

export default function AdminDashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("applications");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedApp, setSelectedApp] = useState(null);

  useEffect(() => {
    if (user?.role !== "admin") return;
    Promise.all([
      db.entities.VendorApplication.list("-created_date", 100),
      db.entities.Offer.list("-created_date", 100),
    ]).then(([apps, offs]) => {
      setApplications(apps);
      setOffers(offs);
      setLoading(false);
    });
  }, [user]);

  const counts = useMemo(() => ({
    all: applications.length,
    pending: applications.filter((a) => a.status === "pending").length,
    approved: applications.filter((a) => a.status === "approved").length,
    rejected: applications.filter((a) => a.status === "rejected").length,
  }), [applications]);

  const filteredApps = statusFilter === "all" ? applications : applications.filter((a) => a.status === statusFilter);
  const publishedOffer = offers.find((o) => o.id === selectedApp?.published_offer_id);

  const patchApp = (id, patch) => {
    setApplications((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)));
    setSelectedApp((prev) => (prev && prev.id === id ? { ...prev, ...patch } : prev));
  };

  const handleApprovePublish = async (app) => {
    try {
      const newOffer = await db.entities.Offer.create({
        title: `${app.business_name} — Welcome Offer`,
        business_name: app.business_name,
        description: app.description || `New merchant on Nelvin: ${app.business_name}.`,
        image_url: app.logo_url || (app.business_image_urls && app.business_image_urls[0]) || "",
        category: app.category,
        country: app.country,
        city: app.city || "",
        tag: "New",
        status: "active",
      });
      await db.entities.VendorApplication.update(app.id, {
        status: "approved",
        published_offer_id: newOffer.id,
      });
      setOffers((prev) => [newOffer, ...prev]);
      patchApp(app.id, { status: "approved", published_offer_id: newOffer.id });
      toast({ title: "Published", description: `${app.business_name} is now live on Nelvin.` });
    } catch (err) {
      toast({ title: "Failed to publish application", variant: "destructive" });
    }
  };

  const handleReject = async (app, reason) => {
    try {
      await db.entities.VendorApplication.update(app.id, {
        status: "rejected",
        rejection_reason: reason || "",
      });
      patchApp(app.id, { status: "rejected", rejection_reason: reason || "" });
      toast({ title: "Rejected", description: `${app.business_name} has been rejected.` });
    } catch (err) {
      toast({ title: "Failed to reject application", variant: "destructive" });
    }
  };

  const handleUnpublish = async (app) => {
    try {
      if (app.published_offer_id) {
        await db.entities.Offer.delete(app.published_offer_id);
        setOffers((prev) => prev.filter((o) => o.id !== app.published_offer_id));
      }
      await db.entities.VendorApplication.update(app.id, {
        status: "pending",
        published_offer_id: "",
      });
      patchApp(app.id, { status: "pending", published_offer_id: "" });
      toast({ title: "Unpublished", description: `${app.business_name} moved back to pending.` });
    } catch (err) {
      toast({ title: "Failed to unpublish", variant: "destructive" });
    }
  };

  const deleteOffer = async (id) => {
    await db.entities.Offer.delete(id);
    setOffers((prev) => prev.filter((o) => o.id !== id));
  };

  if (user && user.role !== "admin") {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center px-4">
        <div className="text-center">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h1 className="text-xl font-bold text-gray-900 mb-2">Access restricted</h1>
          <p className="text-gray-500 text-sm">This area is only available to Nelvin staff.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5]">
      <div className="relative bg-gray-900 pt-24 pb-10 px-4 sm:px-6 lg:px-8">
        <Navbar />
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl sm:text-3xl font-bold font-heading text-white">Staff Admin</h1>
          <p className="text-white/50 text-sm mt-1">Internal tools — not visible to app users</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-4 pb-20">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setTab("applications")}
            className={`px-5 py-2 rounded-full text-sm font-medium ${tab === "applications" ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600"}`}
          >
            Vendor Applications ({applications.length})
          </button>
          <button
            onClick={() => setTab("offers")}
            className={`px-5 py-2 rounded-full text-sm font-medium ${tab === "offers" ? "bg-gray-900 text-white" : "bg-white border border-gray-200 text-gray-600"}`}
          >
            Offers ({offers.length})
          </button>
        </div>

        {loading ? (
          <div className="py-16 text-center text-gray-400">Loading...</div>
        ) : tab === "applications" ? (
          <>
            <div className="flex gap-2 mb-4 flex-wrap">
              {STATUS_FILTERS.map((s) => (
                <button
                  key={s.key}
                  onClick={() => setStatusFilter(s.key)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${statusFilter === s.key ? "bg-emerald-700 text-white" : "bg-white border border-gray-200 text-gray-600"}`}
                >
                  {s.label} ({counts[s.key]})
                </button>
              ))}
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
              {filteredApps.length === 0 && <p className="p-6 text-sm text-gray-400">No {statusFilter === "all" ? "" : statusFilter} applications.</p>}
              {filteredApps.map((app) => (
                <div key={app.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1 cursor-pointer min-w-0" onClick={() => setSelectedApp(app)}>
                    <p className="font-semibold text-gray-900 flex items-center gap-2">
                      {app.business_name}
                      {app.published_offer_id && <Check className="w-4 h-4 text-emerald-600" />}
                    </p>
                    <p className="text-xs text-gray-500 truncate">{app.contact_name} · {app.email} · {app.category} · {app.country}</p>
                    {app.status === "rejected" && app.rejection_reason && (
                      <p className="text-xs text-rose-500 mt-1">Reason: {app.rejection_reason}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`text-xs font-semibold px-3 py-1 rounded-full ${
                        app.status === "approved" ? "bg-emerald-100 text-emerald-700"
                        : app.status === "rejected" ? "bg-rose-100 text-rose-700"
                        : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {app.status}
                    </span>
                    <button
                      onClick={() => setSelectedApp(app)}
                      className="px-3 h-8 rounded-full bg-gray-900 text-white text-xs font-medium flex items-center gap-1 hover:bg-gray-800"
                    >
                      <Eye className="w-3.5 h-3.5" /> Review
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 divide-y divide-gray-100">
            {offers.length === 0 && <p className="p-6 text-sm text-gray-400">No offers.</p>}
            {offers.map((offer) => (
              <div key={offer.id} className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <img src={offer.image_url} alt={offer.title} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-900 text-sm truncate">{offer.title}</p>
                    <p className="text-xs text-gray-500">{offer.business_name} · {offer.country} · {offer.status}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <Link to={`/offer/${offer.id}`} target="_blank" className="w-8 h-8 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center">
                    <ExternalLink className="w-4 h-4 text-gray-600" />
                  </Link>
                  <button onClick={() => deleteOffer(offer.id)} className="w-8 h-8 rounded-full bg-rose-50 hover:bg-rose-100 flex items-center justify-center">
                    <Trash2 className="w-4 h-4 text-rose-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />

      <ApplicationReviewPanel
        app={selectedApp}
        publishedOffer={publishedOffer}
        onClose={() => setSelectedApp(null)}
        onApprovePublish={handleApprovePublish}
        onReject={handleReject}
        onUnpublish={handleUnpublish}
      />
    </div>
  );
}