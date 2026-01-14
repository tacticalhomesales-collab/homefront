"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

type Lead = {
  id: string;
  first_name: string;
  last_name: string;
  phone: string;
  mission: string;
  location: string;
  notes: string;
  consent: boolean;
};

const MISSIONS = ["buy", "sell", "rent", "manage_rental"];

export default function BulkEntryPage() {
  const router = useRouter();

  const [authenticated, setAuthenticated] = useState(false);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Check authentication
    if (typeof window !== "undefined") {
      const isAuth = sessionStorage.getItem("partner_authenticated") === "true";
      if (!isAuth) {
        router.push("/partner/login");
        return;
      }
      setAuthenticated(true);

      // Initialize with 5 empty rows
      setLeads(
        Array.from({ length: 5 }, (_, i) => ({
          id: `lead-${i}`,
          first_name: "",
          last_name: "",
          phone: "",
          mission: "buy",
          location: "",
          notes: "",
          consent: false,
        }))
      );
    }
  }, [router]);

  const updateLead = (id: string, field: keyof Lead, value: string | boolean) => {
    setLeads((prev) =>
      prev.map((lead) => (lead.id === id ? { ...lead, [field]: value } : lead))
    );
  };

  const addRow = () => {
    setLeads((prev) => [
      ...prev,
      {
        id: `lead-${Date.now()}`,
        first_name: "",
        last_name: "",
        phone: "",
        mission: "buy",
        location: "",
        notes: "",
        consent: false,
      },
    ]);
  };

  const removeRow = (id: string) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
  };

  const removeEmptyRows = () => {
    setLeads((prev) =>
      prev.filter((lead) => lead.first_name || lead.last_name || lead.phone)
    );
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const rows = text.split("\n").filter((row) => row.trim());

      const newLeads: Lead[] = rows.map((row, i) => {
        const cols = row.split("\t");
        return {
          id: `lead-paste-${Date.now()}-${i}`,
          first_name: cols[0]?.trim() || "",
          last_name: cols[1]?.trim() || "",
          phone: cols[2]?.trim() || "",
          mission: MISSIONS.includes(cols[3]?.trim().toLowerCase())
            ? cols[3].trim().toLowerCase()
            : "buy",
          location: cols[4]?.trim() || "",
          notes: cols[5]?.trim() || "",
          consent: cols[6]?.trim().toLowerCase() === "yes",
        };
      });

      setLeads((prev) => [...prev, ...newLeads]);
    } catch (err) {
      console.error("Paste failed:", err);
      alert("Failed to paste from clipboard. Please try again.");
    }
  };

  const validateLeads = () => {
    const validLeads = leads.filter(
      (lead) => lead.first_name && lead.last_name && lead.phone && lead.consent
    );
    return validLeads;
  };

  const handleSubmit = async () => {
    const validLeads = validateLeads();

    if (validLeads.length === 0) {
      alert("Please add at least one valid lead with consent.");
      return;
    }

    setSubmitting(true);

    try {
      const partnerId =
        typeof window !== "undefined"
          ? sessionStorage.getItem("partner_id") || "unknown"
          : "unknown";

      const response = await fetch("/api/leads/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          partner_id: partnerId,
          leads: validLeads.map((lead) => ({
            first_name: lead.first_name,
            last_name: lead.last_name,
            phone: lead.phone,
            mission: lead.mission,
            location: lead.location,
            notes: lead.notes,
            consented_at: new Date().toISOString(),
          })),
          submitted_at: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setSuccess(true);
      setTimeout(() => {
        setLeads(
          Array.from({ length: 5 }, (_, i) => ({
            id: `lead-${Date.now()}-${i}`,
            first_name: "",
            last_name: "",
            phone: "",
            mission: "buy",
            location: "",
            notes: "",
            consent: false,
          }))
        );
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error("Bulk submit error:", error);
      alert("Failed to submit leads. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!authenticated) {
    return (
      <main className="min-h-[100dvh] w-full bg-[#0b0f14] text-white flex items-center justify-center">
        <p>Checking authentication...</p>
      </main>
    );
  }

  const validCount = validateLeads().length;

  return (
    <main className="min-h-[100dvh] w-full bg-[#0b0f14] text-white px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold tracking-tight text-white">
            Bulk Lead Entry
          </h1>
          <p className="mt-2 text-sm text-white/70">
            Enter multiple leads at once. Maximum 50 rows.
          </p>
        </div>

        {/* Toolbar */}
        <div className="mb-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={addRow}
            disabled={leads.length >= 50}
            className="px-4 py-2 rounded-lg bg-white/10 border border-white/15 text-white text-sm font-bold
                       hover:bg-white/15 active:scale-[0.99] transition
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            + Add Row
          </button>
          <button
            type="button"
            onClick={handlePaste}
            className="px-4 py-2 rounded-lg bg-white/10 border border-white/15 text-white text-sm font-bold
                       hover:bg-white/15 active:scale-[0.99] transition"
          >
            📋 Paste from Clipboard
          </button>
          <button
            type="button"
            onClick={removeEmptyRows}
            className="px-4 py-2 rounded-lg bg-white/10 border border-white/15 text-white text-sm font-bold
                       hover:bg-white/15 active:scale-[0.99] transition"
          >
            🧹 Remove Empty Rows
          </button>
          <div className="ml-auto flex items-center gap-3">
            <span className="text-sm text-white/70">
              Valid leads: <strong className="text-white">{validCount}</strong>
            </span>
          </div>
        </div>

        {/* Grid */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/15">
                <th className="text-left text-xs font-bold text-white/70 uppercase px-3 py-2">
                  First Name
                </th>
                <th className="text-left text-xs font-bold text-white/70 uppercase px-3 py-2">
                  Last Name
                </th>
                <th className="text-left text-xs font-bold text-white/70 uppercase px-3 py-2">
                  Phone
                </th>
                <th className="text-left text-xs font-bold text-white/70 uppercase px-3 py-2">
                  Mission
                </th>
                <th className="text-left text-xs font-bold text-white/70 uppercase px-3 py-2">
                  Location
                </th>
                <th className="text-left text-xs font-bold text-white/70 uppercase px-3 py-2">
                  Notes
                </th>
                <th className="text-left text-xs font-bold text-white/70 uppercase px-3 py-2">
                  Consent
                </th>
                <th className="w-10"></th>
              </tr>
            </thead>
            <tbody>
              {leads.map((lead, idx) => (
                <tr key={lead.id} className="border-b border-white/5">
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={lead.first_name}
                      onChange={(e) => updateLead(lead.id, "first_name", e.target.value)}
                      placeholder="John"
                      className="w-full px-2 py-1.5 rounded bg-white/10 border border-white/15
                                 text-white text-sm placeholder:text-white/40
                                 focus:outline-none focus:ring-1 focus:ring-[#ff385c]/50"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={lead.last_name}
                      onChange={(e) => updateLead(lead.id, "last_name", e.target.value)}
                      placeholder="Doe"
                      className="w-full px-2 py-1.5 rounded bg-white/10 border border-white/15
                                 text-white text-sm placeholder:text-white/40
                                 focus:outline-none focus:ring-1 focus:ring-[#ff385c]/50"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="tel"
                      value={lead.phone}
                      onChange={(e) => updateLead(lead.id, "phone", e.target.value)}
                      placeholder="(555) 123-4567"
                      className="w-full px-2 py-1.5 rounded bg-white/10 border border-white/15
                                 text-white text-sm placeholder:text-white/40
                                 focus:outline-none focus:ring-1 focus:ring-[#ff385c]/50"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={lead.mission}
                      onChange={(e) => updateLead(lead.id, "mission", e.target.value)}
                      className="w-full px-2 py-1.5 rounded bg-white/10 border border-white/15
                                 text-white text-sm
                                 focus:outline-none focus:ring-1 focus:ring-[#ff385c]/50"
                    >
                      <option value="buy">Buy</option>
                      <option value="sell">Sell</option>
                      <option value="rent">Rent</option>
                      <option value="manage_rental">Manage</option>
                    </select>
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={lead.location}
                      onChange={(e) => updateLead(lead.id, "location", e.target.value)}
                      placeholder="San Diego, CA"
                      className="w-full px-2 py-1.5 rounded bg-white/10 border border-white/15
                                 text-white text-sm placeholder:text-white/40
                                 focus:outline-none focus:ring-1 focus:ring-[#ff385c]/50"
                    />
                  </td>
                  <td className="px-3 py-2">
                    <input
                      type="text"
                      value={lead.notes}
                      onChange={(e) => updateLead(lead.id, "notes", e.target.value)}
                      placeholder="Optional notes"
                      className="w-full px-2 py-1.5 rounded bg-white/10 border border-white/15
                                 text-white text-sm placeholder:text-white/40
                                 focus:outline-none focus:ring-1 focus:ring-[#ff385c]/50"
                    />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <input
                      type="checkbox"
                      checked={lead.consent}
                      onChange={(e) => updateLead(lead.id, "consent", e.target.checked)}
                      className="w-5 h-5 rounded border-white/30 bg-white/10
                                 text-[#ff385c] focus:ring-2 focus:ring-[#ff385c]/50"
                    />
                  </td>
                  <td className="px-3 py-2 text-center">
                    <button
                      type="button"
                      onClick={() => removeRow(lead.id)}
                      className="text-red-400 hover:text-red-300 text-sm font-bold"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Submit */}
        <div className="mt-6 flex items-center gap-4">
          <button
            type="button"
            disabled={validCount === 0 || submitting}
            onClick={handleSubmit}
            className={[
              "px-8 py-4 rounded-2xl text-[21px] font-extrabold transition",
              "focus:outline-none focus-visible:ring-4 focus-visible:ring-[#ff385c]/30",
              "active:scale-[0.99]",
              validCount > 0 && !submitting
                ? "bg-[#ff385c] text-white shadow-[0_10px_30px_rgba(255,56,92,0.25)] cursor-pointer"
                : "bg-white/5 border border-white/10 text-white/40 cursor-not-allowed",
            ].join(" ")}
          >
            {submitting ? "Submitting..." : `Submit ${validCount} Lead${validCount !== 1 ? "s" : ""}`}
          </button>

          {success && (
            <span className="text-green-400 text-sm font-bold">
              ✓ Leads submitted successfully!
            </span>
          )}

          <button
            type="button"
            onClick={() => router.push("/")}
            className="ml-auto px-6 py-3 rounded-xl border border-white/15 bg-white/10
                       text-white text-sm font-bold hover:bg-white/15 transition"
          >
            Back to Home
          </button>
        </div>

        {/* Help text */}
        <p className="mt-4 text-xs text-white/50">
          <strong>Paste format:</strong> First Name, Last Name, Phone, Mission, Location, Notes,
          Consent (tab-separated)
        </p>
      </div>
    </main>
  );
}
