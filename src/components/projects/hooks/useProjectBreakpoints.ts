"use client";

import { useEffect, useState } from "react";

export function useProjectBreakpoints() {
  const [flags, setFlags] = useState({
    isPhone: false,
    isTablet: false,
    isDesktop: true,
  });

  useEffect(() => {
    const mqPhone = window.matchMedia("(max-width: 640px)");
    const mqTablet = window.matchMedia("(max-width: 1100px)");

    const update = () =>
      setFlags({
        isPhone: mqPhone.matches,
        isTablet: !mqPhone.matches && mqTablet.matches,
        isDesktop: !mqTablet.matches,
      });

    update();

    mqPhone.addEventListener?.("change", update) ?? mqPhone.addListener(update);
    mqTablet.addEventListener?.("change", update) ?? mqTablet.addListener(update);

    return () => {
      mqPhone.removeEventListener?.("change", update) ?? mqPhone.removeListener(update);
      mqTablet.removeEventListener?.("change", update) ?? mqTablet.removeListener(update);
    };
  }, []);

  return flags;
}