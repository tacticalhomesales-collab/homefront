import { NextRequest, NextResponse } from "next/server";
import { createSupabaseLead } from "@/lib/leads";

export async function POST(request: NextRequest) {
	try {
		const body = await request.json();

		const { partner_id, leads, submitted_at } = body;

		// Validate required fields
		if (!partner_id || !Array.isArray(leads) || leads.length === 0) {
			return NextResponse.json(
				{ error: "Missing required fields or empty leads array" },
				{ status: 400 }
			);
		}

		// Validate lead limit
		if (leads.length > 50) {
			return NextResponse.json(
				{ error: "Maximum 50 leads per submission" },
				{ status: 400 }
			);
		}

		// Validate each lead
		const validLeads = leads.filter(
			(lead: any) =>
				lead.first_name &&
				lead.last_name &&
				lead.phone &&
				lead.consented_at
		);

		if (validLeads.length === 0) {
			return NextResponse.json(
				{ error: "No valid leads found" },
				{ status: 400 }
			);
		}

		let processed = 0;
		const errors: string[] = [];

		for (const lead of validLeads) {
			const fullName = `${lead.first_name} ${lead.last_name}`.trim();
			const journey = {
				source: "partner_bulk",
				mission: lead.mission || "buy",
				location: lead.location || null,
				notes: lead.notes || null,
				consented_at: lead.consented_at,
				partner_id,
				submitted_at,
			};

			const result = await createSupabaseLead({
				lead_name: fullName,
				lead_phone: lead.phone,
				lead_email: null,
				ref_code: null,
				journey,
			});

			if (result.ok) {
				processed += 1;
			} else {
				errors.push(result.error);
			}
		}

		return NextResponse.json(
			{
				success: errors.length === 0,
				leads_processed: processed,
				leads_rejected: leads.length - processed,
				errors: errors.length ? errors : undefined,
			},
			{ status: errors.length ? 207 : 200 }
		);
	} catch (error) {
		console.error("❌ Bulk leads submission error:", error);
		return NextResponse.json(
			{ error: "Internal server error" },
			{ status: 500 }
		);
	}
}
