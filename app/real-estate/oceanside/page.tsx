import type { Metadata } from "next";
import Link from "next/link";
export const metadata: Metadata = {
 title: "Oceanside Real Estate Agent | HomeFront Buyer & Seller Guidance",
 description: "HomeFront's veteran-led real estate team helps buyers and sellers in Oceanside, CA, including military households planning a move near Camp Pendleton.",
 alternates: { canonical: "/real-estate/oceanside" },
};
export default function OceansidePage() {
 return <main style={{maxWidth:760,margin:"0 auto",padding:"3rem 1.25rem",fontFamily:"system-ui",lineHeight:1.6}}>
  <h1>Oceanside Real Estate: Buy or Sell with Local Guidance</h1>
  <p>HomeFront helps clients navigate Oceanside home purchases, sales and military relocations. Our veteran-led team understands that timing, property condition and financing can change the right strategy.</p>
  <h2>Selling in Oceanside</h2><p>Preparing to list? We can discuss comparable sales, estimated selling costs, repairs, presentation and a practical listing timeline.</p>
  <h2>Buying near Camp Pendleton</h2><p>We help buyers assess neighborhoods, commute considerations, HOA costs, inspections and offer terms without treating every property as a fit.</p>
  <h2>Questions about a VA loan?</h2><p>Learn about <Link href="/va-homebuying-north-county">using VA financing in North County</Link>. Loan eligibility and approval are determined by the VA and participating lenders.</p>
  <p><Link href="/contact?source=seo_oceanside">Contact HomeFront for a no-obligation consultation</Link></p>
 </main>;
}