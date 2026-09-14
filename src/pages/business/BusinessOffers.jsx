import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "@/services/api/base44Client";
import { Tag, Plus, Edit, Trash2, Eye } from "lucide-react";

export default function BusinessOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In production (Supabase) only offers created by this account are visible
    // via RLS; on the local fallback we show the demo store's sample set.
    db.entities.Offer.list("-created_date", 100)
      .then((data) => {
        setOffers(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const sampleOffers = [
    { id: "o1", title: "25% Off Nike Footwear", category: "Shopping & Fashion", discount_label: "25% OFF", status: "active", total_redemptions_count: 84 },
    { id: "o2", title: "Buy 1 Get 1 Free Running Tees", category: "Shopping & Fashion", discount_label: "BOGO", status: "active", total_redemptions_count: 58 },
    { id: "o3", title: "10% VIP Fitness Pass Discount", category: "Health & Fitness", discount_label: "10% OFF", status: "paused", total_redemptions_count: 12 },
  ];

  const [items, setItems] = useState([]);

  useEffect(() => {
    setItems(offers.length > 0 ? offers : sampleOffers);
  }, [offers]);

  const toggleStatus = (id) => {
    setItems(items.map((o) => (o.id === id ? { ...o, status: o.status === "active" ? "paused" : "active" } : o)));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-[#F5F1E8]">Manage Store Offers</h1>
          <p className="text-sm text-ivory-muted mt-1">Create, edit, pause, or archive promotional deals for corporate subscribers.</p>
        </div>
        <Link
          to="/business/offers/new"
          className="bg-[#062B23] hover:bg-[#0A3A2F] text-[#D6B56D] font-bold text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 shadow-sm transition-colors"
        >
          <Plus className="w-4 h-4 text-[#D6B56D]" /> Create New Offer
        </Link>
      </div>

      <div className="bg-white rounded-lg border border-white/10 overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-forest-secondary/60 text-ivory-muted text-xs uppercase tracking-wider font-semibold border-b border-white/10">
            <tr>
              <th className="px-6 py-3.5">Offer Title</th>
              <th className="px-6 py-3.5">Category</th>
              <th className="px-6 py-3.5">Discount Label</th>
              <th className="px-6 py-3.5">Redemptions</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {items.map((o) => (
              <tr key={o.id} className="hover:bg-forest-secondary/60 transition-colors">
                <td className="px-6 py-4 font-bold text-ivory flex items-center gap-2">
                  <Tag className="w-4 h-4 text-[#E5C77A]" /> {o.title}
                </td>
                <td className="px-6 py-4 text-ivory-muted">{o.category}</td>
                <td className="px-6 py-4 font-extrabold text-[#E5C77A]">{o.discount_label}</td>
                <td className="px-6 py-4 font-bold text-ivory">{o.total_redemptions_count || 0}</td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase ${
                    o.status === "active" ? "bg-[#0A3A2F] text-[#D6B56D]" : "bg-amber-50 text-amber-700"
                  }`}>
                    {o.status || "Active"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <button
                    onClick={() => toggleStatus(o.id)}
                    className="text-xs font-bold text-[#F5F1E8] hover:underline"
                  >
                    {o.status === "active" ? "Pause" : "Activate"}
                  </button>
                  <Link to={`/offer/${o.id}`} className="text-xs font-bold text-ivory-muted hover:underline">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}