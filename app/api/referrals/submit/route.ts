import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      friend_name,
      friend_phone,
      friend_email,
      friend_location,
      friend_timeline,
      friend_mission,
      referrer_name,
      referrer_phone,
      referrer_email,
      consented_at,
    } = body;

    // Validate required fields
    if (!friend_name || !friend_phone || !referrer_name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // In production, this would:
    // 1. Store in database
    // 2. Send to CRM (e.g., Salesforce, HubSpot)
    // 3. Trigger email/SMS notifications
    // 4. Queue for follow-up

    const referral = {
      id: `ref_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      friend: {
        name: friend_name,
        phone: friend_phone,
        email: friend_email || null,
        location: friend_location || null,
        timeline: friend_timeline || null,
        mission: friend_mission || null,
      },
      referrer: {
        name: referrer_name,
        phone: referrer_phone || null,
        email: referrer_email || null,
      },
      consented_at,
      received_at: new Date().toISOString(),
      status: "pending",
    };

    // Log for development (replace with actual storage in production)
    console.log("✅ Referral received:", JSON.stringify(referral, null, 2));

    // TODO: Production implementation
    // - await db.referrals.create(referral)
    // - await crm.createLead(referral.friend)
    // - await email.sendConfirmation(referral.referrer.email)
    // - await sms.sendThankYou(referral.referrer.phone)

    return NextResponse.json(
      {
        success: true,
        referral_id: referral.id,
        message: "Referral received successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Referral submission error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
