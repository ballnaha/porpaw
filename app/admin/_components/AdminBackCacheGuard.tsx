"use client";

import { useEffect } from "react";

export function AdminBackCacheGuard() {
  useEffect(() => {
    const refreshIfRestored = (event: PageTransitionEvent) => {
      if (event.persisted) window.location.reload();
    };

    window.addEventListener("pageshow", refreshIfRestored);

    return () => window.removeEventListener("pageshow", refreshIfRestored);
  }, []);

  return null;
}
