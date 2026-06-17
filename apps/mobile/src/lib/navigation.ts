import { router } from "expo-router";
import { useEffect } from "react";
import { useActiveProfile, useAppStore } from "./store";

export function useRequireProfile() {
  const ready = useAppStore((state) => state.ready);
  const profile = useActiveProfile();

  useEffect(() => {
    if (ready && !profile) {
      router.replace("/profiles");
    }
  }, [profile, ready]);

  return profile;
}

