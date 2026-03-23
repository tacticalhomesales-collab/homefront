
import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";
import { supabaseAdmin } from "@/lib/supabaseServer";

type ServiceCheck = {
  ok: boolean;
  error?: string;
  skipped?: boolean;
};

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  return String(error);
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const shouldProbeConnections = searchParams.get("probe") === "1";

  // Check env vars
  const env = {
    url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    anon: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    service: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  };

  const db: ServiceCheck = { ok: false, skipped: !shouldProbeConnections };
  const supabase: ServiceCheck = { ok: false, skipped: !shouldProbeConnections };

  if (shouldProbeConnections) {
    try {
      await prisma.$queryRaw`SELECT 1`;
      db.ok = true;
      db.skipped = false;
    } catch (error: unknown) {
      db.ok = false;
      db.skipped = false;
      db.error = getErrorMessage(error);
    }

    try {
      const { error } = await supabaseAdmin.from("Leads").select("id").limit(1);
      if (!error) {
        supabase.ok = true;
        supabase.skipped = false;
      } else {
        supabase.ok = false;
        supabase.skipped = false;
        supabase.error = error.message ? String(error.message) : undefined;
      }
    } catch (error: unknown) {
      supabase.ok = false;
      supabase.skipped = false;
      supabase.error = getErrorMessage(error);
    }
  }

  return NextResponse.json({ ok: true, env, db, supabase });
}
