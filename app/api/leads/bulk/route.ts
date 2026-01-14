import { NextRequest, NextResponse } from "next/server";

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

    // In production, this would:
    // 1. Verify partner_id against authorized partners database
    // 2. Store leads in database with batch_id
    // 3. Send to CRM with partner attribution
    // 4. Queue for automated follow-up
    // 5. Send confirmation email to partner

    const batch = {
      id: `batch_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      partner_id,
      leads: validLeads.map((lead: any, idx: number) => ({
        id: `lead_${Date.now()}_${idx}`,
        first_name: lead.first_name,
        last_name: lead.last_name,
        phone: lead.phone,
        mission: lead.mission || "buy",
        location: lead.location || null,
        notes: lead.notes || null,
        consented_at: lead.consented_at,
      })),
      submitted_at,
      received_at: new Date().toISOString(),
      status: "processing",
      count: validLeads.length,
    };

    // Log for development (replace with actual storage in production)
    console.log(
      `✅ Bulk leads received from partner ${partner_id}:`,
      JSON.stringify(
        {
          batch_id: batch.id,
          count: batch.count,
          partner: partner_id,
        },
        null,
        2
      )
    );

    // Log individual leads (truncated for readability)
    batch.leads.forEach((lead, idx) => {
      console.log(
        `  Lead ${idx + 1}: ${lead.first_name} ${lead.last_name} - ${lead.phone} - ${lead.mission}`
      );
    });

    // TODO: Production implementation
    // - await db.batches.create(batch)
    // - for (const lead of batch.leads) {
    //     await crm.createLead({ ...lead, source: 'partner', partner_id })
    //   }
    // - await email.sendPartnerConfirmation(partner_id, batch.count)
    // - await analytics.track('bulk_leads_submitted', { partner_id, count: batch.count })

    return NextResponse.json(
      {
        success: true,
        batch_id: batch.id,
        leads_processed: batch.count,
        leads_rejected: leads.length - validLeads.length,
        message: `Successfully processed ${batch.count} lead${batch.count !== 1 ? "s" : ""}`,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Bulk leads submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
