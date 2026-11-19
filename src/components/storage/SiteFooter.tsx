import * as React from 'react'
import { MapPin, Phone, Mail } from 'lucide-react'
import { BrandLogo } from './BrandLogo'
import { cn } from '#/lib/utils'

export interface SiteFooterProps extends React.ComponentProps<'footer'> {}

export function SiteFooter({ className, ...props }: SiteFooterProps) {
  return (
    <footer
      className={cn(
        'w-full bg-slate-900 text-slate-300 py-12 mt-12',
        className,
      )}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Col 1: Brand */}
          <div className="flex flex-col gap-3">
            <BrandLogo variant="dark" />
            <p className="text-sm text-slate-400 leading-relaxed max-w-xs">
              Tørre og oppvarmede lagerboder i Holmestrand. Enkel leie uten
              bindingstid.
            </p>
          </div>

          {/* Col 2: Locations */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-sm font-bold text-white">Våre adresser</h4>
            <div className="space-y-2 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-primary shrink-0" />
                <span>Harestien 15, 3189 Holmestrand</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-4 text-primary shrink-0" />
                <span>Beverstien 3, 3188 Holmestrand</span>
              </div>
            </div>
          </div>

          {/* Col 3: Contact */}
          <div className="flex flex-col gap-2.5">
            <h4 className="text-sm font-bold text-white">Kontakt</h4>
            <div className="space-y-2 text-sm">
              <a
                href="tel:+4733000000"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <Phone className="size-4 text-primary shrink-0" />
                <span>33 00 00 00</span>
              </a>

              <a
                href="mailto:post@leieboder.no"
                className="flex items-center gap-2 text-slate-300 hover:text-white transition-colors"
              >
                <Mail className="size-4 text-primary shrink-0" />
                <span>post@leieboder.no</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>&copy; 2026 Leieboder.no</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-slate-300 transition-colors">
              Personvern
            </a>
            <a href="#" className="hover:text-slate-300 transition-colors">
              Leievilkår
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
