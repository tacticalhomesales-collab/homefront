import { createSupabaseLead, LeadPayload } from "@/lib/leads";

export async function POST(req: Request) {
	let response: Response;
	try {
		console.log("[Lead API] Incoming POST request");
		const body = (await req.json()) as LeadPayload;
		console.log("[Lead API] Payload:", body);

		const result = await createSupabaseLead({
			lead_name: body.lead_name,
			lead_phone: body.lead_phone,
			lead_email: body.lead_email ?? null,
			ref_code: body.ref_code ?? null,
			journey: body.journey ?? null,
			notes: (body as any).notes ?? null,
		});

		console.log("[Lead API] Supabase response:", result);

		if (!result.ok) {
			console.error("[Lead API] Supabase error:", result.error);
			response = new Response(
				JSON.stringify({ ok: false, error: result.error }),
				{ status: 500, headers: { "Content-Type": "application/json" } }
			);
		} else {
			console.log("[Lead API] Success, lead:", result.lead);
			response = new Response(
				JSON.stringify({ ok: true, lead: result.lead }),
				{ status: 200, headers: { "Content-Type": "application/json" } }
			);
		}
	} catch (err: any) {
		console.error("[Lead API] Exception:", err);
		response = new Response(
			JSON.stringify({ ok: false, error: err?.message || "Unknown error" }),
			{ status: 500, headers: { "Content-Type": "application/json" } }
		);
	}
	return response;
}
