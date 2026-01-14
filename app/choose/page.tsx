"use client";

import { useRouter } from "next/navigation";
import FlowLayout from "../_components/FlowLayout";

export default function ChoosePage() {
  const router = useRouter();

  const MainButton = ({ label, onClick }: { label: string; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      className="cursor-pointer pointer-events-auto block w-[calc(100%+2.5rem)] -mx-5 py-4 rounded-2xl
                 border border-white/15 bg-white/10 text-white text-[21px] font-extrabold
                 hover:bg-white/15 active:scale-[0.99] transition
                 focus:outline-none focus-visible:ring-4 focus-visible:ring-white/30"
    >
      {label}
    </button>
  );

  return (
    <FlowLayout title="Choose Your Path" subtitle="Select what best describes you.">
      <div className="relative z-50 flex flex-col gap-3">
        <MainButton
          label="Military Affiliated"
          onClick={() => router.push("/military-status?lane=service&service_track=military")}
        />
        <MainButton
          label="First Responder"
          onClick={() => router.push("/first-responder?lane=service&service_track=fr")}
        />
        <MainButton label="Civilian" onClick={() => router.push("/mission?lane=civ")} />
      </div>
    </FlowLayout>
  );
}
