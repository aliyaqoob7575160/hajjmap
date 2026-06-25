import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export const Route = createFileRoute("/prepare")({
  head: () => ({
    meta: [
      { title: "Prepare for Hajj & Umrah — Labbayk" },
      {
        name: "description",
        content:
          "Before-departure prayers, sunnah acts of Ihram, Tawaf, Sa'ee and the Hajj days, the farewell, plus a physical preparation and packing list.",
      },
      { property: "og:title", content: "Prepare for Hajj & Umrah — Labbayk" },
      {
        property: "og:description",
        content:
          "Operator's notes and scholarly sunnah additions for every stage of Hajj and Umrah — plus a packing list.",
      },
    ],
  }),
  component: PreparePage,
});

interface DuaBlock {
  title: string;
  arabic: string;
  transliteration: string;
  translation: string;
  source: string;
}

function DuaCard({ dua }: { dua: DuaBlock }) {
  return (
    <Card className="border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)]">
      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary">
        {dua.title}
      </p>
      <p
        dir="rtl"
        className="mt-3 font-arabic text-2xl leading-[2.1] text-foreground"
      >
        {dua.arabic}
      </p>
      <p className="mt-3 italic text-sm text-muted-foreground">
        {dua.transliteration}
      </p>
      <p className="mt-2 text-sm leading-relaxed text-foreground">
        “{dua.translation}”
      </p>
      <p className="mt-3 text-[11px] uppercase tracking-[0.12em] text-muted-foreground/80">
        {dua.source}
      </p>
    </Card>
  );
}

function Section({
  number,
  title,
  children,
}: {
  number: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-baseline gap-3">
        <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
          {number}
        </span>
        <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
          {title}
        </h2>
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-sm leading-relaxed text-foreground/90">
      {items.map((it, i) => (
        <li key={i} className="flex gap-3">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
          <span>{it}</span>
        </li>
      ))}
    </ul>
  );
}

function SunnahNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="rounded-xl border border-gold/30 bg-gold/5 p-4 text-sm leading-relaxed text-foreground/90">
      <span className="mr-2 text-gold">☀ Sunnah:</span>
      {children}
    </p>
  );
}

const duaLeavingHome: DuaBlock = {
  title: "Dua when leaving home",
  arabic: "بِسْمِ اللَّهِ تَوَكَّلْتُ عَلَى اللَّهِ، لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ",
  transliteration:
    "Bismillāhi tawakkaltu ʿalallāh, lā ḥawla wa lā quwwata illā billāh",
  translation:
    "In the name of Allah, I place my trust in Allah. There is no power or strength except with Allah.",
  source: "Abu Dawud 5095 · Tirmidhi 3426",
};

const duaTravel: DuaBlock = {
  title: "Dua for beginning a journey",
  arabic:
    "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَىٰ رَبِّنَا لَمُنقَلِبُونَ",
  transliteration:
    "Subḥānal-ladhī sakhkhara lanā hādhā wa mā kunnā lahu muqrinīn, wa innā ilā Rabbinā lamunqalibūn",
  translation:
    "Glory be to Him Who has subjected this to us, and we could not have done it ourselves. And indeed, to our Lord we shall return.",
  source: "Qur'an 43:13–14 · Sahih Muslim 1342",
};

const farewell: DuaBlock = {
  title: "Last words before leaving Masjid al-Haram",
  arabic: "أَسْتَغْفِرُ اللَّهَ",
  transliteration: "Astaghfirullāh",
  translation:
    "I seek forgiveness from Allah. — Let your last words be istighfar.",
  source: "Operator's notes",
};

function PreparePage() {
  return (
    <div className="min-h-dvh bg-background">
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 sm:px-6 sm:py-4">
          <Button asChild variant="ghost" size="sm" className="rounded-full">
            <Link to="/">
              <ArrowLeft className="mr-1.5 h-4 w-4" /> Back
            </Link>
          </Button>
          <div className="leading-tight">
            <h1 className="text-lg font-semibold tracking-tight sm:text-xl">
              Prepare
            </h1>
            <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground sm:text-xs">
              Operator's notes · scholarly sunnah · packing
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-5xl space-y-12 px-4 py-8 sm:px-6 sm:py-12">
        <div className="rounded-2xl border border-border/60 bg-card p-6 shadow-[var(--shadow-soft)]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
            Hajj & Umrah Complete Guide
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight sm:text-3xl">
            Step-by-step preparation
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Prepared from your operator's notes and trusted scholarly sources.
            For the full duas of each ritual, see the{" "}
            <Link to="/duas" className="underline decoration-gold/60 hover:text-foreground">
              Duas Library
            </Link>{" "}
            and the day-by-day timelines on the home page.
          </p>
          <p className="mt-4 italic text-sm text-foreground">
            “Hajj is Arafah.” — Prophet Muhammad ﷺ (Tirmidhi 889)
          </p>
        </div>

        <Section number="01" title="Before departure — prayers at home">
          <Bullets
            items={[
              "After Isha salah, pray 2 rakah nafl as Shukr (gratitude) to Allah for being blessed with the opportunity to perform Hajj.",
              "Then pray 2 more rakah nafl seeking forgiveness for all sins before beginning this sacred journey.",
            ]}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <DuaCard dua={duaLeavingHome} />
            <DuaCard dua={duaTravel} />
          </div>
        </Section>

        <Section number="02" title="Ihram — entering the sacred state">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Operator's notes
          </h3>
          <Bullets
            items={[
              "Shave hair where applicable, then perform a complete ghusl.",
              "Once the male comes out of the washroom, the wife applies perfume to her palms and rubs it on her husband's chest. Perfume must be applied before wearing Ihram — not after.",
              "Wear the Ihram garment. A belt may be worn to hold documents — make niyyah that it is only for that purpose, not to tighten the Ihram.",
              "Pray 2 rakah nafl, then make niyyah for Umrah (or Hajj at Azizia on the 8th).",
              "Recite the Talbiyah 3 times loudly, then send Durood upon the Prophet ﷺ. You are now in the state of Ihram.",
            ]}
          />
          <div className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm leading-relaxed text-foreground/90">
            <span className="mr-2 font-semibold text-destructive">⚠ Prohibited in Ihram:</span>
            Perfume · cutting nails · cutting hair · killing insects (mosquitoes, flies, ants) · marital relations · covering the head (for men) · wearing stitched clothing (for men).
          </div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Sunnah additions
          </h3>
          <SunnahNote>
            It is sunnah to perform ghusl before entering Ihram, even for women in their menstrual cycle (though they do not pray the 2 rakah).
          </SunnahNote>
          <SunnahNote>
            Men are encouraged to raise their voices with the Talbiyah; women recite quietly.
          </SunnahNote>
          <SunnahNote>
            The Talbiyah should be on your lips constantly — while walking, resting, in vehicles, ascending and descending. Scholars say its recitation continues until the first pebble is thrown at Jamarat al-Aqabah on the 10th.
          </SunnahNote>
        </Section>

        <Section number="03" title="Tawaf — 7 circuits of the Ka'bah">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Operator's notes
          </h3>
          <Bullets
            items={[
              "Enter through Gate Abdul Aziz for Tawaf. Have a bag ready to hold your slippers.",
              "Enter with your right foot and recite the dua to enter the Masjid.",
              "At each passing of the Black Stone, say Bismillāhi Allāhu Akbar wa lillāhil-ḥamd and kiss your palms. Repeat for all 7 rounds.",
            ]}
          />
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Sunnah additions
          </h3>
          <SunnahNote>
            If you cannot kiss the Black Stone due to crowd, simply point toward it with your right hand and say Allāhu Akbar — no need to push.
          </SunnahNote>
          <SunnahNote>
            Try to touch the Yemeni Corner with your right hand if possible, but do not point to it if you cannot.
          </SunnahNote>
          <SunnahNote>
            During Tawaf, focus entirely on dhikr, istighfar, dua and Qur'anic recitation with humility. Scholars say there is no single fixed dua for each circuit — your personal dua is encouraged.
          </SunnahNote>
        </Section>

        <Section number="04" title="Sa'ee — Safa to Marwah (7 rounds)">
          <SunnahNote>
            On Safa and Marwah hills, it is sunnah to face the Ka'bah, raise your hands, and make lengthy dua. The Prophet ﷺ did this three times at each hill (Muslim 1218).
          </SunnahNote>
        </Section>

        <Section number="05" title="Halq / Taqsir — completing Umrah">
          <Bullets
            items={[
              "Head to the shops near the Clock Tower (Abraj al-Bait). Many barbers are available there.",
              "Have your head shaved (Halq) — more virtuous — or trimmed (Taqsir): minimum of a fingertip's length all around.",
              "Once the hair is cut, Ihram restrictions are lifted. Remove your Ihram. Alhamdulillah — your Umrah is complete.",
            ]}
          />
          <p className="rounded-xl border border-primary/30 bg-primary/5 p-4 text-sm leading-relaxed text-foreground/90">
            <span className="mr-2 font-semibold text-primary">✅ Scholars note:</span>
            Halq (shaving) is superior to Taqsir (trimming). The Prophet ﷺ made dua for those who shave three times and for those who trim once. (Bukhari 1727)
          </p>
        </Section>

        <Section number="06" title="The five sacred Hajj days — sunnah notes">
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            Entering Ihram for Hajj
          </h3>
          <Bullets
            items={[
              "Perform ghusl and wear Ihram at Azizia — same process as Umrah. Wife applies perfume to husband's chest.",
              "Make niyyah for Hajj, then recite the Talbiyah.",
            ]}
          />
          <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            On the 10th (Day of Nahr)
          </h3>
          <SunnahNote>
            The correct order on the 10th (Sunnah of the Prophet ﷺ) is: (1) Stone Jamarat → (2) Qurbani → (3) Halq/shave → (4) Tawaf al-Ziyarah + Sa'ee. If performed in a different order, scholars say there is no harm. (Bukhari)
          </SunnahNote>
          <SunnahNote>
            Eat from your Qurbani meat if possible — this is sunnah.
          </SunnahNote>
        </Section>

        <Section number="07" title="Tawaf al-Wida — the farewell">
          <Bullets
            items={[
              "Before leaving Makkah, perform the farewell Tawaf. This is obligatory for most pilgrims (wajib).",
              "Perform a complete Tawaf (7 rounds), pray 2 rakah behind Maqam Ibrahim, and make heartfelt dua.",
            ]}
          />
          <DuaCard dua={farewell} />
        </Section>

        <Section number="08" title="Physical preparation">
          <Bullets
            items={[
              "Begin walking barefoot at home to condition your feet.",
              "Build up to walking 15+ km per day — you will be on your feet constantly throughout Hajj.",
            ]}
          />
        </Section>

        <Section number="09" title="Packing list">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)]">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                Medications
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                Multivitamins · Vitamin C · Fish oil · Advil / painkiller · Caffeine tablets.
              </p>
            </Card>
            <Card className="border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)]">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                Ihram essentials
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                2 Ihram garments · belt for documents · extra slippers.
              </p>
            </Card>
            <Card className="border border-border/70 bg-card p-5 shadow-[var(--shadow-soft)] sm:col-span-2">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
                Personal
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-foreground/90">
                Soap · Mushaf (Qur'an) · Zamzam bottle · dry fruits / snacks · pebble bag.
              </p>
            </Card>
          </div>
        </Section>

        <p className="mt-10 text-center text-xs leading-relaxed text-muted-foreground">
          This guide is for learning and reminder. Verify all rulings with a qualified scholar and your official Hajj group.
        </p>
      </main>
    </div>
  );
}
