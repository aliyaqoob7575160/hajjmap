export type LocationId = "haram" | "mina" | "muzdalifah" | "arafat";

export interface HajjLocation {
  id: LocationId;
  name: string;
  arabicName: string;
  coords: [number, number];
  blurb: string;
}

export interface Dua {
  id: string;
  title: string;
  occasion: string;
  arabic: string;
  transliteration: string;
  translation: string;
  story: { whoSaidIt: string; significance: string };
  source: string;
}

export interface TimelineEvent {
  id: string;
  time: string;
  title: string;
  locationId: LocationId;
  description: string;
  duaIds: string[];
}

export interface HajjDay {
  id: "8" | "9" | "10" | "11" | "12" | "13";
  hijriLabel: string;
  name: string;
  subtitle: string;
  camera: { focus: LocationId[]; primary: LocationId };
  events: TimelineEvent[];
}

export const locations: Record<LocationId, HajjLocation> = {
  haram:      { id: "haram",      name: "Al-Masjid al-Haram", arabicName: "ٱلْمَسْجِد ٱلْحَرَام", coords: [21.4225, 39.8262], blurb: "The Sacred Mosque around the Kaaba — Tawaf, Sa'i, and Zamzam." },
  mina:       { id: "mina",       name: "Mina",               arabicName: "مِنَى",              coords: [21.4130, 39.8930], blurb: "The valley of tents and the three Jamarat." },
  muzdalifah: { id: "muzdalifah", name: "Muzdalifah",         arabicName: "ٱلْمُزْدَلِفَة",       coords: [21.3830, 39.9370], blurb: "The open plain — rest the night of the 9th, gather pebbles." },
  arafat:     { id: "arafat",     name: "Arafat",             arabicName: "عَرَفَات",            coords: [21.3550, 39.9840], blurb: "The plain and Mount of Mercy where the Standing takes place." },
};

export const duas: Record<string, Dua> = {
  talbiyah: {
    id: "talbiyah",
    title: "The Talbiyah",
    occasion: "Recited continuously from entering ihram until the first stoning on the 10th.",
    arabic: "لَبَّيْكَ اللَّهُمَّ لَبَّيْكَ، لَبَّيْكَ لَا شَرِيكَ لَكَ لَبَّيْكَ، إِنَّ الْحَمْدَ وَالنِّعْمَةَ لَكَ وَالْمُلْكَ، لَا شَرِيكَ لَكَ",
    transliteration: "Labbayka Allahumma labbayk, labbayka la sharika laka labbayk, inna l-hamda wa n-ni'mata laka wa l-mulk, la sharika lak.",
    translation: "Here I am, O Allah, here I am. Here I am, You have no partner, here I am. Surely all praise, grace and dominion belong to You. You have no partner.",
    story: { whoSaidIt: "Taught by the Prophet Muhammad (peace be upon him); it echoes the call of Ibrahim.", significance: "When Ibrahim finished raising the Kaaba, Allah commanded him to proclaim the pilgrimage to mankind (Qur'an 22:27). The Talbiyah is the believer's answer — 'labbayk' means 'I respond, and I respond again.' Saying it, a pilgrim joins an unbroken chorus stretching back thousands of years." },
    source: "Sahih al-Bukhari 1549; Sahih Muslim 1184. Qur'an 22:27.",
  },
  arafahTahlil: {
    id: "arafahTahlil",
    title: "The Supplication of the Day of Arafah",
    occasion: "During the Standing (Wuquf) at Arafat on 9 Dhul-Hijjah, from after Dhuhr until sunset.",
    arabic: "لَا إِلَهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ، لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ، وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
    transliteration: "La ilaha illa Allahu wahdahu la sharika lah, lahu l-mulku wa lahu l-hamd, wa huwa 'ala kulli shay'in qadir.",
    translation: "There is no god but Allah alone, with no partner. His is the dominion, His is all praise, and He has power over all things.",
    story: { whoSaidIt: "The Prophet Muhammad (peace be upon him).", significance: "The Prophet said the best supplication is that of the Day of Arafah, and the best he and the prophets before him said is this declaration of God's oneness. Arafah is the essence of the pilgrimage — 'Hajj is Arafah' — the day the religion was perfected (Qur'an 5:3) and the day Allah frees the most people from the Fire." },
    source: "Jami' at-Tirmidhi 3585; Sahih Muslim 1348. Qur'an 5:3.",
  },
  sai: {
    id: "sai",
    title: "Sa'i — Safa and Marwah",
    occasion: "Walking seven times between Safa and Marwah (during Umrah and after Tawaf al-Ifadah).",
    arabic: "إِنَّ الصَّفَا وَالْمَرْوَةَ مِنْ شَعَائِرِ اللَّهِ، فَمَنْ حَجَّ الْبَيْتَ أَوِ اعْتَمَرَ فَلَا جُنَاحَ عَلَيْهِ أَنْ يَطَّوَّفَ بِهِمَا",
    transliteration: "Inna s-safa wa l-marwata min sha'a'iri Llah, faman hajja l-bayta awi'tamara fala junaha 'alayhi an yattawwafa bihima.",
    translation: "Indeed, Safa and Marwah are among the symbols of Allah. So whoever makes Hajj to the House or performs Umrah, there is no blame upon him for walking between them.",
    story: { whoSaidIt: "Qur'an 2:158; the rite commemorates Hajar, wife of Ibrahim.", significance: "Left in the barren valley with the infant Ismail, Hajar ran seven times between the hills of Safa and Marwah searching for water, until the spring of Zamzam gushed forth by Allah's mercy. Her trust and striving are honoured by every pilgrim who walks the same path. The Prophet said: 'That is why people run between them.'" },
    source: "Qur'an 2:158; Sahih al-Bukhari 3364.",
  },
  tawaf: {
    id: "tawaf",
    title: "Supplication during Tawaf",
    occasion: "Circling the Kaaba seven times; said especially between the Yemeni Corner and the Black Stone.",
    arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
    transliteration: "Rabbana atina fi d-dunya hasanatan wa fi l-akhirati hasanatan wa qina 'adhaba n-nar.",
    translation: "Our Lord, give us good in this world and good in the Hereafter, and protect us from the punishment of the Fire.",
    story: { whoSaidIt: "Qur'an 2:201; the Prophet recited it between the two corners.", significance: "There is no fixed wording for each circuit of Tawaf — the pilgrim may make any du'a or dhikr. The Prophet used to say this comprehensive verse between the Yemeni Corner and the Black Stone. Tawaf circles the first house built for the worship of Allah, raised by Ibrahim and Ismail (Qur'an 2:127)." },
    source: "Qur'an 2:201; Sunan Abi Dawud 1892.",
  },
  jamarat: {
    id: "jamarat",
    title: "Stoning the Jamarat",
    occasion: "With each of the seven pebbles thrown at each pillar (10th–13th Dhul-Hijjah).",
    arabic: "اللَّهُ أَكْبَر",
    transliteration: "Allahu Akbar.",
    translation: "Allah is the Greatest.",
    story: { whoSaidIt: "Said with each pebble; the rite recalls Ibrahim rejecting Shaytan.", significance: "At Mina, Shaytan tried to turn Ibrahim away from obeying Allah's command to sacrifice his son. Ibrahim drove him off by pelting him with pebbles. Casting the stones is an outward act of rejecting temptation and reaffirming obedience to Allah. On the 10th, only the large pillar (Jamrat al-Aqaba) is stoned; on the 11th–13th, all three are stoned in order." },
    source: "Reported from Ibn Abbas; cf. Sahih al-Bukhari, the rites of Hajj.",
  },
  muzdalifah: {
    id: "muzdalifah",
    title: "Remembrance at Muzdalifah",
    occasion: "The night of the 10th and after Fajr at al-Mash'ar al-Haram.",
    arabic: "فَإِذَا أَفَضْتُمْ مِنْ عَرَفَاتٍ فَاذْكُرُوا اللَّهَ عِنْدَ الْمَشْعَرِ الْحَرَامِ، وَاذْكُرُوهُ كَمَا هَدَاكُمْ",
    transliteration: "Fa-idha afadtum min 'arafatin fadhkuru Llaha 'inda l-mash'ari l-haram, wadhkuruhu kama hadakum.",
    translation: "And when you depart from Arafat, remember Allah at the Sacred Site (al-Mash'ar al-Haram), and remember Him as He has guided you.",
    story: { whoSaidIt: "Qur'an 2:198; the practice of the Prophet (peace be upon him).", significance: "After the Standing at Arafat, pilgrims rest the night under the open sky at Muzdalifah and gather pebbles for the stoning. After Fajr the Prophet faced the qiblah and made much du'a, takbir and tahlil at al-Mash'ar al-Haram until the sky grew bright." },
    source: "Qur'an 2:198; Sahih Muslim 1218 (Hajj of the Prophet).",
  },
  takbirTashriq: {
    id: "takbirTashriq",
    title: "The Takbir of Tashriq",
    occasion: "After every obligatory prayer from Fajr of the 9th until Asr of the 13th.",
    arabic: "اللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ، لَا إِلَهَ إِلَّا اللَّهُ، وَاللَّهُ أَكْبَرُ اللَّهُ أَكْبَرُ، وَلِلَّهِ الْحَمْدُ",
    transliteration: "Allahu akbar, Allahu akbar, la ilaha illa Llah, wa-Llahu akbar, Allahu akbar, wa li-Llahi l-hamd.",
    translation: "Allah is the Greatest, Allah is the Greatest, there is no god but Allah; Allah is the Greatest, Allah is the Greatest, and to Allah belongs all praise.",
    story: { whoSaidIt: "Practised by the Companions, e.g. Ibn Mas'ud and Ibn Abbas.", significance: "The days of Eid and Tashriq are days of remembrance: 'And remember Allah during the appointed days' (Qur'an 2:203). The takbir fills Mina with the proclamation of Allah's greatness throughout the days of Hajj." },
    source: "Qur'an 2:203; reported from the Companions (e.g. Musannaf Ibn Abi Shaybah).",
  },
};

export const days: HajjDay[] = [
  { id: "8", hijriLabel: "8 Dhul-Hijjah", name: "Yawm at-Tarwiyah", subtitle: "The day of setting out — Makkah to Mina", camera: { focus: ["haram", "mina"], primary: "mina" }, events: [
    { id: "8-1", time: "Morning",        title: "Enter ihram and intend Hajj",   locationId: "haram", description: "Pilgrims performing Tamattu enter ihram from their lodging in Makkah, make the intention for Hajj, and begin the Talbiyah.", duaIds: ["talbiyah", "H2", "P18"] },
    { id: "8-2", time: "Before midday",  title: "Travel to Mina",                locationId: "mina",  description: "The pilgrims move to Mina, reciting the Talbiyah along the way.", duaIds: ["talbiyah"] },
    { id: "8-3", time: "Midday onward",  title: "Five prayers in Mina",          locationId: "mina",  description: "Dhuhr, Asr, Maghrib, Isha, and the Fajr of the 9th are prayed shortened (not combined) in Mina; the night is spent there.", duaIds: [] },
  ] },
  { id: "9", hijriLabel: "9 Dhul-Hijjah", name: "Yawm al-Arafah", subtitle: "The Day of Arafah — the heart of Hajj", camera: { focus: ["mina", "arafat", "muzdalifah"], primary: "arafat" }, events: [
    { id: "9-1", time: "After sunrise",          title: "Depart Mina for Arafat",                 locationId: "arafat",     description: "After praying Fajr in Mina, the pilgrims set out for the plain of Arafat, reciting the Talbiyah and takbir.", duaIds: ["talbiyah"] },
    { id: "9-2", time: "Midday (Dhuhr)",         title: "The sermon & combined prayer at Namirah", locationId: "arafat",     description: "Dhuhr and Asr are prayed shortened and combined at the time of Dhuhr, following the Prophet's farewell example.", duaIds: ["takbirTashriq"] },
    { id: "9-3", time: "Afternoon until sunset", title: "The Standing (Wuquf) at Arafat",          locationId: "arafat",     description: "Facing the qiblah with raised hands, the pilgrim pours out supplication until sunset. This standing is the essential pillar of Hajj.", duaIds: ["arafahTahlil", "talbiyah"] },
    { id: "9-4", time: "After sunset",           title: "Move to Muzdalifah",                      locationId: "muzdalifah", description: "Leaving Arafat calmly after sunset, the pilgrims travel to Muzdalifah, reciting the Talbiyah along the way.", duaIds: ["talbiyah"] },
    { id: "9-5", time: "On arrival",             title: "Pray Maghrib and Isha (combined)",        locationId: "muzdalifah", description: "On reaching Muzdalifah, Maghrib (3 rak'ahs) and Isha (shortened to 2 rak'ahs) are prayed together at the time of Isha, with a single adhan and two iqamahs, following the Prophet's practice.", duaIds: [] },
    { id: "9-6", time: "Through the night",      title: "Rest under the open sky",                 locationId: "muzdalifah", description: "Pilgrims spend the night at Muzdalifah. Staying until after midnight is required by the majority; remaining until Fajr follows the Prophet's example. The weak, women, and children may leave for Mina after the moon sets.", duaIds: ["muzdalifah"] },
    { id: "9-7", time: "Before leaving",         title: "Gather pebbles for the Jamarat",          locationId: "muzdalifah", description: "Pilgrims collect small pebbles (roughly the size of a chickpea) for the stoning at Mina.\n\nCount needed:\n• 10th — 7 pebbles for Jamrat al-Aqaba\n• 11th — 21 pebbles (7 at each of the three pillars)\n• 12th — 21 pebbles (7 at each of the three pillars)\n• 13th — 21 pebbles (only if staying — see Day 12 Ta'ajjul)\n\nTotal: 49 pebbles if leaving on the 12th, or 70 pebbles if staying until the 13th. Many pilgrims gather a few extra in case some are dropped. Pebbles may also be collected at Mina; gathering them at Muzdalifah is the Sunnah but not required from this exact spot.", duaIds: [] },
  ] },


  { id: "10", hijriLabel: "10 Dhul-Hijjah", name: "Yawm an-Nahr", subtitle: "The Day of Sacrifice — Eid al-Adha", camera: { focus: ["muzdalifah", "mina", "haram"], primary: "mina" }, events: [
    { id: "10-1", time: "Before sunrise",  title: "Remembrance at al-Mash'ar al-Haram", locationId: "muzdalifah", description: "After Fajr at Muzdalifah, the pilgrims make du'a and takbir, then leave for Mina before sunrise.", duaIds: ["muzdalifah", "takbirTashriq"] },
    { id: "10-2", time: "Morning",         title: "Stone Jamrat al-Aqaba",              locationId: "mina",       description: "Seven pebbles are cast at the large pillar, saying 'Allahu Akbar' with each. The Talbiyah stops with the first pebble.", duaIds: ["jamarat"] },
    { id: "10-3", time: "After stoning",   title: "Sacrifice and shaving",              locationId: "mina",       description: "The pilgrim offers the sacrifice (Hady), then shaves or trims the hair (Halq/Taqsir), leaving the state of ihram.", duaIds: ["takbirTashriq"] },
    { id: "10-4", time: "Then",            title: "Tawaf al-Ifadah and Sa'i",           locationId: "haram",      description: "The pilgrim goes to Makkah for the essential Tawaf al-Ifadah and the Sa'i between Safa and Marwah, then returns to Mina.", duaIds: ["tawaf", "sai"] },
  ] },
  { id: "11", hijriLabel: "11 Dhul-Hijjah", name: "Ayyam at-Tashriq (1)", subtitle: "First day of Tashriq in Mina", camera: { focus: ["mina"], primary: "mina" }, events: [
    { id: "11-1", time: "After Dhuhr", title: "Stone the three Jamarat", locationId: "mina", description: "All three pillars are stoned in order — the small (Sughra), the middle (Wusta), then the large (Aqaba) — seven pebbles each, with du'a after the first two.", duaIds: ["jamarat"] },
    { id: "11-2", time: "Throughout",  title: "Nights and remembrance in Mina", locationId: "mina", description: "The night is spent in Mina; the takbir of Tashriq is repeated after the prayers and throughout the day.", duaIds: ["takbirTashriq"] },
  ] },
  { id: "12", hijriLabel: "12 Dhul-Hijjah", name: "Ayyam at-Tashriq (2)", subtitle: "Second day of Tashriq — optional early departure", camera: { focus: ["mina"], primary: "mina" }, events: [
    { id: "12-1", time: "After Dhuhr", title: "Stone the three Jamarat", locationId: "mina", description: "The three pillars are stoned again in order, seven pebbles each.", duaIds: ["jamarat"] },
    { id: "12-2", time: "Before sunset", title: "Optional departure (Ta'ajjul)", locationId: "mina", description: "Whoever wishes may leave Mina before sunset (Ta'ajjul); whoever stays completes the 13th. Both are permitted (Qur'an 2:203).", duaIds: ["takbirTashriq"] },
  ] },
  { id: "13", hijriLabel: "13 Dhul-Hijjah", name: "Ayyam at-Tashriq (3)", subtitle: "Final day of Tashriq and the farewell", camera: { focus: ["mina", "haram"], primary: "haram" }, events: [
    { id: "13-1", time: "After Dhuhr", title: "Stone the three Jamarat", locationId: "mina", description: "For those who stayed, the three pillars are stoned a final time, seven pebbles each.", duaIds: ["jamarat"] },
    { id: "13-2", time: "Before leaving Makkah", title: "Tawaf al-Wada (the farewell)", locationId: "haram", description: "The last act before leaving is the farewell Tawaf around the Kaaba, so the pilgrim's final moment in the Sacred Mosque is at the House of Allah.", duaIds: ["tawaf"] },
  ] },
];
