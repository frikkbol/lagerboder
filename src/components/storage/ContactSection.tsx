import * as React from 'react'
import { Phone, Mail } from 'lucide-react'
import { cn } from '#/lib/utils'

export interface ContactSectionProps extends React.ComponentProps<'section'> {}

export function ContactSection({ className, ...props }: ContactSectionProps) {
  return (
    <section
      id="kontakt"
      className={cn('w-full py-16 md:py-20 scroll-mt-16', className)}
      {...props}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-7 sm:p-10 shadow-xs border border-slate-200/80 flex flex-col gap-8 text-center">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Kontakt oss
            </h2>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed max-w-lg mx-auto">
              Lurer du på hvilken størrelse du bør velge, eller har du andre
              spørsmål? Ring oss eller send oss en e-post.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <a
              href="tel:+4733000000"
              className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-slate-300 hover:bg-slate-100/70 transition-colors"
            >
              <div className="size-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-slate-800 shrink-0">
                <Phone className="size-4" />
              </div>
              <div>
                <span className="text-xs text-slate-500 block">Telefon</span>
                <span className="text-base font-bold text-slate-900">
                  33 00 00 00
                </span>
              </div>
            </a>

            <a
              href="mailto:post@leieboder.no"
              className="flex items-center gap-3.5 p-4 rounded-xl bg-slate-50 border border-slate-200/70 hover:border-slate-300 hover:bg-slate-100/70 transition-colors"
            >
              <div className="size-10 rounded-xl bg-white border border-slate-200/80 flex items-center justify-center text-slate-800 shrink-0">
                <Mail className="size-4" />
              </div>
              <div>
                <span className="text-xs text-slate-500 block">E-post</span>
                <span className="text-base font-bold text-slate-900">
                  post@leieboder.no
                </span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
