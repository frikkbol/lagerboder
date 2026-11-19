import * as React from 'react'
import { PricingCard } from './PricingCard'
import { PRICING_TIERS } from '#/data/storage-data'
import { cn } from '#/lib/utils'

export interface PricingSectionProps extends React.ComponentProps<'section'> {
  onSelectSize?: (size: number) => void
}

export function PricingSection({
  onSelectSize,
  className,
  ...props
}: PricingSectionProps) {
  return (
    <section
      id="priser"
      className={cn(
        'w-full py-16 md:py-20 bg-slate-100/60 scroll-mt-16',
        className,
      )}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Priser og størrelser
          </h2>
          <p className="text-base text-slate-600 mt-2">
            Faste månedspriser uten skjulte kostnader eller bindingstid.
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
          {PRICING_TIERS.map((tier) => (
            <PricingCard
              key={tier.size}
              tier={tier}
              onSelectSize={onSelectSize}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
