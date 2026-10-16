import type { Metadata } from "next";
import AdContact from "../AdContact";

export const metadata: Metadata = {
  title: "Talk or Text With a HomeFront Realtor | North County San Diego",
  description:
    "Connect directly with HomeFront's veteran-led real estate team in North County San Diego. Call or text a Realtor.",
  robots: { index: false, follow: false },
};

export default function RealtorContactPage() {
  return <AdContact />;
}
