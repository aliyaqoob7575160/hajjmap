# Labbayk — A Hajj Companion (Product & Design Spec)

> **Working name:** *Labbayk* ("Here I am") — from the Talbiyah, the pilgrim's call.
> A sleek, modern, browser-based companion that walks a pilgrim through each day of
> Hajj on an interactive map, with a per-day timeline and the Duas — their text,
> translation, and the story behind each one.

**v1 decisions (locked):** stylized **SVG map** · **static data** (no backend) · **English** only.

---

## 1. Vision

A single-page web app. At the top sits a beautiful, **clickable map** of the Hajj
sites (Al-Masjid al-Haram, Mina, Muzdalifah, Arafat). A **day selector** (8–13
Dhul-Hijjah) sits top-right. Choosing a day (or clicking a place) **smoothly zooms
the map** to the right region and reveals a **vertical timeline** of that day below.
Each timeline moment carries one or more **Duas**; opening a Dua reveals its Arabic
text, transliteration, translation, and — most importantly — **its story**: who first
said it, when, and why it matters.

The feeling: calm, reverent, premium. Desert sand, Kiswah black-and-gold, emerald
green, generous whitespace, elegant Arabic calligraphy, and soft motion.

---

## 2. Guiding principles

1. **Reverence over flash.** Motion is gentle; the content is the star.
2. **Clarity for a stressed traveller.** Big tap targets, readable Arabic, offline-friendly.
3. **Religious accuracy is non-negotiable.** All Dua text, translations, and fiqh
   sequencing must be verified against authentic sources and ideally reviewed by a
   qualified scholar before launch. Where fiqh differs by madhhab, say "the majority
   view" rather than presenting one ruling as the only way.
4. **Content as data.** Days, events, locations, and Duas live in structured typed
   data so the app stays easy to audit, translate, and extend.

> **Accuracy disclaimer to ship in the footer:** "This guide is for learning and
> reminder. Verify all rulings with a qualified scholar and your official Hajj group."

---

## 3. Core user flow

```
Land on page  ->  See full map (all four sites) + intro line
   |
   |-- Pick a day (8-13)  ->  Map zooms/pans to that day's region(s), draws the
   |                          day's route, highlights active site(s)  ->  Timeline
   |                          of the day slides in below the map
   |
   '-- Click a site on the map  ->  Map zooms to that site; timeline filters to
                                     that site's moments
                 |
                 '-- Tap a timeline moment  ->  its Dua chips appear
                            |
                            '-- Tap a Dua  ->  detail opens (Arabic / transliteration
                                / translation tabs + "The Story": who said it,
                                the occasion, why it matters, source)
```

---

## 4. Screen layout (information architecture)

```
+---------------------------------------------------------------+
|  Labbayk            [ Day: v 9 - Yawm al-Arafah ]   (dark)    |  Sticky header
+---------------------------------------------------------------+
|                                                               |
|                 INTERACTIVE MAP (hero, ~55vh)                 |
|     Haram .     Mina .     Muzdalifah .     Arafat .          |  clickable hotspots
|             (animated route line for the selected day)        |
|                                                               |
+---------------------------------------------------------------+
|  9 Dhul-Hijjah . Yawm al-Arafah   "The heart of Hajj"         |  Day header
|                                                               |
|   o After sunrise - Depart Mina for Arafat       [Talbiyah]   |  Timeline
|   |                                                           |
|   o Midday - Sermon & combined prayer at Namirah              |
|   |                                                           |
|   o Afternoon-sunset - The Standing (Wuquf)   [Arafah Du'a]   |
|   |                                                           |
|   o After sunset - Move to Muzdalifah                         |
+---------------------------------------------------------------+
|  Footer: accuracy disclaimer . sources . about                |
+---------------------------------------------------------------+

Dua detail (side sheet on desktop, full-screen dialog on mobile):
+--------------------------------------+
|  The Supplication of Arafah       X  |
|  ----------------------------------  |
|  [ Arabic ] [ Translit ] [ English ] |  <- Tabs
|                                      |
|  (large, RTL, calligraphic Arabic)   |
|                                      |
|  > The Story                         |  <- Accordion
|      Who said it . The occasion .    |
|      Why it matters . Source         |
+--------------------------------------+
```

---

## 5. The interactive map (stylized SVG)

A **hand-stylized vector (SVG) map**, not a literal Google Map — prettier, fully
controllable, and every region is a clickable group.

- Each location is an SVG `<g id="...">` with a hotspot dot, a label, and a soft glow
  on hover/active.
- Zooming = animating the SVG `viewBox` (or `react-zoom-pan-pinch` `setTransform`) to
  the bounding box of the focused site(s), eased with `framer-motion` (~500ms).
- A **route line** (animated `stroke-dashoffset`) connects the day's sites in order.
- Respect `prefers-reduced-motion` (cross-fade instead of animating).

### Locations (approximate real coordinates — verify before any GPS use)

| Site | Arabic | Lat, Lng (approx.) | Role |
|---|---|---|---|
| Al-Masjid al-Haram | ٱلْمَسْجِد ٱلْحَرَام | 21.4225, 39.8262 | Kaaba · Tawaf · Sa'i · Zamzam |
| Mina | مِنَى | 21.4130, 39.8930 | Tents · the three Jamarat |
| Muzdalifah | ٱلْمُزْدَلِفَة | 21.3830, 39.9370 | Night of the 9th · gather pebbles |
| Arafat | عَرَفَات | 21.3550, 39.9840 | The Standing (Wuquf) · Jabal ar-Rahmah |

Rough distances: Haram→Mina ≈ 7 km · Mina→Arafat ≈ 14 km · Arafat→Muzdalifah ≈ 9 km · Muzdalifah→Mina ≈ 5 km.

---

## 6. The day selector → camera mapping

| Day | Name | Movement that day | Map: primary zoom |
|---|---|---|---|
| **8** | Yawm at-Tarwiyah | Haram (ihram) → **Mina** (overnight) | Mina |
| **9** | **Yawm al-Arafah** | Mina → **Arafat** (Standing) → Muzdalifah (night) | Arafat |
| **10** | Yawm an-Nahr (Eid) | Muzdalifah → **Mina** (Jamrat al-Aqaba, sacrifice, shave) → Haram (Tawaf al-Ifadah) → Mina | Mina (Jamarat) |
| **11** | Ayyam at-Tashriq | **Mina** — stone all three Jamarat | Mina |
| **12** | Ayyam at-Tashriq | **Mina** — stone all three; optional early departure | Mina |
| **13** | Ayyam at-Tashriq | **Mina** — stone all three → Haram (Tawaf al-Wada) | Mina → Haram |

---

## 7. The timeline

- Vertical, with a connecting spine and a node per moment.
- Each node: **time label**, **title**, short **description**, the **site** it happens
  at, and **Dua chips**.
- Clicking a node gently re-centers the map on that node's site.
- Clicking a Dua chip opens the **Dua detail**.

## 8. The Dua detail

Tabs: **Arabic** (large, RTL, calligraphic) · **Transliteration** (italic) ·
**Translation**. Below, a **"The Story"** accordion: *Who said it · The occasion ·
Why it matters · Source.* Optional later: audio recitation, copy, bookmark.

---

## 9. Data model (TypeScript)

```ts
export type LocationId = "haram" | "mina" | "muzdalifah" | "arafat";

export interface HajjLocation {
  id: LocationId;
  name: string;
  arabicName: string;
  coords: [number, number]; // [lat, lng], approximate
  blurb: string;
}

export interface Dua {
  id: string;
  title: string;
  occasion: string;       // when it is said during Hajj
  arabic: string;         // RTL
  transliteration: string;
  translation: string;
  story: { whoSaidIt: string; significance: string };
  source: string;         // Qur'an / hadith reference
}

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  locationId: LocationId;
  description: string;
  duaIds: string[];       // references into the Dua table
}

export interface HajjDay {
  id: "8" | "9" | "10" | "11" | "12" | "13";
  hijriLabel: string;     // "9 Dhul-Hijjah"
  name: string;           // "Yawm al-Arafah"
  subtitle: string;
  camera: { focus: LocationId[]; primary: LocationId };
  events: TimelineEvent[];
}
```

---

## 10. Full static dataset (v1) — **verify all content before launch**

> The Arabic, transliteration, translations, and sequencing below are drawn from
> well-known authentic sources. Treat them as a strong starting point and have a
> qualified scholar confirm before publishing.

### Locations

```ts
export const locations: Record<LocationId, HajjLocation> = {
  haram:      { id: "haram",      name: "Al-Masjid al-Haram", arabicName: "ٱلْمَسْجِد ٱلْحَرَام", coords: [21.4225, 39.8262], blurb: "The Sacred Mosque around the Kaaba — Tawaf, Sa'i, and Zamzam." },
  mina:       { id: "mina",       name: "Mina",               arabicName: "مِنَى",              coords: [21.4130, 39.8930], blurb: "The valley of tents and the three Jamarat." },
  muzdalifah: { id: "muzdalifah", name: "Muzdalifah",         arabicName: "ٱلْمُزْدَلِفَة",       coords: [21.3830, 39.9370], blurb: "The open plain — rest the night of the 9th, gather pebbles." },
  arafat:     { id: "arafat",     name: "Arafat",             arabicName: "عَرَفَات",            coords: [21.3550, 39.9840], blurb: "The plain and Mount of Mercy where the Standing takes place." },
};
```

### Duas

```ts
export const duas: Record<string, Dua> = {
  talbiyah: {
    id: "talbiyah",
    title: "The Talbiyah",
    occasion: "Recited continuously from entering ihram until the first stoning on the 10th.",
    arabic: "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ",
    transliteration: "Labbayka Allahumma labbayk, labbayka la sharika laka labbayk, inna l-hamda wa n-ni'mata laka wa l-mulk, la sharika lak.",
    translation: "Here I am, O Allah, here I am. Here I am, You have no partner, here I am. Surely all praise, grace and dominion belong to You. You have no partner.",
    story: {
      whoSaidIt: "Taught by the Prophet Muhammad (peace be upon him); it echoes the call of Ibrahim.",
      significance: "When Ibrahim finished raising the Kaaba, Allah commanded him to proclaim the pilgrimage to mankind (Qur'an 22:27). The Talbiyah is the believer's answer — 'labbayk' means 'I respond, and I respond again.' Saying it, a pilgrim joins an unbroken chorus stretching back thousands of years.",
    },
    source: "Sahih al-Bukhari 1549; Sahih Muslim 1184. Qur'an 22:27.",
  },
  arafahTahlil: {
    id: "arafahTahlil",
    title: "The Supplication of the Day of Arafah",
    occasion: "During the Standing (Wuquf) at Arafat on 9 Dhul-Hijjah, from after Dhuhr until sunset.",
    arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration: "La ilaha illa Allahu wahdahu la sharika lah, lahu l-mulku wa lahu l-hamd, wa huwa 'ala kulli shay'in qadir.",
    translation: "There is no god but Allah alone, with no partner. His is the dominion, His is all praise, and He has power over all things.",
    story: {
      whoSaidIt: "The Prophet Muhammad (peace be upon him).",
      significance: "The Prophet said the best supplication is that of the Day of Arafah, and the best he and the prophets before him said is this declaration of God's oneness. Arafah is the essence of the pilgrimage — 'Hajj is Arafah' — the day the religion was perfected (Qur'an 5:3) and the day Allah frees the most people from the Fire.",
    },
    source: "Jami' at-Tirmidhi 3585; Sahih Muslim 1348. Qur'an 5:3.",
  },
  sai: {
    id: "sai",
    title: "Sa'i — Safa and Marwah",
    occasion: "Walking seven times between Safa and Marwah (during Umrah and after Tawaf al-Ifadah).",
    arabic: "إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ، فَمَنْ حَجَّ الْبَيْتَ أَوِ اعْتَمَرَ فَلَا جُنَاحَ عَلَيْهِ أَنْ يَطَّوَّفَ بِهِمَا",
    transliteration: "Inna s-safa wa l-marwata min sha'a'iri Llah, faman hajja l-bayta awi'tamara fala junaha 'alayhi an yattawwafa bihima.",
    translation: "Indeed, Safa and Marwah are among the symbols of Allah. So whoever makes Hajj to the House or performs Umrah, there is no blame upon him for walking between them.",
    story: {
      whoSaidIt: "Qur'an 2:158; the rite commemorates Hajar, wife of Ibrahim.",
      significance: "Left in the barren valley with the infant Ismail, Hajar ran seven times between the hills of Safa and Marwah searching for water, until the spring of Zamzam gushed forth by Allah's mercy. Her trust and striving are honoured by every pilgrim who walks the same path. The Prophet said: 'That is why people run between them.'",
    },
    source: "Qur'an 2:158; Sahih al-Bukhari 3364.",
  },
  tawaf: {
    id: "tawaf",
    title: "Supplication during Tawaf",
    occasion: "Circling the Kaaba seven times; said especially between the Yemeni Corner and the Black Stone.",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    transliteration: "Rabbana atina fi d-dunya hasanatan wa fi l-akhirati hasanatan wa qina 'adhaba n-nar.",
    translation: "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
    story: {
      whoSaidIt: "Qur'an 2:201; the Prophet recited it between the two corners.",
      significance: "There is no fixed wording for each circuit of Tawaf — the pilgrim may make any du'a or dhikr. The Prophet used to say this comprehensive verse between the Yemeni Corner and the Black Stone. Tawaf circles the first house built for the worship of Allah, raised by Ibrahim and Ismail (Qur'an 2:127).",
    },
    source: "Qur'an 2:201; Sunan Abi Dawud 1892.",
  },
  jamarat: {
    id: "jamarat",
    title: "Stoning the Jamarat",
    occasion: "With each of the seven pebbles thrown at each pillar (10th–13th Dhul-Hijjah).",
    arabic: "اللَّهُ أَكْبَر",
    transliteration: "Allahu Akbar.",
    translation: "Allah is the Greatest.",
    story: {
      whoSaidIt: "Said with each pebble; the rite recalls Ibrahim rejecting Shaytan.",
      significance: "At Mina, Shaytan tried to turn Ibrahim away from obeying Allah's command to sacrifice his son. Ibrahim drove him off by pelting him with pebbles. Casting the stones is an outward act of rejecting temptation and reaffirming obedience to Allah. On the 10th, only the large pillar (Jamrat al-Aqaba) is stoned; on the 11th–13th, all three are stoned in order.",
    },
    source: "Reported from Ibn Abbas; cf. Sahih al-Bukhari, the rites of Hajj.",
  },
  muzdalifah: {
    id: "muzdalifah",
    title: "Remembrance at Muzdalifah",
    occasion: "The night of the 10th and after Fajr at al-Mash'ar al-Haram.",
    arabic: "فَإِذَا أَفَضْتُمْ مِنْ عَرَفَاتٍ فَاذْكُرُوا اللَّهَ عِنْدَ الْمَشْعَرِ الْحَرَامِ، وَاذْكُرُوهُ كَمَا هَدَاكُمْ",
    transliteration: "Fa-idha afadtum min 'arafatin fadhkuru Llaha 'inda l-mash'ari l-haram, wadhkuruhu kama hadakum.",
    translation: "And when you depart from Arafat, remember Allah at the Sacred Site (al-Mash'ar al-Haram), and remember Him as He has guided you.",
    story: {
      whoSaidIt: "Qur'an 2:198; the practice of the Prophet (peace be upon him).",
      significance: "After the Standing at Arafat, pilgrims rest the night under the open sky at Muzdalifah and gather pebbles for the stoning. After Fajr the Prophet faced the qiblah and made much du'a, takbir and tahlil at al-Mash'ar al-Haram until the sky grew bright.",
    },
    source: "Qur'an 2:198; Sahih Muslim 1218 (Hajj of the Prophet).",
  },
  takbirTashriq: {
    id: "takbirTashriq",
    title: "The Takbir of Tashriq",
    occasion: "After every obligatory prayer from Fajr of the 9th until Asr of the 13th.",
    arabic: "اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ، لَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ، وَلِلَّهِ الْحَمْدُ",
    transliteration: "Allahu akbar, Allahu akbar, la ilaha illa Llah, wa-Llahu akbar, Allahu akbar, wa li-Llahi l-hamd.",
    translation: "Allah is the Greatest, Allah is the Greatest, there is no god but Allah; Allah is the Greatest, Allah is the Greatest, and to Allah belongs all praise.",
    story: {
      whoSaidIt: "Practised by the Companions, e.g. Ibn Mas'ud and Ibn Abbas.",
      significance: "The days of Eid and Tashriq are days of remembrance: 'And remember Allah during the appointed days' (Qur'an 2:203). The takbir fills Mina with the proclamation of Allah's greatness throughout the days of Hajj.",
    },
    source: "Qur'an 2:203; reported from the Companions (e.g. Musannaf Ibn Abi Shaybah).",
  },
};
```

### Days

```ts
export const days: HajjDay[] = [
  {
    id: "8",
    hijriLabel: "8 Dhul-Hijjah",
    name: "Yawm at-Tarwiyah",
    subtitle: "The day of setting out — Makkah to Mina",
    camera: { focus: ["haram", "mina"], primary: "mina" },
    events: [
      { id: "8-1", time: "Morning",        title: "Enter ihram and intend Hajj",   locationId: "haram", description: "Pilgrims performing Tamattu enter ihram from their lodging in Makkah, make the intention for Hajj, and begin the Talbiyah.", duaIds: ["talbiyah"] },
      { id: "8-2", time: "Before midday",  title: "Travel to Mina",                locationId: "mina",  description: "The pilgrims move to Mina, reciting the Talbiyah along the way.", duaIds: ["talbiyah"] },
      { id: "8-3", time: "Midday onward",  title: "Five prayers in Mina",          locationId: "mina",  description: "Dhuhr, Asr, Maghrib, Isha, and the Fajr of the 9th are prayed shortened (not combined) in Mina; the night is spent there.", duaIds: [] },
    ],
  },
  {
    id: "9",
    hijriLabel: "9 Dhul-Hijjah",
    name: "Yawm al-Arafah",
    subtitle: "The Day of Arafah — the heart of Hajj",
    camera: { focus: ["mina", "arafat", "muzdalifah"], primary: "arafat" },
    events: [
      { id: "9-1", time: "After sunrise",          title: "Depart Mina for Arafat",                 locationId: "arafat",     description: "After praying Fajr in Mina, the pilgrims set out for the plain of Arafat, reciting the Talbiyah and takbir.", duaIds: ["talbiyah"] },
      { id: "9-2", time: "Midday (Dhuhr)",         title: "The sermon & combined prayer at Namirah", locationId: "arafat",     description: "Dhuhr and Asr are prayed shortened and combined at the time of Dhuhr, following the Prophet's farewell example.", duaIds: ["takbirTashriq"] },
      { id: "9-3", time: "Afternoon until sunset", title: "The Standing (Wuquf) at Arafat",          locationId: "arafat",     description: "Facing the qiblah with raised hands, the pilgrim pours out supplication until sunset. This standing is the essential pillar of Hajj.", duaIds: ["arafahTahlil", "talbiyah"] },
      { id: "9-4", time: "After sunset",           title: "Move to Muzdalifah",                      locationId: "muzdalifah", description: "Leaving Arafat calmly after sunset, pilgrims reach Muzdalifah, pray Maghrib and Isha combined, rest, and gather pebbles.", duaIds: ["muzdalifah"] },
    ],
  },
  {
    id: "10",
    hijriLabel: "10 Dhul-Hijjah",
    name: "Yawm an-Nahr",
    subtitle: "The Day of Sacrifice — Eid al-Adha",
    camera: { focus: ["muzdalifah", "mina", "haram"], primary: "mina" },
    events: [
      { id: "10-1", time: "Before sunrise",  title: "Remembrance at al-Mash'ar al-Haram", locationId: "muzdalifah", description: "After Fajr at Muzdalifah, the pilgrims make du'a and takbir, then leave for Mina before sunrise.", duaIds: ["muzdalifah", "takbirTashriq"] },
      { id: "10-2", time: "Morning",         title: "Stone Jamrat al-Aqaba",              locationId: "mina",       description: "Seven pebbles are cast at the large pillar, saying 'Allahu Akbar' with each. The Talbiyah stops with the first pebble.", duaIds: ["jamarat"] },
      { id: "10-3", time: "After stoning",   title: "Sacrifice and shaving",              locationId: "mina",       description: "The pilgrim offers the sacrifice (Hady), then shaves or trims the hair (Halq/Taqsir), leaving the state of ihram.", duaIds: ["takbirTashriq"] },
      { id: "10-4", time: "Then",            title: "Tawaf al-Ifadah and Sa'i",           locationId: "haram",      description: "The pilgrim goes to Makkah for the essential Tawaf al-Ifadah and the Sa'i between Safa and Marwah, then returns to Mina.", duaIds: ["tawaf", "sai"] },
    ],
  },
  {
    id: "11",
    hijriLabel: "11 Dhul-Hijjah",
    name: "Ayyam at-Tashriq (1)",
    subtitle: "First day of Tashriq in Mina",
    camera: { focus: ["mina"], primary: "mina" },
    events: [
      { id: "11-1", time: "After Dhuhr", title: "Stone the three Jamarat", locationId: "mina", description: "All three pillars are stoned in order — the small (Sughra), the middle (Wusta), then the large (Aqaba) — seven pebbles each, with du'a after the first two.", duaIds: ["jamarat"] },
      { id: "11-2", time: "Throughout",  title: "Nights and remembrance in Mina", locationId: "mina", description: "The night is spent in Mina; the takbir of Tashriq is repeated after the prayers and throughout the day.", duaIds: ["takbirTashriq"] },
    ],
  },
  {
    id: "12",
    hijriLabel: "12 Dhul-Hijjah",
    name: "Ayyam at-Tashriq (2)",
    subtitle: "Second day of Tashriq — optional early departure",
    camera: { focus: ["mina"], primary: "mina" },
    events: [
      { id: "12-1", time: "After Dhuhr", title: "Stone the three Jamarat", locationId: "mina", description: "The three pillars are stoned again in order, seven pebbles each.", duaIds: ["jamarat"] },
      { id: "12-2", time: "Before sunset", title: "Optional departure (Ta'ajjul)", locationId: "mina", description: "Whoever wishes may leave Mina before sunset (Ta'ajjul); whoever stays completes the 13th. Both are permitted (Qur'an 2:203).", duaIds: ["takbirTashriq"] },
    ],
  },
  {
    id: "13",
    hijriLabel: "13 Dhul-Hijjah",
    name: "Ayyam at-Tashriq (3)",
    subtitle: "Final day of Tashriq and the farewell",
    camera: { focus: ["mina", "haram"], primary: "haram" },
    events: [
      { id: "13-1", time: "After Dhuhr", title: "Stone the three Jamarat", locationId: "mina", description: "For those who stayed, the three pillars are stoned a final time, seven pebbles each.", duaIds: ["jamarat"] },
      { id: "13-2", time: "Before leaving Makkah", title: "Tawaf al-Wada (the farewell)", locationId: "haram", description: "The last act before leaving is the farewell Tawaf around the Kaaba, so the pilgrim's final moment in the Sacred Mosque is at the House of Allah.", duaIds: ["tawaf"] },
    ],
  },
];
```

---

## 11. Visual design system

**Mood:** desert calm meets the Kiswah. Reverent, premium, uncluttered.

**Light tokens:** `--bg #FBF7EF` (ivory/sand) · `--surface #FFFFFF` · `--ink #1C1B1A`
· `--primary #0B6E4F` (emerald) / `--primary-deep #064E3B` · `--accent #C9A227` (gold)
· `--muted #8A8170`.

**Dark tokens ("night of Muzdalifah"):** `--bg #0D1B2A` · `--surface #13263B`
· `--ink #F2EEE3` · `--primary #3FB28A` · `--accent #E3C766`.

**Typography:** UI/Latin — **Plus Jakarta Sans** (or Inter). Arabic/Quranic —
**Amiri** or **Scheherazade New** (classical Naskh), large, `dir="rtl"`, generous
line-height. Optional display headings — **Cormorant**.

**Ornament:** subtle 8-point-star / arabesque pattern at low opacity for dividers and
the map backdrop. Use sparingly.

**Motion (framer-motion):** map zoom/pan 450–600ms easeInOut · route line animated
`stroke-dashoffset` draw-on · timeline cards fade + 12px slide-up, staggered ~60ms ·
honor `prefers-reduced-motion`.

**shadcn/ui components:** `Select` (day picker) · `Sheet`/`Dialog` (Dua detail) ·
`Tabs` (Arabic/translit/translation) · `Accordion` ("The Story") · `Card` (timeline)
· `Tooltip`/`HoverCard` (map hotspots) · `Badge` (Dua chips).

---

## 12. Tech stack (Lovable default)

React + TypeScript + Vite · Tailwind CSS + shadcn/ui · **framer-motion** +
**react-zoom-pan-pinch** · content as typed TS data (no backend in v1).

---

## 13. Build phases

1. **Skeleton** — header, day `Select`, static SVG map, empty timeline; wire the data model.
2. **Map camera** — zoom/pan to a site; per-day route line; hotspot click selects a site.
3. **Timeline** — render the selected day's events; sync map ↔ timeline selection.
4. **Dua detail** — sheet/dialog with tabs + "The Story" accordion.
5. **Content pass** — all days (8–13) and Duas in; scholarly review.
6. **Polish** — dark mode, motion, Arabic typography, reduced-motion, mobile.
7. **Nice-to-haves** — audio recitation, bookmarks, PWA/offline, live prayer-time/GPS.

---

## 14. Building it with Lovable (beginner guide)

**What Lovable is:** an AI app builder. You describe the app in plain English; it
writes a full React + TypeScript + Tailwind + shadcn/ui app, runs it in a cloud
sandbox, and gives you a **live preview URL** plus a **visual editor URL**. It can add
a database and deploy with one click. You refine it by chatting.

**How it connects here (the Lovable MCP):** the MCP lets the Cursor agent drive your
Lovable project directly — create it, send change requests, read the exact diffs,
manage data, and deploy — without leaving Cursor.

**The tools (high level):** `list_projects` / `create_project` / `get_project` ·
`send_message` (with `plan_mode`) · `get_message` / `get_diff` / `read_file` /
`list_files` / `list_edits` · `set_project_knowledge` / `set_workspace_knowledge` ·
`get_database_status` / `enable_database` / `query_database` · `deploy_project` /
`get_project_analytics` / `remix_project`.

**Workflow for this project:**
1. Authenticate the Lovable MCP once (`mcp_auth`).
2. `create_project` with a concrete prompt (the brief below).
3. After the first build, open `preview_url` / read `get_diff` to confirm.
4. Iterate one feature at a time (map → camera → timeline → Dua detail), one
   `send_message` each, verifying each diff.
5. Lock design rules with `set_project_knowledge`.
6. Keep content as static typed data for v1.
7. `deploy_project` and share the live URL.

**Beginner tips:** one change per message · point at the exact element · describe the
end state, not the steps · verify in the diff/preview before believing it is done ·
**never let the AI invent religious text** — only use the reviewed data in this file.

**Project knowledge to set once (`set_project_knowledge`):**
> "This is *Labbayk*, a reverent Hajj companion. Stack: React + TS + Tailwind +
> shadcn/ui, framer-motion, react-zoom-pan-pinch. Palette: ivory #FBF7EF, emerald
> #0B6E4F, gold #C9A227, ink #1C1B1A; dark mode = deep night blue #0D1B2A. Arabic uses
> the Amiri font, dir=rtl, large. NEVER invent or alter Qur'an/hadith text,
> translations, or fiqh sequence — only use the data provided. Honor
> prefers-reduced-motion. Keep the UI calm and uncluttered."

**Draft `create_project` prompt:** see the brief used to scaffold this project (app
concept, sticky header + day selector, hero SVG map with four clickable sites,
per-day zoom + animated route, vertical timeline, Dua detail sheet with tabs + story
accordion, calm premium palette, framer-motion, dark mode, typed static data).

---

## 15. Content sourcing & accuracy

- Dua text and references come from the Qur'an and authentic collections (Sahih
  al-Bukhari, Sahih Muslim, the Sunan) and reputable Hajj guides.
- Note the **madhhab** where rulings differ; prefer "the majority view" framing.
- Have a **qualified scholar review** the full content before launch.
- Keep a `source` on every Dua and a visible disclaimer in the footer.

---

## 16. Future enhancements

- Audio recitation per Dua · "Where am I now?" GPS + live prayer times on a real map
  layer · bookmarks / "my Duas" · printable/offline PWA · multi-language (Urdu,
  Arabic, Indonesian, French, Turkish) · a guided step-by-step mode.
