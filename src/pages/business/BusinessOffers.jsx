import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "@/services/api/base44Client";
import { Tag, Plus, Edit, Trash2, Eye } from "lucide-react";

export default function BusinessOffers() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
  ];

  const list = offers.length > 0 ? offers : sampleOffers;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-gray-900">Manage Store Offers</h1>
          <p className="text-sm text-gray-500 mt-1">Create, edit, pause, or archive promotional deals for corporate subscribers.</p>
        </div>
        <Link
          to="/business/offers/new"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 shadow-sm"
        >
          <Plus className="w-4 h-4" /> Create New Offer
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider font-semibold border-b border-gray-100">
            <tr>
              <th className="px-6 py-3.5">Offer Title</th>
              <th className="px-6 py-3.5">Category</th>
              <th className="px-6 py-3.5">Discount Label</th>
              <th className="px-6 py-3.5">Redemptions</th>
              <th className="px-6 py-3.5">Status</th>
              <th className="px-6 py-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {list.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-bold text-gray-900 flex items-center gap-2">
                  <Tag className="w-4 h-4 text-emerald-600" /> {o.title}
                </td>
                <td className="px-6 py-4 text-gray-600">{o.category}</td>
                <td className="px-6 py-4 font-extrabold text-emerald-700">{o.discount_label}</td>
                <td className="px-6 py-4 font-bold text-gray-900">{o.total_redemptions_count || 0}</td>
                <td className="px-6 py-4">
                  <span className="bg-emerald-50 text-emerald-700 text-xs font-bold px-2.5 py-1 rounded-full uppercase">
                    {o.status || "Active"}
                  </span>
                </td>
                <td className="px-6 py-4 text-right space-x-2">
                  <Link to={`/offer/${o.id}`} className="text-xs font-bold text-gray-600 hover:underline">View</Link>
                  <button className="text-xs font-bold text-emerald-700 hover:underline">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}