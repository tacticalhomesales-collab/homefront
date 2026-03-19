"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const MISSIONS = [
  { label: "Buy", value: "buy" },
  { label: "Sell", value: "sell" },
  { label: "Rent", value: "rent" },
  { label: "Manage Rental", value: "manage_rental" },
];

export default function BulkReferralForm() {
  const router = useRouter();
  const [rows, setRows] = useState([
    { name: "", phone: "", mission: "" },
  ]);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (idx: number, field: string, value: string) => {
    setRows((prev) => prev.map((row, i) => i === idx ? { ...row, [field]: value } : row));
  };

  const handleAddRow = () => {
    setRows((prev) => [...prev, { name: "", phone: "", mission: "" }]);
  };

  const handleRemoveRow = (idx: number) => {
    setRows((prev) => prev.filter((_, i) => i !== idx));
  };

  const canSubmit = rows.every(r => r.name.trim() && r.phone.trim() && r.mission);

  const handleSubmit = async () => {
    if (!canSubmit || submitting) return;
    setSubmitting(true);
    try {
      const partnerId =
        typeof window !== "undefined"
          ? window.sessionStorage.getItem("partner_id") || "referral_bulk"
          : "referral_bulk";

      const leads = rows.map((row) => {
        const trimmedName = row.name.trim();
        const [first, ...rest] = trimmedName.split(/\s+/);
        const first_name = first || "Friend";
        const last_name = rest.join(" ") || "Referral";

        return {
          first_name,
          last_name,
          phone: row.phone.trim(),
          mission: row.mission,
          location: null,
          notes: null,
          consented_at: new Date().toISOString(),
        };
      });

      const response = await fetch("/api/leads/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partner_id: partnerId,
          leads,
          submitted_at: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      // After successful bulk referral submission, show the same
      // thank-you experience as single referrals.
      router.push("/refer-confirmation");
    } catch (error) {
      console.error("Bulk referral submission error:", error);
      alert("Failed to submit referrals. Please try again.");
      setSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="overflow-x-auto">
        <table className="min-w-full text-white text-sm">
          <thead>
            <tr>
              <th className="px-2 py-2 text-left">Name</th>
              <th className="px-2 py-2 text-left">Phone</th>
              <th className="px-2 py-2 text-left">Mission</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                <td className="px-2 py-1">
                  <input
                    type="text"
                    className="w-full px-2 py-1 rounded bg-white/10 border border-white/15 text-white"
                    placeholder="Name"
                    value={row.name}
                    onChange={e => handleChange(idx, "name", e.target.value)}
                  />
                </td>
                <td className="px-2 py-1">
                  <input
                    type="tel"
                    className="w-full px-2 py-1 rounded bg-white/10 border border-white/15 text-white"
                    placeholder="Phone"
                    value={row.phone}
                    onChange={e => handleChange(idx, "phone", e.target.value)}
                  />
                </td>
                <td className="px-2 py-1">
                  <select
                    className="w-full px-2 py-1 rounded bg-black border border-white/20 text-white"
                    value={row.mission}
                    onChange={e => handleChange(idx, "mission", e.target.value)}
                  >
                    <option value="">Select</option>
                    {MISSIONS.map(m => (
                      <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                  </select>
                </td>
                <td className="px-2 py-1">
                  {rows.length > 1 && (
                    <button
                      type="button"
                      className="text-xs text-red-400 hover:underline"
                      onClick={() => handleRemoveRow(idx)}
                    >
                      Remove
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-2">
        <button
          type="button"
          className="px-4 py-2 rounded-xl bg-white/10 border border-white/15 text-white font-bold hover:bg-white/15 transition"
          onClick={handleAddRow}
        >
          Add Another
        </button>
        <button
          type="button"
          className="px-4 py-2 rounded-xl bg-[#ff385c] text-white font-bold shadow hover:bg-[#ff385c]/90 transition"
          disabled={!canSubmit || submitting}
          onClick={handleSubmit}
        >
          {submitting ? "Submitting..." : "Submit All"}
        </button>
      </div>
    </div>
  );
}
