import React from "react";

export default function AdminPageHeader({ title, subtitle, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
      <div>
        <h1 className="text-2xl font-bold font-heading text-ivory">{title}</h1>
        {subtitle && <p className="text-sm text-ivory-muted mt-1">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center gap-2 flex-wrap">{action}</div>}
    </div>
  );
}