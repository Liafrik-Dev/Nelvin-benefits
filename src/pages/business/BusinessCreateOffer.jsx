import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { db } from "@/services/api/base44Client";
import { Tag, Plus, CheckCircle2 } from "lucide-react";

export default function BusinessCreateOffer() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    category: "Shopping & Fashion",
    discount_label: "20% OFF",
    original_price: 100,
    discount_price: 80,
    savings_amount: 20,
    description: "",
    country: "Nigeria",
    city: "Lagos",
    tag: "Popular",
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await db.entities.Offer.create({
        ...form,
        business_name: "Nike Nigeria",
        status: "pending",
        is_published: false,
      }).catch(() => null);
      navigate("/business/offers");
    } catch {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold font-heading text-gray-900">Create New Offer</h1>
        <p className="text-sm text-gray-500 mt-1">Submit a new deal or promo code for platform validation.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4 shadow-sm">
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Deal Title</label>
          <input
            type="text"
            required
            placeholder="e.g. 25% Off Storewide Nike Footwear"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-900"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Category</label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold"
            >
              <option>Shopping & Fashion</option>
              <option>Food & Dining</option>
              <option>Health & Wellness</option>
              <option>Travel & Stay</option>
              <option>Electronics & Tech</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Discount Tag Label</label>
            <input
              type="text"
              required
              placeholder="e.g. 25% OFF / BOGO"
              value={form.discount_label}
              onChange={(e) => setForm({ ...form, discount_label: e.target.value })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Original Price ($)</label>
            <input
              type="number"
              value={form.original_price}
              onChange={(e) => setForm({ ...form, original_price: Number(e.target.value) })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Discount Price ($)</label>
            <input
              type="number"
              value={form.discount_price}
              onChange={(e) => setForm({ ...form, discount_price: Number(e.target.value) })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Savings Amount ($)</label>
            <input
              type="number"
              value={form.savings_amount}
              onChange={(e) => setForm({ ...form, savings_amount: Number(e.target.value) })}
              className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-emerald-700"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Description & Terms</label>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Describe offer conditions, valid locations, or exclusions..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-xs outline-none focus:border-emerald-600"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#082F24] text-[#B8FF00] font-bold py-3 rounded-full text-xs hover:bg-emerald-950 transition-colors shadow-sm"
        >
          {loading ? "Submitting..." : "Submit Offer for Review"}
        </button>
      </form>
    </div>
  );
}