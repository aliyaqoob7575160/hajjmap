# Prompt — Build the Mobile App version of "Labbayk"

Paste everything below this line into the other AI.

---

Build a **native mobile app** called **Labbayk** ("Here I am") — a reverent, offline-first **Hajj & Umrah companion**. It walks a pilgrim through every day of Hajj on an interactive map of Makkah, with a per-day timeline and the duʿās for each moment — Arabic, transliteration, English translation, and the story behind each one. There is an existing web version (React + TanStack Router + Tailwind + shadcn/ui + framer-motion + react-zoom-pan-pinch); this app is a faithful mobile port, not a redesign.

## Stack

- **React Native + Expo (SDK 51+)** with **expo-router** (file-based routing, mirrors the web).
- **TypeScript strict**, **NativeWind** (Tailwind for RN) so the existing design tokens port over.
- **react-native-reanimated v3** + **react-native-gesture-handler** for motion (replaces framer-motion).
- **react-native-svg** + **react-native-maps** (Apple Maps on iOS, Google Maps on Android) — the boundary polygons, landmark pins, and animated route lines render as map overlays. Keep a stylized look (custom map style JSON, muted desert palette).
- **expo-location** for live "you are here" + distance-to-site.
- **expo-haptics** for gentle taps on day change and dua open.
- **@shopify/flash-list** for the timeline.
- **MMKV** (react-native-mmkv) for tiny persisted state (selected day, theme, camp pin).
- No backend. All content is **static typed data** bundled with the app. English only in v1.

## Design system (port these tokens exactly)

Calm, reverent, premium — desert + Kiswah black-and-gold.

- **Light:** bg `#FBF7EF`, surface `#FFFFFF`, ink `#1C1B1A`, primary emerald `#0B6E4F` (deep `#064E3B`), gold `#C9A227`, muted `#8A8170`.
- **Dark ("night of Muzdalifah"):** bg `#0D1B2A`, surface `#13263B`, ink `#F2EEE3`, primary `#3FB28A`, gold `#E3C766`.
- **Fonts:** UI = **Plus Jakarta Sans**; Arabic = **Amiri**, large, `writingDirection: "rtl"`, generous line-height.
- Subtle 8-point-star / arabesque background pattern, used sparingly. Generous whitespace, soft shadows, rounded corners (16–24).
- Honour `AccessibilityInfo.isReduceMotionEnabled()` — fade instead of animating zoom/pan.

## Screens & navigation

Single primary stack — the app is essentially one rich screen with sheets:

1. **Home / Journey** (`app/index.tsx`)
   - Sticky header: app name "Labbayk", journey toggle (**Hajj** | **Umrah**), day selector pill row (**Before Hajj/Umrah, 8, 9, 10, 11, 12, 13 Dhul-Hijjah**), dark-mode toggle.
   - Day 9 has sub-phase chips: `Full Day | 9.1 Arafat Journey | 9.2 Muzdalifah Journey`.
   - Day 13 has sub-phase chips: `Full Day | 13.1 Final Stoning at Mina | 13.2 Tawaf al-Wada`.
   - **Map hero** (~55% of screen height): a real map of Makkah/Mina/Muzdalifah/Arafat with:
     - Four tappable site pins: **Al-Masjid al-Haram, Mina, Muzdalifah, Arafat**.
     - Approximate ritual **boundary polygons** for each site (data below). Arafat = irregular polygon; Mina = narrow valley pinched near the Jamarat, widening east toward Wadi Muhassir; Muzdalifah = lens between Wadi Muhassir and the Maʿzamayn pass; Haram = simple rectangle.
     - **Animated dashed route line** between the day's sites, in order (e.g. Day 9: Mina → Arafat → Muzdalifah). Animate `strokeDashoffset` over ~800ms; on day 11/12 auto-zoom into Mina and highlight the journey **camp → Jamarat**.
     - Tapping a pin zooms in and reveals **landmark pins** (Kaaba, Safa, Marwah, three Jamarat, Masjid al-Khayf, Masjid al-Bayʿah, Jabal ar-Rahmah, Masjid Namirah, al-Mashʿar al-Ḥarām). Each landmark opens a small callout with name (English + Arabic), a one-line blurb, and a "pilgrim note".
     - Optional **live location dot** + "~X m away" using expo-location.
   - **Day card** below the map: hijri label (gold, uppercase, wide-tracked), day name, subtitle, RTL Arabic day numeral.
   - **Vertical timeline**: dashed left rail, each event card has time (small gold uppercase), title, description, the site name (English + Arabic), and **duʿā chips**. Tapping a chip opens the Dua Sheet. Active site (selected on map) makes its timeline cards glow with a gold ring.

2. **Dua Sheet** (`app/dua/[id].tsx` presented as a bottom sheet on mobile)
   - Tabs: **Arabic** (large, RTL, calligraphic) · **Transliteration** (italic) · **Translation**.
   - "**The Story**" accordion: *Who said it · The occasion · Why it matters · Source* (Qurʾān/hadith reference).
   - Copy button, "share" button, bookmark toggle (local only).

3. **Umrah** (same Home screen, journey toggle = Umrah)
   - Map zooms to Haram, draws the **Saʿī path** (Safa ↔ Marwah polyline).
   - Linear stepper of Umrah steps (Miqāt → Ihrām → Talbiyah → Tawaf → Saʿī → Halq/Taqsīr), each with its own duʿās.

4. **Before Hajj/Umrah card** — short prep checklist + link into the Umrah guide.

## CRITICAL — religious accuracy (non-negotiable)

> **Do NOT invent, alter, translate, paraphrase, or summarise any Qurʾān or hadith text, Arabic, transliteration, translation, occasion, story, or source.** Use ONLY the verbatim strings provided in the dataset below. If something is missing, leave a `// TODO: ask user` comment — never fill it in from memory. Always render the footer disclaimer verbatim:
>
> *"This guide is for learning and reminder. Verify all rulings with a qualified scholar and your official Hajj group."*
>
> Where fiqh differs, say "the majority view" rather than presenting one ruling as the only way.

## Data model (TypeScript)

```ts
export type LocationId = "haram" | "mina" | "muzdalifah" | "arafat";
export type Coords = [number, number]; // [lat, lng]

export interface HajjLocation { id: LocationId; name: string; arabicName: string; coords: Coords; blurb: string; }
export interface Dua {
  id: string; title: string; occasion: string;
  arabic: string; transliteration: string; translation: string;
  story: { whoSaidIt: string; significance: string };
  source: string;
}
export interface TimelineEvent { id: string; time: string; title: string; locationId: LocationId; description: string; duaIds: string[]; }
export interface HajjDay {
  id: "8" | "9" | "10" | "11" | "12" | "13";
  hijriLabel: string; name: string; subtitle: string;
  camera: { focus: LocationId[]; primary: LocationId };
  events: TimelineEvent[];
}
export interface SiteLandmark { id: string; name: string; arabicName: string; coords: Coords; blurb: string; pilgrimNote: string; }
export interface SiteDetail { siteId: LocationId; boundary: Coords[]; boundaryLabel: string; landmarks: SiteLandmark[]; saiPath?: Coords[]; }
```

## Source-of-truth datasets

I will hand you two files from the existing web project — copy them **verbatim** into the RN app under `src/data/`:

1. `src/data/hajj.ts` — locations, all duʿās, all six days (8–13) with their full event timelines. **Every Arabic, transliteration, translation, story, and source string must be copied character-for-character.**
2. `src/data/site-details.ts` — boundary polygons + landmark pins for each of the four sites, plus the Saʿī path for the Haram.
3. `src/data/umrah.ts` — Umrah steps and their associated duʿā ids.

(Ask the user to paste these files; do not regenerate their contents.)

## Interaction details to preserve from the web version

- Day pill row scrolls horizontally; the active pill uses primary bg + primary-foreground text.
- Day 9: switching to `9.1` filters events `9-1, 9-2, 9-3` and forces map route `mina → arafat`; `9.2` filters `9-4..9-7` and forces `arafat → muzdalifah`.
- Day 13: `13.1` filters event `13-1` and zooms Mina; `13.2` filters `13-2` and zooms Haram.
- Day 9 sub-event for **gathering pebbles at Muzdalifah** must show the math breakdown: **7 pebbles for Jamrat al-ʿAqaba on the 10th; 21 each for the 11th and 12th (7 per pillar × 3); 21 for the 13th if staying — total 49 or 70**. Pilgrims usually gather ~70 small pebbles and discard extras.
- Day 10: Tawaf al-Ifāḍah and Saʿī are **obligatory rukns of Hajj** but **may be performed on the 10th, 11th, or 12th**; doing them on the 10th is sunnah. Surface this clearly.
- Tapping a timeline card softly recenters the map on its site.
- Talbiyah is recited continuously from ihrām until the **first stoning on the 10th**.
- Takbir of Tashriq is said after every fard prayer from **Fajr of the 9th to ʿAṣr of the 13th**.

## Offline & performance

- All Arabic + dua text bundled in JS. App should work fully offline once installed; only the map tiles need network. Cache the last viewed map region.
- Use `Image` with `expo-image` for any raster art. Lazy-mount the Dua Sheet.
- Memoise timeline rows; avoid re-rendering the map when only the sheet opens.

## Accessibility

- Minimum tap target 44×44.
- All duʿā Arabic gets `accessibilityLanguage="ar"` and large dynamic type support.
- Respect Reduce Motion: replace zoom/pan and dashed-line animations with crossfades.
- High-contrast support in dark mode.

## Footer (every screen)

> "This guide is for learning and reminder. Verify all rulings with a qualified scholar and your official Hajj group."
>
> Each duʿā lists its primary source (Qurʾān / Bukhārī / Muslim / Tirmidhī / Abū Dāwūd) at the bottom of its sheet.
>
> تَقَبَّلَ اللَّهُ مِنَّا وَمِنْكُمْ

## Deliverables

1. A runnable Expo project (`npx expo start` works on iOS + Android).
2. File structure mirroring the web: `src/components/` (Header, HajjMap, Timeline, DuaSheet, SiteDetailMap, UmrahTimeline, BeforeHajjUmrahCard, CampPanel), `src/data/`, `src/hooks/` (use-theme, use-live-location, use-camp-pin), `src/lib/` (geo helpers: `pointInPolygon`, `formatDistanceAway`, `openMapsNavigation`).
3. iOS + Android app icons and splash in the desert/emerald/gold palette (no purple, no generic AI gradients).
4. README with build + EAS submit instructions.

Do not begin coding until you've asked me to paste the three data files (`hajj.ts`, `site-details.ts`, `umrah.ts`). Those are the canonical content; everything else is presentation.
