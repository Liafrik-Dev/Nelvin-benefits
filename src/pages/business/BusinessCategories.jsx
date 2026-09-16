import React from "react";
import { FolderTree, Plus } from "lucide-react";

export default function BusinessCategories() {
  const categories = [
    { name: "Footwear & Sneakers", count: 12 },
    { name: "Athletic Apparel", count: 24 },
    { name: "Accessories & Bags", count: 8 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-heading text-ivory">Store Categories</h1>
          <p className="text-sm text-ivory-muted mt-1">Organize your store products into custom subcategories.</p>
        </div>
        <button className="bg-[#1B4F9C] text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {categories.map((c) => (
          <div key={c.name} className="bg-emerald-black ring-1 ring-[#F1F1F1] rounded-lg p-6 space-y-2 shadow-sm">
            <FolderTree className="w-6 h-6 text-[#1B4F9C]" />
            <h3 className="font-bold text-ivory text-base font-heading">{c.name}</h3>
            <p className="text-xs text-ivory-muted">{c.count} Active Deals</p>
          </div>
        ))}
      </div>
    </div>
  );
}