"use client";

import { useEffect, useRef, useState } from "react";
import type { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import type { StepStage } from "./LoadingApprovedOverlay";

type Timers = {
  flash?: number;
  loading?: number;
  approved?: number;
  nav?: number;
  fallback?: number;
};

export function useStepNav() {
  const [stage, setStage] = useState<StepStage>("idle");
  const [locked, setLocked] = useState(false);

  const timers = useRef<Timers>({});
  const nextUrlRef = useRef<string>("");
  const nextPathRef = useRef<string>("");

  const clearAll = () => {
    const t = timers.current;
    Object.values(t).forEach((id) => {
      if (id) window.clearTimeout(id);
    });
    timers.current = {};
  };

  useEffect(() => clearAll, []);

  const start = (router: AppRouterInstance, nextUrl: string, nextPath: string) => {
    if (locked || stage !== "idle") return;

    setLocked(true);
    nextUrlRef.current = nextUrl;
    nextPathRef.current = nextPath;

    // 1) brief flash so the chosen button can turn red
    timers.current.flash = window.setTimeout(() => {
      setStage("loading");
    }, 140);

    // 2) show approved
    timers.current.approved = window.setTimeout(() => {
      setStage("approved");
    }, 650);

    // 3) navigate
    timers.current.nav = window.setTimeout(() => {
      try {
        router.push(nextUrl);
      } finally {
        // hard fallback if we didn't land where expected
        timers.current.fallback = window.setTimeout(() => {
          if (typeof window === "undefined") return;
          if (window.location.pathname !== nextPathRef.current) {
            window.location.assign(nextUrlRef.current);
          }
        }, 250);
      }
    }, 900);
  };

  return { stage, locked, start };
}
