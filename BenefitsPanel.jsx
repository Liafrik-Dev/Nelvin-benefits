const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { Gift, Search } from "lucide-react";
import OfferCard from "@/components/nelvin/OfferCard";

export default function BenefitsPanel({ company }) {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const data = await db.entities.Offer.filter({ status: "active" }, "-created_date", 200).catch(() => []);
        setOffers(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = offers.filter((o) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (o.title || "").toLowerCase().includes(s) || (o.business_name || "").toLowerCase().includes(s) || (o.category || "").toLowerCase().includes(s);
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-heading text-gray-900">Benefits available to your team</h1>
        <p className="text-sm text-gray-500 mt-1">
          {company.membership_tier || "Corporate"} plan · {filtered.length} active offers your employees can redeem.
        </p>
      </div>

      <div className="relative mb-5">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search offers, brands, categories..."
          className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-50"
        />
      </div>

      {loading ? (
        <div className="p-12 text-center text-sm text-gray-400">Loading benefits…</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Gift className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-sm text-gray-500">No offers match. Try a different search or <Link to="/offers" className="text-emerald-700">browse all offers</Link>.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((o) => <OfferCard key={o.id} offer={o} />)}
        </div>
      )}
    </div>
  );
}