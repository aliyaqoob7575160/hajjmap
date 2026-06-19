import type { Coords } from "@/lib/geo";
import type { LocationId } from "@/data/hajj";

export interface SiteLandmark {
  id: string;
  name: string;
  arabicName: string;
  coords: Coords;
  blurb: string;
  /** Why a pilgrim might go here on this day. */
  pilgrimNote: string;
}

export interface SiteDetail {
  siteId: LocationId;
  /** Approximate ritual boundary — illustrative only; verify with your group/scholar. */
  boundary: Coords[];
  boundaryLabel: string;
  landmarks: SiteLandmark[];
  /** Optional path for Sa'i (Safa ↔ Marwah), shown on Umrah / Haram detail maps. */
  saiPath?: Coords[];
}

/**
 * Boundaries are simplified polygons for orientation — NOT official Saudi survey data.
 * Always follow your mutawwif and on-site signage for valid standing/stoning areas.
 */
export const siteDetails: Record<LocationId, SiteDetail> = {
  haram: {
    siteId: "haram",
    boundaryLabel: "Masjid al-Haram precinct (approx.)",
    boundary: [
      [21.4280, 39.8210],
      [21.4280, 39.8310],
      [21.4170, 39.8310],
      [21.4170, 39.8210],
      [21.4280, 39.8210],
    ],
    landmarks: [
      {
        id: "kaaba",
        name: "Kaaba",
        arabicName: "ٱلْكَعْبَة",
        coords: [21.4225, 39.8262],
        blurb: "The House of Allah — centre of Tawaf.",
        pilgrimNote: "Umrah Tawaf, Tawaf al-Ifadah, and Tawaf al-Wada.",
      },
      {
        id: "safa",
        name: "Safa",
        arabicName: "ٱلصَّفَا",
        coords: [21.4235, 39.8278],
        blurb: "Starting hill of Sa'i.",
        pilgrimNote: "Begin Sa'i here, facing the Kaaba.",
      },
      {
        id: "marwah",
        name: "Marwah",
        arabicName: "ٱلْمَرْوَة",
        coords: [21.4230, 39.8258],
        blurb: "End hill of Sa'i — seven trips between Safa and Marwah.",
        pilgrimNote: "Finish the seventh lap here.",
      },
    ],
    saiPath: [
      [21.4235, 39.8278],
      [21.4233, 39.8272],
      [21.4231, 39.8266],
      [21.4230, 39.8260],
      [21.4230, 39.8258],
    ],
  },
  mina: {
    siteId: "mina",
    boundaryLabel: "Mina valley (approx.)",
    // Narrow valley running roughly W→E between Jabal ranges, pinched in the
    // middle near the Jamarat and widening east toward Wadi Muhassir.
    boundary: [
      [21.4188, 39.8745],
      [21.4205, 39.8780],
      [21.4215, 39.8830],
      [21.4210, 39.8880],
      [21.4198, 39.8930],
      [21.4188, 39.8985],
      [21.4170, 39.9040],
      [21.4115, 39.9055],
      [21.4060, 39.9030],
      [21.4040, 39.8975],
      [21.4055, 39.8915],
      [21.4080, 39.8860],
      [21.4110, 39.8810],
      [21.4145, 39.8770],
      [21.4188, 39.8745],
    ],
    landmarks: [
      {
        id: "jamrat-sughra",
        name: "Jamrat al-Sughra",
        arabicName: "جمرة السُّغرى",
        coords: [21.4188, 39.8755],
        blurb: "The small pillar — first when stoning all three.",
        pilgrimNote: "Days 11–13: stone here first, then pause for du'a.",
      },
      {
        id: "jamrat-wusta",
        name: "Jamrat al-Wusta",
        arabicName: "جمرة الوُسْطى",
        coords: [21.4183, 39.8772],
        blurb: "The middle pillar.",
        pilgrimNote: "Second in order on the 11th–13th.",
      },
      {
        id: "jamrat-aqaba",
        name: "Jamrat al-Aqaba",
        arabicName: "جمرة العقبة",
        coords: [21.4175, 39.8795],
        blurb: "The large pillar — only one stoned on the 10th.",
        pilgrimNote: "Yawm an-Nahr: seven pebbles here; Talbiyah stops with the first.",
      },
      {
        id: "masjid-khayf",
        name: "Masjid al-Khayf",
        arabicName: "مَسْجِد ٱلْخَيْف",
        coords: [21.4095, 39.8910],
        blurb: "Historic mosque where the Prophet (peace be upon him) prayed on Tarwiyah.",
        pilgrimNote: "Optional visit; many prophets are said to have prayed here.",
      },
      {
        id: "masjid-bayah",
        name: "Masjid al-Bayah",
        arabicName: "مَسْجِد ٱلْبَيْعَة",
        coords: [21.4165, 39.8805],
        blurb: "Site of the pledge of allegiance, near Jamrat al-Aqaba.",
        pilgrimNote: "Historic stop; not a required ritual point.",
      },
    ],
  },
  muzdalifah: {
    siteId: "muzdalifah",
    boundaryLabel: "Muzdalifah plain (approx.)",
    // Lens-shaped plain between Wadi Muhassir (west, toward Mina) and the
    // Ma'zamayn pass (east, toward Arafat); wider in the middle.
    boundary: [
      [21.3885, 39.9180],
      [21.3915, 39.9255],
      [21.3925, 39.9340],
      [21.3915, 39.9430],
      [21.3880, 39.9510],
      [21.3820, 39.9545],
      [21.3760, 39.9520],
      [21.3725, 39.9445],
      [21.3720, 39.9360],
      [21.3735, 39.9275],
      [21.3775, 39.9210],
      [21.3830, 39.9180],
      [21.3885, 39.9180],
    ],
    landmarks: [
      {
        id: "mashar",
        name: "Al-Mash'ar al-Haram",
        arabicName: "ٱلْمَشْعَر ٱلْحَرَام",
        coords: [21.3830, 39.9370],
        blurb: "Open plain — Maghrib and Isha combined after leaving Arafat.",
        pilgrimNote: "Rest under the sky; gather pebbles for the Jamarat.",
      },
    ],
  },
  arafat: {
    siteId: "arafat",
    boundaryLabel: "Plain of Arafat (approx.)",
    boundary: [
      [21.3690, 39.9585],
      [21.3725, 39.9720],
      [21.3710, 39.9940],
      [21.3600, 39.9965],
      [21.3490, 39.9900],
      [21.3420, 39.9780],
      [21.3480, 39.9580],
      [21.3690, 39.9585],
    ],
    landmarks: [
      {
        id: "jabal-rahmah",
        name: "Jabal ar-Rahmah",
        arabicName: "جَبَل ٱلرَّحْمَة",
        coords: [21.35472, 39.98389],
        blurb: "The Mount of Mercy — heart of the plain where millions stand in Wuquf.",
        pilgrimNote: "Optional to climb; valid Wuquf is anywhere in the plain of Arafat.",
      },
      {
        id: "masjid-namirah",
        name: "Masjid Namirah",
        arabicName: "مَسْجِد نِمْرَة",
        coords: [21.35296, 39.96675],
        blurb: "Khutbah and combined Dhuhr/Asr on the Day of Arafah; Farewell Sermon site.",
        pilgrimNote: "Very crowded at Dhuhr; most pilgrims pray in their camps. Part of the mosque lies in Wadi Uranah — follow your group's fiqh.",
      },
      {
        id: "wuquf-plain",
        name: "Plain of Wuquf",
        arabicName: "سَاحَة عَرَفَات",
        coords: [21.3555, 39.9820],
        blurb: "The standing (Wuquf) from midday until sunset is the essence of Hajj.",
        pilgrimNote: "Face the qiblah, make du'a and dhikr until sunset on 9 Dhul-Hijjah.",
      },
    ],
  },
};

export function getSiteDetail(siteId: LocationId): SiteDetail {
  return siteDetails[siteId];
}
