
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { supabaseAdmin } from "@/lib/supabaseServer";

export async function GET() {
  // Check env vars
  const env = {
    url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    anon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    service: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  };

  // Check DB connection (simple query)
  let db = { ok: false, error: undefined };
  let supabase: { ok: boolean; error: string | undefined } = { ok: false, error: undefined };
  try {
    await prisma.$queryRaw`SELECT 1`;
    db.ok = true;
  } catch (error: any) {
    db.ok = false;
    db.error = error.message || String(error);
  }

  try {
    const { error } = await supabaseAdmin.from("Leads").select("id").limit(1);
    if (!error) {
      supabase.ok = true;
    } else {
      supabase.ok = false;
      supabase.error = error?.message ? String(error.message) : undefined;
    }
  } catch (error: any) {
    supabase.ok = false;
    supabase.error = error.message || String(error);
  }

  return NextResponse.json({ ok: true, env, db, supabase });
}
