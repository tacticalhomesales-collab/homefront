// TODO: Implement API route to return partner's leads for dashboard.
// Defensive: Do not crash if env vars are missing.

import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// import { getPartnerFromCookie } from "@/lib/auth";

export async function GET() {
  try {
    // TODO: Implement authentication for partner API
    // const partner = await getPartnerFromCookie();
    // if (!partner) return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    const partner = { id: "1" }; // TEMP: Remove after implementing auth

    const leads = await prisma.lead.findMany({
      where: { partnerId: partner.id },
      select: { id: true, name: true, phone: true, status: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ leads });
  } catch (e) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
