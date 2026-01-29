
"use client";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function MissionPage() {
  const router = useRouter();
  const sp = useSearchParams();

  useEffect(() => {
    const mission = sp.get("mission");
    const q = new URLSearchParams();
    for (const [k, v] of sp.entries()) {
      if (k !== "mission") q.set(k, v);
    }
    let next = "/location";
    if (mission === "sell") next = "/sell-property";
    else if (mission === "manage_rental") next = "/rental-property";
    // Always pass mission param
    router.replace(`${next}?mission=${mission || "buy"}&${q.toString()}`);
  }, [router, sp]);
  return null;
}
