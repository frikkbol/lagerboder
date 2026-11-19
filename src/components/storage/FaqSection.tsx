import * as React from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '#/components/ui/accordion'
import { FAQ_ITEMS } from '#/data/storage-data'
import { cn } from '#/lib/utils'

export interface FaqSectionProps extends React.ComponentProps<'section'> {}

export function FaqSection({ className, ...props }: FaqSectionProps) {
  return (
    <section
      id="faq"
      className={cn(
        'w-full py-16 md:py-20 bg-slate-100/60 scroll-mt-16',
        className,
      )}
      {...props}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Spørsmål og svar
          </h2>
          <p className="text-base text-slate-600 mt-2">
            Svar på det de fleste lurer på om leie av bod.
          </p>
        </div>

        {/* Accordion List */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200/80">
          <Accordion
            type="single"
            collapsible
            defaultValue="faq-1"
            className="w-full space-y-2"
          >
            {FAQ_ITEMS.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-b border-slate-100 last:border-b-0 px-2"
              >
                <AccordionTrigger className="text-base sm:text-lg font-bold text-slate-900 hover:text-primary py-4">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent className="text-sm text-slate-600 leading-relaxed pb-4">
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
