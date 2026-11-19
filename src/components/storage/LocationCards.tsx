import * as React from 'react'
import { MapPin, Check } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { LOCATIONS } from '#/data/storage-data'
import type { StorageLocationId } from '#/types/storage'
import { cn } from '#/lib/utils'

export interface LocationCardsProps extends React.ComponentProps<'section'> {
  onSelectLocation?: (loc: StorageLocationId) => void
}

export function LocationCards({
  onSelectLocation,
  className,
  ...props
}: LocationCardsProps) {
  const handleLocationClick = (locId: StorageLocationId) => {
    if (onSelectLocation) {
      onSelectLocation(locId)
    }
    const el = document.querySelector('#interactive-map')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const locations = [LOCATIONS.harestien, LOCATIONS.beverstien]

  return (
    <section
      id="avdelinger"
      className={cn('w-full py-16 md:py-20 scroll-mt-16', className)}
      {...props}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            To avdelinger i Holmestrand
          </h2>
          <p className="text-base text-slate-600 mt-2">
            Enkel adkomst med bil og tilhenger, og gratis parkering rett utenfor
            døren.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
          {locations.map((loc) => (
            <div
              key={loc.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-7 flex flex-col justify-between"
            >
              <div>
                <div className="pb-4 border-b border-slate-100">
                  <h3 className="text-xl font-bold text-slate-900">
                    {loc.name}
                  </h3>
                  <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-1">
                    <MapPin className="size-4 text-primary shrink-0" />
                    <span>
                      {loc.address}, {loc.postalCode} {loc.city}
                    </span>
                  </p>
                </div>

                <ul className="my-5 space-y-2.5">
                  {loc.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-sm text-slate-700"
                    >
                      <Check className="size-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Button
                onClick={() => handleLocationClick(loc.id)}
                variant="outline"
                className="w-full mt-2 font-semibold rounded-xl border-slate-300 text-slate-800 hover:bg-slate-100"
              >
                Se ledige boder i {loc.shortName}
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
