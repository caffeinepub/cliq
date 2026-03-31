import { useEffect, useState } from "react";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
const DELAY_MS = 10_000; // 10 seconds after sign-up

function computeShouldShow(): boolean {
  const completed = localStorage.getItem("cliq_profile_completed_at");
  if (completed) return false;
  const signedUpAt = localStorage.getItem("cliq_signed_up_at");
  if (!signedUpAt) return false;
  if (Date.now() - new Date(signedUpAt).getTime() < DELAY_MS) return false;
  const skipped = localStorage.getItem("cliq_profile_skipped_at");
  if (!skipped) return true;
  return new Date(skipped).getTime() < Date.now() - SEVEN_DAYS_MS;
}

export function useProfileCompletion() {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    // Mark sign-up time if not already set (covers existing sessions too)
    if (!localStorage.getItem("cliq_signed_up_at")) {
      localStorage.setItem("cliq_signed_up_at", new Date().toISOString());
    }

    // Check immediately
    if (computeShouldShow()) {
      setShouldShow(true);
      return;
    }

    // Schedule a check after the 10-second window if we're still within it
    const signedUpAt = localStorage.getItem("cliq_signed_up_at");
    if (signedUpAt) {
      const elapsed = Date.now() - new Date(signedUpAt).getTime();
      const remaining = DELAY_MS - elapsed;
      if (remaining > 0) {
        const timer = setTimeout(() => {
          if (computeShouldShow()) setShouldShow(true);
        }, remaining);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  function markCompleted(department: string, birthday: string) {
    localStorage.setItem("cliq_department", department);
    localStorage.setItem("cliq_birthday", birthday);
    localStorage.setItem("cliq_profile_completed_at", new Date().toISOString());
    setShouldShow(false);
  }

  function markSkipped() {
    localStorage.setItem("cliq_profile_skipped_at", new Date().toISOString());
    setShouldShow(false);
  }

  return { shouldShow, markCompleted, markSkipped };
}
