import { NextRequest, NextResponse } from "next/server";
import { ensureReferrer, ReferrerKind } from "@/lib/referrers";

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const {
      type,
      firstName,
      lastName,
      email,
      phone,
      licenseState,
      licenseNumber,
      brokerageName,
      confirmLicensed,
      refCode,
    } = data;

    // Basic required fields for all partner types
    if (!type || !firstName || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Additional required fields for realtor partners only
    if (
      type === "realtor" &&
      (!lastName || !licenseState || !licenseNumber || !brokerageName || !confirmLicensed)
    ) {
      return NextResponse.json({ error: "Missing realtor fields" }, { status: 400 });
    }

    const name = firstName + (lastName ? ` ${lastName}` : "");

    const kind: ReferrerKind = type === "realtor" ? "agent" : "partner";

    const result = await ensureReferrer({
      name,
      phone,
      email: email || null,
      kind,
      refCode: refCode || null,
    });

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json({ referrer: result.referrer, ref_code: result.ref_code });
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
