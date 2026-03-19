"use client";

import { useState } from "react";

export default function LeadTestPage() {
	const [loading, setLoading] = useState(false);
	const [result, setResult] = useState<string | null>(null);
	const [error, setError] = useState<string | null>(null);

	const sendTestLead = async () => {
		if (loading) return;
		setLoading(true);
		setResult(null);
		setError(null);

		try {
			const payload = {
				lead_name: "Test Lead (Admin)",
				lead_phone: "5550000000",
				lead_email: "test+admin@homefront.app",
				ref_code: "TEST-ADMIN",
				journey: {
					source: "admin_test",
					note: "Single test lead created from /admin/lead-test page",
				},
			};

			const res = await fetch("/api/lead", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(payload),
			});

			const json = await res.json();

			if (!res.ok || !json.ok) {
				setError(json.error || "Unknown error");
			} else {
				setResult(JSON.stringify(json.lead ?? json, null, 2));
			}
		} catch (e: any) {
			setError(e?.message || "Request failed");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-black text-white">
			<div className="w-full max-w-lg px-6 py-8 rounded-2xl bg-white/5 border border-white/10">
				<h1 className="text-2xl font-extrabold mb-4">Lead Test (Supabase)</h1>
				<p className="text-sm text-white/70 mb-4">
					This sends a single test lead through the regular <code>/api/lead</code> route into Supabase.
				</p>
				<button
					onClick={sendTestLead}
					disabled={loading}
					className={[
						"w-full py-3 rounded-xl text-base font-extrabold transition active:scale-[0.99]",
						loading
							? "bg-white/10 border border-white/15 text-white/40 cursor-not-allowed"
							: "bg-[#ff385c] text-white shadow-[0_10px_30px_rgba(255,56,92,0.25)]",
					].join(" ")}
				>
					{loading ? "Sending test lead..." : "Send test lead to Supabase"}
				</button>
				{error && (
					<div className="mt-4 text-sm text-red-400 break-words whitespace-pre-wrap">
						Error: {error}
					</div>
				)}
				{result && (
					<pre className="mt-4 text-xs bg-black/60 rounded-xl p-3 max-h-64 overflow-auto whitespace-pre-wrap">
						{result}
					</pre>
				)}
			</div>
		</div>
	);
}
