import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useIsMobile } from "@/hooks/use-mobile";
import { getDua } from "@/lib/duas";

interface DuaSheetProps {
  duaId: string | null;
  onClose: () => void;
}

export function DuaSheet({ duaId, onClose }: DuaSheetProps) {
  const isMobile = useIsMobile();
  const dua = duaId ? getDua(duaId) : null;
  const open = !!dua;

  const hasStory = !!dua?.story;
  const hasText = !!(dua?.arabic || dua?.transliteration || dua?.translation);

  const body = dua && (
    <div className="space-y-6">
      {dua.occasion && <p className="text-sm text-muted-foreground">{dua.occasion}</p>}

      {hasText ? (
        <Tabs defaultValue="arabic" className="w-full">
          <TabsList className="grid w-full grid-cols-3 rounded-full bg-secondary">
            <TabsTrigger value="arabic" className="rounded-full">Arabic</TabsTrigger>
            <TabsTrigger value="translit" className="rounded-full">Transliteration</TabsTrigger>
            <TabsTrigger value="translation" className="rounded-full">Translation</TabsTrigger>
          </TabsList>

          <TabsContent value="arabic" className="mt-5">
            {dua.arabic ? (
              <div
                dir="rtl"
                className="font-arabic text-[1.9rem] leading-[2.2] text-foreground sm:text-[2.25rem]"
              >
                {dua.arabic}
              </div>
            ) : (
              <p className="text-sm italic text-muted-foreground">No Arabic text — see notes below.</p>
            )}
          </TabsContent>
          <TabsContent value="translit" className="mt-5">
            <p className="text-base italic leading-relaxed text-foreground">
              {dua.transliteration ?? "—"}
            </p>
          </TabsContent>
          <TabsContent value="translation" className="mt-5">
            <p className="text-base leading-relaxed text-foreground">{dua.translation ?? "—"}</p>
          </TabsContent>
        </Tabs>
      ) : (
        dua.note && (
          <p className="rounded-2xl border border-border/60 bg-secondary/40 p-4 text-sm leading-relaxed text-foreground">
            {dua.note}
          </p>
        )
      )}

      <div className="star-divider" />

      {hasStory ? (
        <Accordion type="single" collapsible defaultValue="who" className="w-full">
          <AccordionItem value="who">
            <AccordionTrigger className="text-sm font-semibold">Who said it</AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
              {dua.story!.whoSaidIt}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="occasion">
            <AccordionTrigger className="text-sm font-semibold">The occasion</AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
              {dua.occasion}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="why">
            <AccordionTrigger className="text-sm font-semibold">Why it matters</AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
              {dua.story!.significance}
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="source">
            <AccordionTrigger className="text-sm font-semibold">Source</AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
              {dua.source}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      ) : (
        <Accordion type="single" collapsible defaultValue="location" className="w-full">
          {dua.locationMarker && (
            <AccordionItem value="location">
              <AccordionTrigger className="text-sm font-semibold">Where & when</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {dua.locationMarker}
              </AccordionContent>
            </AccordionItem>
          )}
          {dua.note && hasText && (
            <AccordionItem value="note">
              <AccordionTrigger className="text-sm font-semibold">Note</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {dua.note}
              </AccordionContent>
            </AccordionItem>
          )}
          {dua.source && (
            <AccordionItem value="source">
              <AccordionTrigger className="text-sm font-semibold">Source</AccordionTrigger>
              <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
                {dua.source}
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      )}
    </div>
  );

  if (isMobile) {
    return (
      <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
        <DialogContent className="h-[100dvh] max-w-none gap-0 rounded-none p-0 sm:rounded-lg">
          <div className="flex h-full flex-col overflow-y-auto p-6">
            <DialogHeader className="text-left">
              <DialogTitle className="text-2xl font-semibold tracking-tight">
                {dua?.title}
              </DialogTitle>
              <DialogDescription className="sr-only">
                {dua?.occasion ?? dua?.locationMarker ?? dua?.title ?? ""}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">{body}</div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Sheet open={open} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
        <SheetHeader className="text-left">
          <SheetTitle className="text-2xl font-semibold tracking-tight">{dua?.title}</SheetTitle>
          <SheetDescription className="sr-only">
            {dua?.occasion ?? dua?.locationMarker ?? dua?.title ?? ""}
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4 px-1">{body}</div>
      </SheetContent>
    </Sheet>
  );
}
