import * as React from 'react'
import { Eye, Mail, Phone } from 'lucide-react'
import { cn } from '#/lib/utils'

export interface ViewingSectionProps extends React.ComponentProps<'section'> {}

export function ViewingSection({ className, ...props }: ViewingSectionProps) {
  return (
    <section
      id="visning"
      className={cn('w-full py-6 md:py-10 scroll-mt-16', className)}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xs border border-slate-200/80 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 lg:gap-10">
          <div className="flex items-start gap-4 max-w-xl">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                Trenger du å se på boden først? Ta kontakt!
              </h2>
              <p className="text-sm sm:text-base text-slate-600 mt-1.5 leading-relaxed">
                Vi viser deg gjerne rundt så du kan se bodene og finne
                størrelsen som passer best for deg.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex lg:flex-row items-stretch gap-3 shrink-0">
            <a
              href="tel:+4733000000"
              className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-primary/40 hover:bg-slate-100/70 transition-colors"
            >
              <div className="size-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-primary shrink-0">
                <Phone className="size-4" />
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Telefon</span>
                <span className="text-base font-bold text-slate-900 whitespace-nowrap">
                  33 00 00 00
                </span>
              </div>
            </a>

            <a
              href="mailto:post@leieboder.no"
              className="flex items-center gap-3.5 px-4 py-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-primary/40 hover:bg-slate-100/70 transition-colors"
            >
              <div className="size-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-primary shrink-0">
                <Mail className="size-4" />
              </div>
              <div>
                <span className="text-xs text-slate-500 block">E-post</span>
                <span className="text-base font-bold text-slate-900 whitespace-nowrap">
                  plassholder@epost.no
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
