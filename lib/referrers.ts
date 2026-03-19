import { supabaseAdmin } from "@/lib/supabaseServer";
import { generateRefCode } from "@/lib/referral";

export type ReferrerKind = "lead" | "partner" | "agent";

export type EnsureReferrerParams = {
  name: string;
  phone?: string | null;
  email?: string | null;
  kind: ReferrerKind;
  refCode?: string | null;
  referredByRefCode?: string | null;
};

export async function ensureReferrer({
  name,
  phone = null,
  email = null,
  kind,
  refCode,
  referredByRefCode = null,
}: EnsureReferrerParams) {
  const trimmedName = name.trim();
  const finalName = trimmedName || "Unknown";
  const finalRefCode = refCode || generateRefCode();

  const { data, error } = await supabaseAdmin
    .from("Referrers")
    .upsert(
      {
        ref_code: finalRefCode,
        name: finalName,
        phone,
        email,
        kind,
        referred_by_ref_code: referredByRefCode,
      },
      { onConflict: "ref_code" }
    )
    .select()
    .maybeSingle();

  if (error) {
    return { ok: false as const, error: error.message };
  }

  return { ok: true as const, referrer: data, ref_code: finalRefCode };
}
