import { supabaseAdmin } from "@/lib/supabaseServer";

export default async function AdminPage() {
  // Partners are now stored in the Referrers/Partners view instead of partner_leads.
  const { data: partners, error: partnerError } = await supabaseAdmin
    .from("Partners")
    .select("id, name, email, phone, ref_code, referred_by_ref_code, created_at")
    .order("created_at", { ascending: false });

  if (partnerError) {
    return <div className="p-4 text-red-600">Error loading partners: {partnerError.message}</div>;
  }

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Admin Portal: Partners</h1>
      {(!partners || partners.length === 0) && <div>No partners found.</div>}
      {partners && partners.map((partner: any) => (
        <div key={partner.id} className="mb-8 border-b pb-4">
          <div className="font-semibold text-lg flex items-center gap-2">
            <span>{partner.name}</span>
            {partner.ref_code && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-700 border border-gray-300">
                Code: {partner.ref_code}
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500">{partner.email} | {partner.phone}</div>
          {partner.referred_by_ref_code && (
            <div className="text-xs text-gray-400 mt-1">Referred by: {partner.referred_by_ref_code}</div>
          )}
        </div>
      ))}
    </div>
  );
}
