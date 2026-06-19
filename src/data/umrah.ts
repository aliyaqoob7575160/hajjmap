/** Landmark id in `site-details` haram — drives map focus per Umrah step. */
export type UmrahMapFocus = "kaaba" | "safa" | "marwah" | null;

export interface UmrahStep {
  id: string;
  phase: string;
  title: string;
  description: string;
  instructions: string[];
  mapFocus: UmrahMapFocus;
  duaIds: string[];
}

export const umrahGuide = {
  title: "Umrah",
  arabicTitle: "العُمْرَة",
  subtitle: "A step-by-step guide — perform anytime, or before Hajj if you are doing Tamattu.",
  tamattuNote:
    "For Tamattu pilgrims: complete this Umrah in the days before 8 Dhul Hijjah, then enter Hajj ihram on the Day of Tarwiyah (8th).",
  standaloneNote: "Umrah-only visitors can follow these steps without the Hajj day timeline.",
};

export const umrahSteps: UmrahStep[] = [
  {
    id: "u-1",
    phase: "Before the Haram",
    title: "Enter ihram & make the intention",
    description:
      "Enter the state of ihram at the miqat (or from your lodging in Makkah if already there, per your madhhab and package). Make a clear intention for Umrah.",
    instructions: [
      "Perform ghusl if possible, wear ihram garments, and avoid the prohibitions of ihram from this point.",
      "If you are doing Tamattu, this is your Umrah ihram — you will exit ihram after Sa'i and shaving/trimming.",
      "Follow your group's guidance on which miqat applies to your route.",
    ],
    mapFocus: null,
    duaIds: [],
  },
  {
    id: "u-2",
    phase: "En route",
    title: "Talbiyah — heading to al-Haram",
    description:
      "Proceed toward al-Masjid al-Haram reciting the Talbiyah, remembering that you are answering the call of Allah.",
    instructions: [
      "Continue the Talbiyah until you begin Tawaf (for Umrah).",
      "Enter the mosque with your right foot and make du'a of entry if you know it.",
    ],
    mapFocus: "kaaba",
    duaIds: ["talbiyah"],
  },
  {
    id: "u-3",
    phase: "At the Kaaba",
    title: "Tawaf — seven circuits",
    description:
      "Circle the Kaaba seven times, beginning and ending at the Black Stone (Hajar al-Aswad), with the Kaaba on your left.",
    instructions: [
      "Men uncover the right shoulder (idtiba') for Tawaf if you are performing Umrah (per the majority view).",
      "Pray with humility; there is no fixed wording for each circuit — any du'a or dhikr is permitted.",
      "Between the Yemeni Corner and the Black Stone, the Prophet (peace be upon him) often recited the comprehensive du'a from Qur'an 2:201.",
      "After seven circuits, cover the shoulder again and proceed to pray two rak'ahs behind Maqam Ibrahim if possible.",
    ],
    mapFocus: "kaaba",
    duaIds: ["tawaf", "talbiyah"],
  },
  {
    id: "u-4",
    phase: "After Tawaf",
    title: "Two rak'ahs at Maqam Ibrahim",
    description:
      "Pray two rak'ahs behind the Station of Ibrahim (Maqam Ibrahim), or anywhere in the Haram if the area is crowded.",
    instructions: [
      "This is sunnah after Tawaf, not a separate pillar of Umrah.",
      "If the area is too crowded, you may pray elsewhere in the Sacred Mosque.",
      "Then drink Zamzam, make du'a, and go to Safa to begin Sa'i.",
    ],
    mapFocus: "kaaba",
    duaIds: [],
  },
  {
    id: "u-5",
    phase: "Sa'i",
    title: "Sa'i — Safa and Marwah (seven trips)",
    description:
      "Walk seven times between the hills of Safa and Marwah, beginning at Safa and ending at Marwah, commemorating the striving of Hajar (peace be upon her).",
    instructions: [
      "Start at Safa, face the Kaaba, and make dhikr and du'a as the Prophet (peace be upon him) did.",
      "Walk the distance between Safa and Marwah; men run between the green markers if able (per sunnah).",
      "One trip is Safa → Marwah; the seventh trip ends at Marwah.",
      "The verse of Safa and Marwah (Qur'an 2:158) is recited at the start.",
    ],
    mapFocus: "safa",
    duaIds: ["sai"],
  },
  {
    id: "u-6",
    phase: "Completion",
    title: "Halq or Taqsir — exit ihram",
    description:
      "Complete Umrah by shaving the head (halq) or trimming the hair (taqsir). Women trim a fingertip-length from their hair.",
    instructions: [
      "After this, you leave the state of ihram — the prohibitions of ihram are lifted.",
      "For Tamattu: you remain in Makkah without ihram until you enter ihram for Hajj on 8 Dhul Hijjah.",
      "Umrah-only: your Umrah is complete, praise be to Allah.",
    ],
    mapFocus: "marwah",
    duaIds: [],
  },
];
