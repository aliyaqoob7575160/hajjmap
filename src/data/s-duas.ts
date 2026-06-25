// S Duas — curated supplications grouped by daily use.
//
// IMPORTANT (religious accuracy): only add entries here when you have the
// EXACT verified Arabic + transliteration + translation + source. Never
// paste OCR'd / screenshot-extracted text — it is almost always corrupted.
//
// To add an entry, copy the shape below and fill every field. Leave the
// array empty until you have verified text.

export type SDuaCategory =
  | "english"
  | "kids"
  | "general"
  | "morning_evening"
  | "night"
  | "tahajjud"
  | "walk"
  | "zikar";

export interface SDua {
  id: string; // e.g. "SD1"
  category: SDuaCategory;
  title: string;
  arabic: string | null;
  transliteration: string | null;
  translation: string | null;
  source: string | null;
  note?: string;
}

export const sDuaCategoryLabels: Record<SDuaCategory, string> = {
  english: "Dua for English",
  kids: "For Kids",
  general: "General Duas",
  morning_evening: "Morning & Evening",
  night: "Night Routine",
  tahajjud: "Tahajjud",
  walk: "While Walking",
  zikar: "Zikar",
};

export const sDuaCategoryOrder: SDuaCategory[] = [
  "morning_evening",
  "night",
  "tahajjud",
  "zikar",
  "walk",
  "kids",
  "english",
  "general",
];

// Add verified entries here. Example shape (commented out):
// {
//   id: "SD1",
//   category: "morning_evening",
//   title: "Sayyid al-Istighfar",
//   arabic: "...",
//   transliteration: "...",
//   translation: "...",
//   source: "Sahih al-Bukhari 6306",
// },
export const sDuas: SDua[] = [];

export const sDuasByCategory: Record<SDuaCategory, SDua[]> = sDuaCategoryOrder.reduce(
  (acc, cat) => {
    acc[cat] = sDuas.filter((d) => d.category === cat);
    return acc;
  },
  {} as Record<SDuaCategory, SDua[]>,
);
