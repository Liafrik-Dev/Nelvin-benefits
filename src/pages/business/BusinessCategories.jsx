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
          <h1 className="text-2xl font-bold font-heading text-gray-900">Store Categories</h1>
          <p className="text-sm text-gray-500 mt-1">Organize your store products into custom subcategories.</p>
        </div>
        <button className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {categories.map((c) => (
          <div key={c.name} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-2 shadow-sm">
            <FolderTree className="w-6 h-6 text-emerald-600" />
            <h3 className="font-bold text-gray-900 text-base font-heading">{c.name}</h3>
            <p className="text-xs text-gray-500">{c.count} Active Deals</p>
          </div>
        ))}
      </div>
    </div>
  );
}