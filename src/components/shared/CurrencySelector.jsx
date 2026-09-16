import React from "react";
import { Globe } from "lucide-react";
import { usePlatformWorkflow } from "@/context/PlatformWorkflowContext";

const CURRENCIES = [
  { code: "EUR", symbol: "€", rate: 1, label: "Euro (€)" },
  { code: "MAD", symbol: "DH", rate: 10.8, label: "Moroccan Dirham (MAD)" },
  { code: "USD", symbol: "$", rate: 1.08, label: "US Dollar ($)" },
  { code: "XOF", symbol: "CFA", rate: 655.95, label: "CFA Franc (XOF)" },
  { code: "AED", symbol: "AED", rate: 3.96, label: "UAE Dirham (AED)" },
];

export default function CurrencySelector({ className = "" }) {
  const { currency, setCurrency } = usePlatformWorkflow();

  const handleChange = (e) => {
    const selected = CURRENCIES.find((c) => c.code === e.target.value);
    if (selected) {
      setCurrency(selected);
    }
  };

  return (
    <div className={`inline-flex items-center gap-1.5 bg-[#F4F4F4] backdrop-blur border border-[#E3E3E3] rounded-lg px-2.5 py-1 text-xs text-white ${className}`}>
      <Globe className="w-3.5 h-3.5 text-[#1B4F9C]" />
      <select
        value={currency.code}
        onChange={handleChange}
        className="bg-transparent text-xs font-bold text-white focus:outline-none cursor-pointer"
      >
        {CURRENCIES.map((c) => (
          <option key={c.code} value={c.code} className="text-slate-900 font-normal">
            {c.code} ({c.symbol})
          </option>
        ))}
      </select>
    </div>
  );
}
