import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useIsMobile } from "@/hooks/use-mobile";
import { duas } from "@/data/hajj";

interface DuaSheetProps {
  duaId: string | null;
  onClose: () => void;
}

export function DuaSheet({ duaId, onClose }: DuaSheetProps) {
  const isMobile = useIsMobile();
  const dua = duaId ? duas[duaId] : null;
  const open = !!dua;

  const body = dua && (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">{dua.occasion}</p>

      <Tabs defaultValue="arabic" className="w-full">
        <TabsList className="grid w-full grid-cols-3 rounded-full bg-secondary">
          <TabsTrigger value="arabic" className="rounded-full">Arabic</TabsTrigger>
          <TabsTrigger value="translit" className="rounded-full">Transliteration</TabsTrigger>
          <TabsTrigger value="translation" className="rounded-full">Translation</TabsTrigger>
        </TabsList>

        <TabsContent value="arabic" className="mt-5">
          <div
            dir="rtl"
            className="font-arabic text-[1.9rem] leading-[2.2] text-foreground sm:text-[2.25rem]"
          >
            {dua.arabic}
          </div>
        </TabsContent>
        <TabsContent value="translit" className="mt-5">
          <p className="text-base italic leading-relaxed text-foreground">{dua.transliteration}</p>
        </TabsContent>
        <TabsContent value="translation" className="mt-5">
          <p className="text-base leading-relaxed text-foreground">{dua.translation}</p>
        </TabsContent>
      </Tabs>

      <div className="star-divider" />

      <Accordion type="single" collapsible defaultValue="who" className="w-full">
        <AccordionItem value="who">
          <AccordionTrigger className="text-sm font-semibold">Who said it</AccordionTrigger>
          <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
            {dua.story.whoSaidIt}
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
            {dua.story.significance}
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="source">
          <AccordionTrigger className="text-sm font-semibold">Source</AccordionTrigger>
          <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
            {dua.source}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
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
              <DialogDescription className="sr-only">{dua?.occasion}</DialogDescription>
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
          <SheetDescription className="sr-only">{dua?.occasion}</SheetDescription>
        </SheetHeader>
        <div className="mt-4 px-1">{body}</div>
      </SheetContent>
    </Sheet>
  );
}
