"use client";

import * as React from "react";
import { mockClasses, mockTopicMastery, type ClassSummary, type TopicMastery } from "./mock-data";

export type StoredClass = ClassSummary & {
  description: string;
  topics: TopicMastery[];
};

const STORAGE_KEY = "kibo:classes";
const COLORS = ["#7A16CE", "#EB5436", "#16A34A", "#2563EB", "#F59E0B", "#DB2777"];

function seedClasses(): StoredClass[] {
  return mockClasses.map((c) => ({ ...c, description: "", topics: mockTopicMastery }));
}

function readStore(): StoredClass[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return seedClasses();
  try {
    const parsed = JSON.parse(raw) as StoredClass[];
    if (!Array.isArray(parsed) || parsed.length === 0) return seedClasses();
    return parsed;
  } catch {
    return seedClasses();
  }
}

function writeStore(classes: StoredClass[]) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(classes));
}

function generateCode(existing: StoredClass[]) {
  let code = "";
  do {
    const letters = Array.from({ length: 3 }, () => "ABCDEFGHIJKLMNOPQRSTUVWXYZ"[Math.floor(Math.random() * 26)]).join("");
    const numbers = Math.floor(100 + Math.random() * 900);
    code = `${letters}${numbers}`;
  } while (existing.some((c) => c.code === code));
  return code;
}

/**
 * Simulated shared "database" of classes, backed by localStorage.
 * Both the docente flow (create/list classes) and the alumno flow
 * (join by code) read and write through this same store, so a class a
 * teacher creates is immediately joinable by a student with its code.
 */
export function useClassesStore() {
  const [classes, setClasses] = React.useState<StoredClass[]>([]);
  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    const current = readStore();
    writeStore(current);
    setClasses(current);
    setLoaded(true);

    function onStorage(e: StorageEvent) {
      if (e.key === STORAGE_KEY) setClasses(readStore());
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const createClass = React.useCallback((input: { name: string; subject: string; description: string }) => {
    let created!: StoredClass;
    setClasses((prev) => {
      created = {
        id: `${input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString(36)}`,
        name: input.name,
        subject: input.subject,
        description: input.description,
        code: generateCode(prev),
        students: Math.floor(15 + Math.random() * 20),
        average: Math.floor(65 + Math.random() * 25),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        topics: mockTopicMastery,
      };
      const next = [created, ...prev];
      writeStore(next);
      return next;
    });
    return created!;
  }, []);

  const findByCode = React.useCallback(
    (code: string) => classes.find((c) => c.code.toUpperCase() === code.trim().toUpperCase()),
    [classes],
  );

  const findById = React.useCallback((id: string) => classes.find((c) => c.id === id), [classes]);

  return { classes, loaded, createClass, findByCode, findById };
}
