// Shared helpers for the admin backend

export function exportToCsv(filename, rows, columns) {
  const headerLine = columns.map((c) => `"${(c.csvLabel || c.label || c.key || "").toString().replace(/"/g, '""')}"`).join(",");
  const body = rows
    .map((row) =>
      columns
        .map((c) => {
          let val = "";
          if (c.csvValue) val = c.csvValue(row);
          else if (typeof c.accessor === "function") val = c.accessor(row);
          else if (c.key) val = row[c.key];
          return `"${String(val ?? "").replace(/"/g, '""')}"`;
        })
        .join(",")
    )
    .join("\n");
  const csv = `${headerLine}\n${body}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function paginate(items, page, pageSize) {
  const start = page * pageSize;
  return (items || []).slice(start, start + pageSize);
}

export function applySort(items, sort) {
  if (!sort || !sort.key) return items;
  const dir = sort.dir === "desc" ? -1 : 1;
  return [...items].sort((a, b) => {
    const av = a[sort.key];
    const bv = b[sort.key];
    if (av == null && bv == null) return 0;
    if (av == null) return 1;
    if (bv == null) return -1;
    if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
    return String(av).localeCompare(String(bv)) * dir;
  });
}

export function formatDate(value) {
  if (!value) return "";
  const d = new Date(value);
  if (isNaN(d.getTime())) return value;
  return d.toLocaleDateString();
}

export function currencyPairToSymbol(currency) {
  const map = { USD: "$", EUR: "€", GBP: "£", NGN: "₦", KES: "KSh", GHS: "GH₵", ZAR: "R", XOF: "CFA", XAF: "FCFA" };
  return map[currency] || "";
}

export function formatMoney(amount, currency = "USD") {
  const symbol = currencyPairToSymbol(currency);
  return `${symbol}${(Number(amount) || 0).toLocaleString()}`;
}