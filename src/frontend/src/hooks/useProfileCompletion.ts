import { useEffect, useState } from "react";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function computeShouldShow(): boolean {
  const completed = localStorage.getItem("cliq_profile_completed_at");
  if (completed) return false;
  const hasPosted = localStorage.getItem("cliq_has_posted") === "true";
  if (!hasPosted) return false;
  const skipped = localStorage.getItem("cliq_profile_skipped_at");
  if (!skipped) return true;
  return new Date(skipped).getTime() < Date.now() - SEVEN_DAYS_MS;
}

export function useProfileCompletion() {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    setShouldShow(computeShouldShow());
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
