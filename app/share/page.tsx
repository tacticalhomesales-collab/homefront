"use client";

import dynamic from "next/dynamic";
import AppShell from "../../components/AppShell";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ShareSheetModal = dynamic(() => import("../_components/ShareSheetModal"), { ssr: false });

export default function SharePage() {
  const [open, setOpen] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!open) {
      router.replace("/");
    }
  }, [open, router]);

  return (
    <AppShell>
      <ShareSheetModal isOpen={open} onClose={() => setOpen(false)} />
    </AppShell>
  );
}
