"use client";

import * as React from "react";
import type { MascotEyes, MascotHat } from "@/components/kibo/mascot";

export type StudentProfile = {
  classCode: string;
  classId: string;
  className: string;
  classSubject: string;
  name: string;
  color: string;
  eyes: MascotEyes;
  hat: MascotHat;
  glasses: boolean;
  backpack: boolean;
};

export const DEFAULT_PROFILE: StudentProfile = {
  classCode: "",
  classId: "",
  className: "",
  classSubject: "",
  name: "Kibo",
  color: "#7A16CE",
  eyes: "happy",
  hat: "none",
  glasses: false,
  backpack: false,
};

const STORAGE_KEY = "kibo:student-profile";

export function useStudentProfile() {
  const [profile, setProfile] = React.useState<StudentProfile>(DEFAULT_PROFILE);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        setProfile({ ...DEFAULT_PROFILE, ...JSON.parse(raw) });
      } catch {
        // ignore malformed local data
      }
    }
    setLoaded(true);
  }, []);

  const update = React.useCallback((patch: Partial<StudentProfile>) => {
    setProfile((prev) => {
      const next = { ...prev, ...patch };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { profile, update, loaded };
}
