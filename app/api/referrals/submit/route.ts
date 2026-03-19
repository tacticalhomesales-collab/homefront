import { NextRequest, NextResponse } from "next/server";
import { createSupabaseLead } from "@/lib/leads";

export async function POST(req: NextRequest) {
	try {
		const data = await req.json();
		const {
			friend_name,
			friend_phone,
			friend_email,
			friend_location,
			friend_timeline,
			friend_mission,
			consented_at,
			ref_code,
		} = data;

		if (!friend_name || !friend_phone) {
			return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
		}

		const journey = {
			mission: friend_mission ?? null,
			friend_location: friend_location ?? null,
			friend_timeline: friend_timeline ?? null,
			consented_at: consented_at ?? null,
			source: "refer_consent",
		};

		const result = await createSupabaseLead({
			lead_name: friend_name,
			lead_phone: friend_phone,
			lead_email: friend_email ?? null,
			ref_code: ref_code ?? null,
			journey,
		});

		if (!result.ok) {
			return NextResponse.json({ error: result.error }, { status: 500 });
		}

		return NextResponse.json({ lead: result.lead, success: true });
	} catch (error) {
		return NextResponse.json({ error: "Internal server error" }, { status: 500 });
	}
}

