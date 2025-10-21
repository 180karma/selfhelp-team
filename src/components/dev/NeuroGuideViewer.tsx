
'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { neuroGuideTable } from '@/lib/neuro-guide';
import { BrainCircuit } from 'lucide-react';

interface NeuroGuideViewerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NeuroGuideViewer({ open, onOpenChange }: NeuroGuideViewerProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-headline text-2xl">
            <BrainCircuit className="h-6 w-6" />
            The Brain's Neuro Guide
          </DialogTitle>
          <DialogDescription>
            This is the reference table The Brain uses to analyze text for psychological symptoms and traits. Press Ctrl+Shift to toggle this view.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full pr-6">
            <Accordion type="multiple" className="w-full">
              {neuroGuideTable.map((category) => (
                <AccordionItem value={category.id} key={category.id}>
                  <AccordionTrigger className="text-lg font-semibold">{category.name}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground mb-4">{category.description}</p>
                    <ul className="space-y-3">
                      {category.symptoms.map((symptom) => (
                        <li key={symptom.id} className="p-3 bg-muted/50 rounded-md border">
                          <p className="font-semibold">{symptom.symptom} <span className="text-xs font-mono text-muted-foreground ml-2">({symptom.id})</span></p>
                          <p className="text-sm text-muted-foreground mt-1">{symptom.description}</p>
                        </li>
                      ))}
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
