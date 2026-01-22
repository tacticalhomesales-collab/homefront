
"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import dynamic from "next/dynamic";

const ShareSheetModal = dynamic(() => import("./_components/ShareSheetModal"), { ssr: false });

// Mission logic for Buy/Sell/Rent/Manage row
const MISSION_CHOICES = [
	{ label: "Buy", value: "buy" },
	{ label: "Sell", value: "sell" },
	{ label: "Rent", value: "rent" },
	{ label: "Manage", value: "manage_rental" },
];
export default function LandingPage() {
	const router = useRouter();
	const [showToast, setShowToast] = useState(false);
	const [showShareModal, setShowShareModal] = useState(false);

	// Open share modal
	const handleShare = () => setShowShareModal(true);

	// Read More dropdown for mission/value statement
	const [showMore, setShowMore] = useState(false);

	// Mission row selection state
	const [activeMission, setActiveMission] = useState<string | null>(null);
	const [pressedMission, setPressedMission] = useState(false);

	// Read More section selection state
	const [selectedSection, setSelectedSection] = useState<string | null>(null);

	// Mission navigation logic (same as mission page)
	const handleMissionClick = (choice: { label: string; value: string }) => {
		if (pressedMission) return;
		setActiveMission(choice.value);
		setPressedMission(true);
		// Build next URL logic
		const q = new URLSearchParams();
		q.set("mission", choice.value);
		let nextUrl = "";
		if (choice.value === "sell") {
			nextUrl = `/sell-property?${q.toString()}`;
		} else if (choice.value === "manage_rental") {
			nextUrl = `/rental-property?${q.toString()}`;
		} else {
			nextUrl = `/location?${q.toString()}`;
		}
		setTimeout(() => router.push(nextUrl), 120);
	};

	return (
		<main className="min-h-[100dvh] w-full bg-[#0b0f14] text-white px-4">
			<div className="min-h-[100dvh] flex flex-col items-center text-center pt-8 pb-10">
				<div className="w-full max-w-md relative">
					{/* Logo (maximum size, responsive) - now above mission row */}
					<div className="mx-auto w-full max-w-[98vw] sm:max-w-[900px] mt-2 mb-2 pointer-events-none select-none">
						<img
							src="/homefront-logo.png"
							alt="HomeFront"
							className="w-full h-auto"
							style={{ maxWidth: '900px', maxHeight: '650px', objectFit: 'contain' }}
							draggable={false}
						/>
					</div>

					{/* Buy • Sell • Rent • Manage row (smaller, clickable, red highlight on select) */}
					<div className="mb-2 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-[13px] font-bold tracking-[-0.01em] text-gray-400 select-none">
						{MISSION_CHOICES.map((c, i) => (
							<span key={c.value}>
								<button
									type="button"
									disabled={pressedMission}
									onClick={() => handleMissionClick(c)}
									className={[
										"px-1.5 py-0.5 rounded transition font-bold",
										activeMission === c.value
											? "bg-[#ff385c] text-white"
											: "hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#ff385c]/40 text-gray-400",
									].join(" ")}
									style={{ minWidth: 36 }}
								>
									{c.label}
								</button>
								{i < MISSION_CHOICES.length - 1 && <span className="mx-0.5">•</span>}
							</span>
						))}
					</div>

					{/* Title removed as requested */}

					{/* Mission/Value Statement with Read More (brand-specific, neutral) - heading and bold writing removed */}
					<div className="mt-6 mb-2 bg-white/5 rounded-xl p-5 text-left text-white/90 shadow-lg max-w-xl mx-auto">
						<p className="mb-3 text-base text-white">
							Empowering you to make smart, confident moves in real estate—whether you’re buying, selling, renting, or managing a home.
						</p>
						<button
							onClick={() => setShowMore((v) => !v)}
							className="text-sm text-white underline focus:outline-none mb-2 font-semibold"
						>
							{showMore ? "Hide details" : "Read more"}
						</button>
						{showMore && (
							<div className="space-y-3">
								<p className="text-base text-white/90">
									We’re not just a platform—we’re your partner. HomeFront is built by real estate and finance experts who believe in transparency, education, and putting your needs first. No sales pressure. No jargon. Just honest, actionable guidance for every step of your journey.
								</p>
								<div className="flex flex-wrap gap-2 mb-2">
									{[
										{ key: "Clarity", desc: "We break down the process so you always know what’s next." },
										{ key: "Smart Guidance", desc: "Get matched with the right experts and resources for your goals." },
										{ key: "Trust", desc: "Your privacy and best interests come first—always." },
										{ key: "Empowerment", desc: "We give you the tools and knowledge to make confident decisions." },
									].map((s) => (
										<button
											key={s.key}
											type="button"
											onClick={() => setSelectedSection(s.key)}
											className={[
												"px-3 py-2 rounded-xl font-bold border transition text-sm",
												selectedSection === s.key
													? "bg-[#ff385c] text-white border-[#ff385c]"
													: "bg-white/10 text-white border-white/15 hover:bg-white/20",
												].join(" ")}
											style={{ minWidth: 120 }}
										>
											{s.key}
										</button>
									))}
								</div>
								<div className="text-white/90 min-h-[32px] text-sm font-medium">
									{selectedSection
										? ([
											{ key: "Clarity", desc: "We break down the process so you always know what’s next." },
											{ key: "Smart Guidance", desc: "Get matched with the right experts and resources for your goals." },
											{ key: "Trust", desc: "Your privacy and best interests come first—always." },
											{ key: "Empowerment", desc: "We give you the tools and knowledge to make confident decisions." },
										].find((s) => s.key === selectedSection)?.desc || ""
										) : ""}
								</div>
								<ul className="list-none pl-0 text-white/80 space-y-1">
									<li>Simple, up-to-date guides and workshops for every stage.</li>
									<li>Connect with real people, not just algorithms.</li>
									<li>Decades of hands-on expertise, shared for your benefit.</li>
								</ul>
							</div>
						)}
					</div>
					{/* Main CTA Button */}
					<div className="mt-2 relative z-50 flex flex-col gap-3">
						<button
							type="button"
							onClick={() => router.push("/choose")}
							className="cursor-pointer pointer-events-auto block w-[calc(100%+2.5rem)] -mx-5 py-4 rounded-2xl border border-white/15 bg-white/10 text-white text-[21px] font-extrabold hover:bg-white/15 active:scale-[0.99] transition shadow-[0_10px_30px_rgba(255,56,92,0.15)] focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
						>
							Get Started
						</button>
						<div className="mt-6 flex flex-row items-center justify-center gap-8">
							<button
								onClick={handleShare}
								className="text-[15px] text-white font-extrabold px-4 py-2 rounded-xl hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 transition cursor-pointer"
								style={{ lineHeight: "1.2" }}
								type="button"
							>
								Share
							</button>
							<ShareSheetModal isOpen={showShareModal} onClose={() => setShowShareModal(false)} />
							<button
								onClick={() => router.push("/refer")}
								className="text-[15px] text-white font-extrabold px-4 py-2 rounded-xl hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 transition cursor-pointer"
								style={{ lineHeight: "1.2" }}
								type="button"
							>
								Refer a Friend
							</button>
							<button
								onClick={() => router.push("/partner")}
								className="text-[15px] text-white font-extrabold px-4 py-2 rounded-xl hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-white/40 transition cursor-pointer"
								style={{ lineHeight: "1.2" }}
								type="button"
							>
								Partner Portal
							</button>
						</div>
					</div>
				</div>
			</div>
			{/* Toast for link copied */}
			{showToast && (
				<div className="fixed left-1/2 bottom-16 -translate-x-1/2 bg-[#222] text-white text-[14px] px-4 py-2 rounded-xl shadow-lg z-50 transition-all">
					Link copied ✅
				</div>
			)}
		</main>
	);
}
