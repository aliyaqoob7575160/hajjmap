import { duas as curatedDuas, type Dua } from "@/data/hajj";
import { libraryDuasById, type LibraryDua } from "@/data/duas-library";

export interface ResolvedDua {
  id: string;
  title: string;
  occasion?: string;
  arabic: string;
  transliteration: string;
  translation: string;
  source: string;
  story?: Dua["story"];
  locationMarker?: string | null;
  note?: string | null;
  tags?: string[];
  category?: LibraryDua["category"];
  hajjLocation?: boolean;
}

export function getDua(id: string): ResolvedDua | null {
  const curated = curatedDuas[id];
  if (curated) {
    return {
      id: curated.id,
      title: curated.title,
      occasion: curated.occasion,
      arabic: curated.arabic,
      transliteration: curated.transliteration,
      translation: curated.translation,
      source: curated.source,
      story: curated.story,
    };
  }
  const lib = libraryDuasById[id];
  if (!lib) return null;
  return {
    id: lib.id,
    title: lib.title,
    arabic: lib.arabic,
    transliteration: lib.transliteration,
    translation: lib.translation,
    source: lib.source,
    locationMarker: lib.locationMarker,
    note: lib.note,
    tags: lib.tags,
    category: lib.category,
    hajjLocation: lib.hajjLocation,
  };
}
