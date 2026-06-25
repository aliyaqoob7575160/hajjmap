// English-only duas imported verbatim from the MAC London "English Dua List"
// (compiled originally by Thurrock Muslim Parents Society, edited by MAC London).
// Do not paraphrase. Arabic is intentionally null — this collection is
// English-only supplications, grouped by intention.

import type { LibraryDua } from "./duas-library";

export type GeneralSubCategory =
  | "parenting_home"
  | "for_children"
  | "for_parents_family"
  | "for_spouse"
  | "for_friends"
  | "for_oppressed"
  | "for_others"
  | "self_character"
  | "self_knowledge"
  | "self_dunya"
  | "self_deen"
  | "self_death"
  | "final";

export const generalSubCategoryLabels: Record<GeneralSubCategory, string> = {
  parenting_home: "Parenting & Home",
  for_children: "For My Children",
  for_parents_family: "For My Parents & Family",
  for_spouse: "For My Spouse",
  for_friends: "For My Friends",
  for_oppressed: "Oppressed & Allah's Path",
  for_others: "For Others",
  self_character: "Self · Character",
  self_knowledge: "Self · Knowledge & Skills",
  self_dunya: "Self · Dunya",
  self_deen: "Self · Deen",
  self_death: "Self · Death & Hereafter",
  final: "Final Duas",
};

export const generalSubCategoryOrder: GeneralSubCategory[] = [
  "parenting_home",
  "for_children",
  "for_parents_family",
  "for_spouse",
  "for_friends",
  "for_oppressed",
  "for_others",
  "self_character",
  "self_knowledge",
  "self_dunya",
  "self_deen",
  "self_death",
  "final",
];

const SOURCE = "MAC London — English Dua List";

function make(
  subCat: GeneralSubCategory,
  idx: number,
  text: string,
  title?: string,
): LibraryDua {
  const prefix: Record<GeneralSubCategory, string> = {
    parenting_home: "G-PAR",
    for_children: "G-CHI",
    for_parents_family: "G-FAM",
    for_spouse: "G-SPS",
    for_friends: "G-FRD",
    for_oppressed: "G-OPP",
    for_others: "G-OTH",
    self_character: "G-CHR",
    self_knowledge: "G-KNW",
    self_dunya: "G-DUN",
    self_deen: "G-DEN",
    self_death: "G-DTH",
    final: "G-FIN",
  };
  return {
    id: `${prefix[subCat]}-${idx}`,
    category: "general",
    title: title ?? generalSubCategoryLabels[subCat],
    arabic: null,
    transliteration: null,
    translation: text,
    source: SOURCE,
    ritual: null,
    locationMarker: null,
    note: null,
    crossRef: null,
    tags: [subCat],
    hajjLocation: false,
    instructionOnly: false,
    subCategory: subCat,
  };
}

const parenting: string[] = [
  "Ya (Oh) Allah, I turn to You in humility for Your help in parenting my children. Assist me with physical & emotional strength to be a good parent and an example to my children.",
  "Ya Allah, I know that our children are an amaanah/trust from You, to care for and to raise in a manner that is pleasing to You. Help me do that in the best way.",
  "Teach me how to love in a way that You would have me love. Help me where I need to be healed, improved, nurtured, and made whole.",
  "Help me walk in righteousness and integrity so that You may always be pleased with me.",
  "Allow me to be a God-fearing role model with all the communication, teaching, and nurturing skills that I may need.",
  "Ya Allah help me to connect with my children. Help me to bond with them at a level where the love and affection is strong, where there is openness, respect and where shaytaan is unable to infiltrate.",
  "Please Allah, keep our family always happy and wholesome and a source of goodness so that the light of the family guides every individual in the family and protects them from the evils of the dunya.",
  "Keep our home safe so it is a sanctuary against the evil of society. Help us to create an environment where our home is more inviting to our kids than places of evil.",
  "Please Allah grant us barakah in our time so that time is ample for strengthening family relations and much of our time is utilized as such.",
  "Ya Allah please remove the usage of harsh language and course mannerisms in our home. Maintain respect, kindness, gratitude and mercy and help my children to carry those values to the homes they create in the future.",
  "Help me to know what to say to my children that will open up our pathways of communication so that they find it easy to talk to me and do not ever feel the need to hide things from me out of fear or shame.",
  "Help my spouse and I to be the best Muslims we can be, so that we are the best role models to our children. Help me to not be a hypocrite and force my children to behave in a way that I do not aspire to behave.",
  "The family is the cornerstone of a stable society so please strengthen my family with imaan so that we are proud flag bearers of Islam and through our stable, solid family unit may the ummah be strengthened in both unity and Imaan.",
];

const children: string[] = [
  "Ya Allah, You know what our children need. Help and guide us in praying for our children.",
  "Ya Allah, put a hedge of safety around our children. Protect their bodies, minds, and emotions from any kind of evil and harm.",
  "Ya Allah, I pray that You protect them from accidents, diseases, injuries, and any other physical, mental, or emotional afflictions and abuse.",
  "Ya Allah, I pray that You keep our children free from any addictions and vices.",
  "Draw them close to You for protection from every ill and evil influence of our society, whether it's apparent to us or not.",
  "Guide their inclinations so that in an adverse situation their feeling would be to turn to You first and then to the family instead of turning to dunya.",
  "Ya Allah, grant them the best of company as their friends — people who will inspire them to love, worship and obey You.",
  "Ya Allah, grant our children hidaaya/guidance and a heart that loves to obey You.",
  "Shine Your light on any secret or unseen rebellion in their hearts and destroy it before it takes root.",
  "Ya Allah, guide them away from any pride, selfishness, jealousy, hypocrisy, malice, and greed and make them uncomfortable with sins.",
  "Penetrate their hearts with Your love and reverence today and always.",
  "Ya Allah, make apparent to them the truth in any situation and let them not be misled by falsehood.",
  "Ya Allah, grant our children the ability to make clear decisions and let them always be attracted to good things that are pure, noble, true, and just.",
  "Ya Allah, guide them in making choices that please You.",
  "Ya Allah, help them to taste the sweetness of walking with a humble spirit in obedience and submission to You.",
  "Ya Allah, grant them the wisdom to choose their words carefully and bless them with a generous and caring spirit.",
  "Ya Allah, I pray that they never stray from the path of deen and that You give them a future filled with Your best promises.",
  "Ya Allah, always keep our children cleansed and pure from evil and shaytaan.",
  "Ya Allah, keep them steadfast in establishing Salaah and help them revere the Glorious Quran as Your Word and Law and to read it with understanding daily. Let it be their source of light and guidance.",
  "Ya Allah, let our daughters love wearing hijab and our sons the dress of a humble Muslim. Let their dress be a representation of their Imaan and of their love and respect for Your commands.",
  "Lead them to a position where they rely truly on Your power alone and fear You in the open and in secret.",
  "Ya Allah, make them so strong in their deen that they never encounter doubt.",
  "Ya Allah, do not allow any negative attitudes in the place of our children's lives.",
  "Ya Allah, guide our children in honouring and obeying You, Your Prophet (peace be upon him), and us as parents (when we are commanding that which is pleasing to You).",
  "Ya Allah, fill our children with compassion and caring that will overflow to each member of our family.",
  "Ya Allah, help them love, value, appreciate, and respect one another with good communication between them always.",
  "Ya Allah, drive out any division between our children and bring them healing.",
  "I pray there be no strain, breach, misunderstanding, arguing, fighting, or severing of ties.",
  "Ya Allah, allow them to one day marry righteous, God-fearing, kind, hard-working, intelligent, healthy spouses who get along with and respect and love every member of our family and who lead our children (i.e. their spouses) even closer to You and Jannat ul Firdaus.",
  "Ya Allah, please grant me the company of pious friends, relatives, extended community members, and teachers who will be inspirational role models for my children and will help me raise them to be the best of believers.",
  "Ya Allah, please don't let me become self-satisfied and arrogant in my parenting, but please don't humble me or shame me through my children's misdeeds either. Please let me always give credit for their good character to You and please don't ever let me stop praying for them.",
  "Ya Allah, protect my children from debt. Make them givers and not takers.",
  "Ya Allah, grant my children noble professions with halal incomes that give them respect and dignity in Your Eyes and in the eyes of their fellow human beings.",
  "Ya Allah, grant them worldly comfort so that my children can come to You through the Door of Gratitude and so that they are not forced to come to You through the Door of Patience.",
  "Please let them always be grateful…and patient.",
  "Ya Allah, I pray for a close, loving, happy and fulfilling relationship with them for all the days of our lives and to be reunited with them in Jannat ul Firdaus.",
  "Ya Allah Save our children from the impact of our mistakes in their lives.",
  "Ya Allah Make our children the coolness of our eyes, grant them piety and make them sawaab-e-jaariya for me & my spouse.",
  "Ya Allah make them Hufaadh, who act upon what they have memorised, and teach it to others.",
  "Ya Allah Make our children workers for Your Deen, da'ees, imaams, scholars and shaheeds.",
  "Ya Allah Grant our children success in Deen, duniya & Aakhirah & grant us a lineage of righteous offspring until Yawm al Qiyaamah.",
  "Ya Allah Unite our entire lineage in Jannah Al Firdaus.",
  "Ya Allah Make them become the reason for our place in Jannah & shield against the Hellfire.",
];

const parentsFamily: string[] = [
  "Ya Allah, You are Al Gaffaar. Forgive my parents. Reward them in the greatest measures in this dunya & akhirah.",
  "Ya Allah Elevate their ranks and grant them Jannah al Firdaus. Make me coolness of their eyes in their old age.",
  "Ya Allah Grant my siblings success in this dunya & akhirah. Guide them and all relatives on the straight path, fill their hearts with desire for Islam.",
  "Ya Allah, Bind my siblings together with love. Do not let shayaateen break our bond.",
  "Allah, Lead them to pious spouses and adorn their marriages with taqwa/God consciousness and bless them with a pious and healthy offspring.",
  "Ya Allah Elevate the ranks of my parents, spouse's parents, my sisters & brothers, my elders & entire Ummah.",
  "Ya Allah Protect my family from evil, calamities, enviers & the shayaateen from man & jinn.",
  "Allah, make them of Ahlul (people of the) Quran, guide them to the sunnah and protect them from bi'dah (innovation).",
  "Ya Allah grant them good health, protect them from illnesses, diseases and difficulties of old age.",
  "Ya Allah save me & my entire family from the Hell Fire & make us enter Jannah without being accounted.",
  "Ya Allah Forgive the sins of those who have passed away in my family & the Ummah - young & old.",
  "Ya Allah Grant them a peaceful time in the barzakh (period between a person's death and his resurrection on the Day of Qiyama) till they meet You and save us from trials of Dajjal, Yujuj & Majuj & the last Day.",
];

const spouse: string[] = [
  "Ya Allah Reward my spouse Your best reward for her/his striving for my family.",
  "Ya Allah, Shield, increase & protect the love and barakah/blessings between me & my spouse for as long as we live.",
  "Ya Allah Improve our behavior with each other and guide us to have the best character with each other.",
  "Ya Allah Make the Quran & Your Commands be our judge in all matters.",
  "Ya Allah Strengthen our practice of the deen together.",
  "Ya Allah Make us join together in bliss in Jannah al Firdaus.",
  "Allah, Help us be good wives to our husbands and good husband to our wives.",
  "Ya Allah, Protect our marriage against waswasa (whispers of shaytan) and place mercy between us.",
];

const friends: string[] = [
  "Ya Allah, never stop guiding them, their spouses and children on the right path.",
  "Ya Allah, help them with memorising and practising the Qur'an.",
  "Ya Allah, lead them to pious spouses and grant them righteous children.",
  "Ya Allah, grant them health and yaqeen/certainty.",
  "Ya Allah, help them play a beneficial role in the Ummah.",
  "Ya Allah, protect their marriages and their religion.",
  "Ya Allah, protect them from the horror of day al Qiyama and grant them Jannatul Firdaws and protect them from the Fire.",
  "Ya Allah Unite the hearts of my worldly companions who work for You & strengthen our brotherhood/sisterhood.",
  "Ya Allah make our relationship stronger by serving you and remembering you whilst together.",
];

const oppressed: string[] = [
  "Ya Allah , the Most Powerful and Magnificent! Ya Allah bring the downfall of those who oppress, and protect the oppressed (you can cite some examples).",
  "Ya Allah, verily we ask you to disperse the efforts of such oppressors and to shake the ground from beneath their feet and strike terror into their hearts.",
  "Ya Allah, divide the opressors against one another and disperse their unity and strike heavy discord amongst their ranks, and make them flee to their destruction, and make an example of them for those who are heedless.",
  "Allah grant aid and victory to our brothers who work in the path of Allah, unite their ranks and bring them together upon the word of truth.",
  "Ya Allah, direct their aim and strengthen their support, and make them steadfast and send upon them your tranquillity. Heal their hearts and guide them to all that is good.",
  "Ya Allah, give them authority and leadership, and aid them with your Army of the Heavens and the Earth, O Lord of the Worlds. And peace and blessings of Allah be upon His Messenger and his family and all the companions.",
  "Ya Allah, Grant the spouses, children and families of those struggling in the path of Allah strength, wisdom, patience, peace & blessings.",
  "Ya Allah Protect my brothers & sisters in prisons (name each place that you are concerned about or can think of) across the warzones & from the persecution, rape, slaughter, humiliation. Relieve their sufferings & elevate their ranks.",
];

const others: string[] = [
  "Ya Allah, relieve the hungry, take care of the single mother, widows & orphans and Muslims with physical diseases and psychological diseases, reward them all with Jannatul Firdaws.",
  "Ya Allah, give guidance to our youth, our scholars and our leaders.",
  "Ya Allah save my non-Muslim friends from the Fire. Guide them to Islam.",
  "Ya Allah Unite the hearts of those undergoing family/marital difficulties.",
  "Ya Allah Grant your perfect cure to those who are sick.",
];

const character: string[] = [
  "Ya Allah, help me to say words of truth in the face of the mighty.",
  "Ya Allah, Protect us against the evil of our tongues and lead us to the best character.",
  "Ya Allah, should you give me wealth, do not take away my happiness.",
  "And should you give me might, do not take away my wisdom.",
  "And should you give me success do not take away my humility.",
  "And should you give me modesty do not take away my sense of dignity.",
  "Ya Allah, teach me to love others as I love myself.",
  "And teach me to judge myself as I judge others.",
  "And teach me that forgiveness is one of the greatest steps towards strength.",
  "Ya Allah, do not curse me with arrogance should I be successful.",
  "And neither with despair and hopelessness should I fail.",
  "Ya Allah, remind me always that failure is the trial that precedes success.",
  "Should you take away my wealth, do let me keep my hopefulness.",
  "And should I fail, do let me keep the power of determination.",
  "And should you take away the blessing of good health do let me keep the blessing of faith.",
  "Ya Allah, should I have harmed others give me the courage to apologize and do tawbah/repentance.",
  "And should others harm me, bless me with the courage to forgive.",
  "And should I forget you Ya Allah I beg that you should not exclude me from your compassion.",
  "Ya Rabb, Purify my intentions for Your Sake alone and let me not show off or take false pride.",
  "Cleanse my heart from malice, jealousy, hatred, self-admiration, envy, arrogance and pride.",
  "Ya Allah increase me in gratitude towards You alone.",
  "Grant me soft speech, protect my tongue from lying, backbiting and hurting others. Grant me beautiful patience, and obedience to you.",
  "Help me see my faults and cover it from others.",
  "Allow me to speak with wisdom just like the Prophet (peace be upon him).",
  "Help me be courageous, confident and a positive person who makes the correct decisions at the right time.",
  "Ya Allah Bless me with happiness in this dunya & akhirah, protect me from sadness, depression and anxiety.",
];

const knowledge: string[] = [
  "Ya Allah, Grant me excellent memory and understanding of the deen with evidence.",
  "Ya Allah, Increase our 'ilm/knowledge, help us to practise it and give da'wah.",
  "Ya Allah, Protect us against knowledge that doesn't benefit us.",
  "Ya Allah, Help us to memorise the Qur'an, recite it daily, allow it to bring mercy in our heart, make it our medicine and a good argument for us on Yawm al Qiyama.",
  "Ya Allah, Help us do deeds that will take us to Jannatul Firdaws.",
  "Help me understand, write, speak and teach Arabic.",
  "Ya Allah grant me the strength to battle laziness and sleep, so I may wake up for Tahajjud and Fajr everyday.",
];

const dunya: string[] = [
  "Help me maintain good ties with my relatives.",
  "Bestow me with wealth to spend in your way.",
  "Ya Allah increase me in Your Blessings and make my Rizq/provision halal.",
  "Do not let others humiliate/oppress/mock/take advantage of me.",
  "Grant me modesty in clothing and speech.",
  "Ya Allah, Give us a role in the Ummah that lead us to good deeds which will counts for us after our death and support us in our ideas in working/projects for the Ummah.",
  "Ya Allah, bless me with good health, so I can make sajdah/prostration with ease till my dying day.",
  "Ya Allah, Let me enjoy a good hearing, sight and body throughout my life span and use them for 'ibadah/worship.",
  "Ya Allah, support me and draw me close to You if something happens to my spouse.",
  "Ya Allah, Help me to pray on time, pray the sunnah and Qiyam ul-Layl and dhikr/remembrance.",
  "Ya Allah, Grant me with a healthy and pious offspring as soon as is good for me and ease and health for the mother.",
  "Ya Allah, Protect me from the hands of the kuffaar/disbelievers.",
  "Ya Allah, Protect us from poverty and debts.",
  "Ya Allah, Support me by giving me strength, wisdom, patience to bear the events of Qadr/destiny and to pass the test.",
  "Ya Allah, invite me to your blessed lands, Mecca and Madina for Hajj and Umrah time and time again!",
  "Ya Allah, Make my life a source of abundance of all good and do not make this world my concern.",
];

const deen: string[] = [
  "Fill my heart with Emaan/faith.",
  "Ya Allah Help us to Love Allah [swt] and the Prophet [saws] the most, and I beg of Your love and the love of those who love You and I ask of You such deeds which will bring me Your love.",
  "Ya Allah, Remove the love for this dunya from our hearts.",
  "Ya Allah, Let our heart never turn away from Islam and fill our hearts with desire for Islam.",
  "Ya Allah, Turner of Hearts, turn our hearts toward Your obedience.",
  "O Controller of the hearts, make my heart steadfast in Your religion.",
  "Ya Allah, Never stop leading and guiding us.",
  "Ya Allah, Make us part of Your Victory, live a praiseworthy life and die for Your cause.",
  "Ya Allah Forgive my sins, a complete forgiveness that leaves no trace.",
  "Ya Allah Forgive my transgressions of Your Commands.",
  "Ya Allah Grant me victory over my shortcomings.",
  "Reform and upgrade me Ya Allah in the best way possible, in the way you know that is best for me.",
  "Ya Allah Accept my duaas, ibaadah & deeds, perfect my worship.",
  "Ya Allah Guide me towards performing good accepted deeds for Your Sake only.",
  "Ya Allah Help me to attain khushu', ikhlaas and ihsaan in my ibaadah.",
  "Ya Allah Help me get closer to you as my end draws near.",
  "Ya Allah Make me love You, Your Prophet (pbuh), Your Deen, Your book the Quran, the way it deserves to be loved.",
  "Ya Allah Increase my eeman, tawakkul, yaqeen in You. Let there be no doubt in my belief in Your Oneness, Your Majesty and Power.",
  "Ya Allah Increase me in Taqwa/god consciousness.",
  "Make me of your grateful slaves and amongst the patient ones.",
  "Ya Allah Give me the strength to be steadfast throughout the trials I encounter now and in the future.",
  "Ya Allah Grant me a soft heart & content with Your Laws.",
  "Ya Allah Make the Quran be my companion in both worlds.",
  "Ya Allah Guide me to the siraat mustaqeem until my last breath, never be deviated in shirk, kufr or bid'ah.",
  "Ya Allah make clear to me what is the haqq/truth and what isn't, keep me firm upon your Deen.",
  "Ya Allah Make me among the muhsineen, muttaqeen the mukhliseen, the sabiqoon fil, ilm.",
  "Ya Allah Increase me in beneficial knowledge.",
  "I ask of you what Muhammad peace be upon asked you of and I seek refuge in you from what the Prophet Muhammad peace be upon sought refuge from.",
  "Ya Allah Favour me with the ability to do tazkiyah of my soul throughout my life journey.",
  "Ya Allah Remove the love of this world in its degrees & forms from my heart.",
  "Ya Allah, Protect our religion, all our matters are in Your Hands.",
  "Ya Allah, Make my Deen the leader of all my matters and the result of all my matters good.",
];

const death: string[] = [
  "Ya Allah Grant me a good end, with shahada on my tongue, as a Mu'min/believer and make me continuously love to meet You.",
  "Ya Allah, Make the best part of my life, the end of it, and the last of my deeds, the best, and the best of my days, the day that I meet You.",
  "Expand my grave for me and illuminate it with light.",
  "Ya Allah Make my grave & barzakh (passing time before day of Qiyama) a peaceful abode. Save me from the punishment of the grave and the hellfire.",
  "Preserve my record in Illiyeen (highest level of Jannah/lists names of believers on a scroll). Lighten for me the questioning of the grave.",
  "Grant me death in a state of Ibadah, that is most pleasing to You and resurrect me in the same state.",
  "Keep me free from fear, anxiety and terror from the day of judgement and grant me the shade of your Arsh/throne on that Day.",
  "Make me among those who show their books to others with happiness.",
  "Ya Allah Give me my record of deeds in my right hand and make my mizaan (scale) heavy with the good deeds.",
  "Ya Allah Ease my crossing of the Siraat & Qantarah (bridges before Paradise).",
  "Ya Allah Grant me the favour to drink from the Hawd Al Kawthar (Prophets pond) by our beloved Prophet's (pbuh) hand.",
  "Ya Allah, please do not give away my good deeds to others.",
  "Do not expose my faults in front of others on the day of judgement.",
  "Ya Allah, make me of the few You love and you Pardon.",
  "Ya Afu (Pardoner), Forgive the sins that I don't remember and the sins that I didn't even consider as sins.",
  "Ya Allah grant me the companionship of Prophet Mohammed (pbuh), his family and the Sahaba's in Jannatul Firdous.",
  "Ya Allah Favour me the ultimate bliss of seeing You in Hereafter.",
];

const final: string[] = [
  "Ya Allah forgive me for anything I forgot to mention and give me more than what I intended in the dunya and in the aakhira.",
  "Ya Allah bless the people and organizations who compiled this dua list and those whose lists were used to create it, make this a source of sadaqa jaariah (ongoing charity) for them all.",
  "Ya Allah, answer my Duas, You are the All Hearing, All Knowing!",
];

export const generalDuasFromPdf: LibraryDua[] = [
  ...parenting.map((t, i) => make("parenting_home", i + 1, t)),
  ...children.map((t, i) => make("for_children", i + 1, t)),
  ...parentsFamily.map((t, i) => make("for_parents_family", i + 1, t)),
  ...spouse.map((t, i) => make("for_spouse", i + 1, t)),
  ...friends.map((t, i) => make("for_friends", i + 1, t)),
  ...oppressed.map((t, i) => make("for_oppressed", i + 1, t)),
  ...others.map((t, i) => make("for_others", i + 1, t)),
  ...character.map((t, i) => make("self_character", i + 1, t)),
  ...knowledge.map((t, i) => make("self_knowledge", i + 1, t)),
  ...dunya.map((t, i) => make("self_dunya", i + 1, t)),
  ...deen.map((t, i) => make("self_deen", i + 1, t)),
  ...death.map((t, i) => make("self_death", i + 1, t)),
  ...final.map((t, i) => make("final", i + 1, t)),
];
