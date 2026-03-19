"use client";

import { useRouter, useSearchParams } from "next/navigation";
import AppShell from "../../components/AppShell";

export default function ProgramsOfferPage() {
	const router = useRouter();
	const sp = useSearchParams();

	const navigateWithFallback = (path: string) => {
		const q = new URLSearchParams();
		for (const [k, v] of sp.entries()) q.set(k, v);
		const qs = q.toString();
		const url = qs ? `${path}?${qs}` : path;

		setTimeout(() => {
			try {
				router.push(url);
			} finally {
				setTimeout(() => {
					if (typeof window !== "undefined" && !window.location.pathname.startsWith(path)) {
						window.location.assign(url);
					}
				}, 250);
			}
		}, 120);
	};

	const handleYes = () => {
		navigateWithFallback("/programs-check");
	};

	const handleNo = () => {
		navigateWithFallback("/contact");
	};

	// If this page is reached without a Buy mission, skip it and go to contact.
	const mission = (sp.get("mission") || "").toLowerCase();
	if (typeof window !== "undefined" && mission !== "buy") {
		const q = new URLSearchParams();
		for (const [k, v] of sp.entries()) q.set(k, v);
		const qs = q.toString();
		const url = qs ? `/contact?${qs}` : "/contact";
		// Use replace to avoid keeping this page in history.
		router.replace(url);
		return null;
	}

	return (
		<AppShell>
			<div className="w-full max-w-md relative mx-auto text-left px-4 pt-4 pb-10">
				<h1 className="text-2xl font-extrabold text-white text-center">
					Unlock hidden programs?
				</h1>
				<p className="mt-3 text-sm text-white/80 font-semibold text-center">
					Would you like HomeFront.AI to cross-search for potential grants, benefits,
					and local incentives that might not be obvious from your basic profile?
				</p>
				<p className="mt-2 text-[11px] text-white/60 text-center">
					This is optional and runs a quick program scan using your answers so far.
				</p>

				<div className="mt-6 flex flex-col gap-2">
					<button
						type="button"
						onClick={handleYes}
						className="w-full py-2 rounded-xl bg-[#ff385c] text-white text-[14px] font-extrabold shadow-[0_10px_30px_rgba(255,56,92,0.25)] active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff385c]/40"
					>
						Yes, run a programs scan
					</button>
					<button
						type="button"
						onClick={handleNo}
						className="w-full py-2 rounded-xl bg-white/10 text-white text-[13px] font-extrabold border border-white/15 hover:bg-white/15 active:scale-[0.99] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
					>
						No thanks, continue
					</button>
				</div>

				<p className="mt-4 text-[10px] text-white/50 text-center">
					Not affiliated with any government agency.
				</p>
			</div>
		</AppShell>
	);
}
