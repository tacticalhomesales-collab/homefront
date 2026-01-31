import React from "react";

export function IntentBadge({ intent }: { intent: string }) {
  const colorMap: Record<string, string> = {
    buy: "bg-green-600/90 text-white",
    rent: "bg-blue-600/90 text-white",
    manage: "bg-yellow-500/90 text-black",
    sell: "bg-pink-600/90 text-white",
  };
  const labelMap: Record<string, string> = {
    buy: "Buyer Portal",
    rent: "Renter Portal",
    manage: "Landlord Portal",
    sell: "Seller Portal",
  };
  if (!intent || !labelMap[intent]) return null;
  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold shadow-sm uppercase tracking-wide ${colorMap[intent]} border border-white/20`}
      style={{ letterSpacing: "0.04em" }}
    >
      {labelMap[intent]}
    </span>
  );
}

export function IntentBanner({ intent }: { intent: string }) {
  const colorMap: Record<string, string> = {
    buy: "bg-green-700/80 text-white",
    rent: "bg-blue-700/80 text-white",
    manage: "bg-yellow-600/80 text-black",
    sell: "bg-pink-700/80 text-white",
  };
  const labelMap: Record<string, string> = {
    buy: "Buyer Portal",
    rent: "Renter Portal",
    manage: "Landlord Portal",
    sell: "Seller Portal",
  };
  if (!intent || !labelMap[intent]) return null;
  return (
    <div className={`w-full text-center py-2 mb-3 rounded-lg font-bold text-sm ${colorMap[intent]}`}>{labelMap[intent]}</div>
  );
}

export function IntentIcon({ intent }: { intent: string }) {
  const iconMap: Record<string, JSX.Element> = {
    buy: <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M4 10l4 4 8-8" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
    rent: <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><circle cx="10" cy="10" r="8" stroke="#2563eb" strokeWidth="2"/></svg>,
    manage: <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><rect x="4" y="4" width="12" height="12" rx="3" stroke="#eab308" strokeWidth="2"/></svg>,
    sell: <svg width="20" height="20" fill="none" viewBox="0 0 20 20"><path d="M4 16l12-12M4 4h12v12" stroke="#ec4899" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>,
  };
  if (!intent || !iconMap[intent]) return null;
  return <span className="inline-block align-middle mr-1">{iconMap[intent]}</span>;
}
