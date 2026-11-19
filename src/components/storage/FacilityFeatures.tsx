import * as React from 'react'
import { Thermometer, ShieldCheck, Truck, Sparkles } from 'lucide-react'
import { FACILITY_FEATURES } from '#/data/storage-data'
import { cn } from '#/lib/utils'

export interface FacilityFeaturesProps extends React.ComponentProps<'section'> {}

export function FacilityFeatures({
  className,
  ...props
}: FacilityFeaturesProps) {
  const iconMap = {
    thermometer: Thermometer,
    shield: ShieldCheck,
    truck: Truck,
    clock: Thermometer,
    sparkles: Sparkles,
    key: ShieldCheck,
  }

  return (
    <section
      id="fasiliteter"
      className={cn('w-full py-16 md:py-20 scroll-mt-16', className)}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Trygg og enkel lagring
          </h2>
          <p className="text-base text-slate-600 mt-2">
            Alt er lagt til rette for at tingene dine skal stå trygt og være
            lette å hente når du trenger dem.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {FACILITY_FEATURES.map((item) => {
            const Icon = iconMap[item.iconName]

            return (
              <div
                key={item.title}
                className="bg-white rounded-2xl p-7 shadow-xs border border-slate-200/80 flex flex-col gap-3"
              >
                <div className="size-11 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center">
                  <Icon className="size-5" />
                </div>
                <h3 className="text-xl font-bold text-slate-900">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.description}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
