import * as React from 'react'
import { Check } from 'lucide-react'
import { Button } from '#/components/ui/button'
import type { PricingTier } from '#/types/storage'
import { cn } from '#/lib/utils'

export interface PricingCardProps extends React.ComponentProps<'div'> {
  tier: PricingTier
  onSelectSize?: (size: number) => void
}

export function PricingCard({
  tier,
  onSelectSize,
  className,
  ...props
}: PricingCardProps) {
  const isPopular = tier.popular

  const handleSelect = () => {
    if (onSelectSize) {
      onSelectSize(tier.size)
    } else {
      const el = document.querySelector('#interactive-map')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <div
      className={cn(
        'relative bg-white rounded-2xl p-6 shadow-xs border transition-all flex flex-col justify-between',
        isPopular ? 'border-slate-900 ring-1 ring-slate-900' : 'border-slate-200',
        className,
      )}
      {...props}
    >
      <div>
        {/* Header: Size & Suitable for */}
        <div className="flex items-baseline justify-between">
          <span className="text-2xl font-extrabold text-slate-900">
            {tier.size.toFixed(1).replace('.0', '').replace('.', ',')} m²
          </span>
          {isPopular && (
            <span className="text-xs font-bold text-primary">Mest valgt</span>
          )}
        </div>

        <p className="text-sm text-slate-500 font-medium mt-1">
          {tier.suitableFor}
        </p>

        {/* Price */}
        <div className="my-5 pt-4 border-t border-slate-100">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-extrabold text-slate-900">
              {tier.price} kr
            </span>
            <span className="text-sm font-medium text-slate-500">/mnd</span>
          </div>
        </div>

        {/* Feature List */}
        <ul className="space-y-2 text-sm text-slate-600 mb-6">
          {tier.features.map((f) => (
            <li key={f} className="flex items-start gap-2">
              <Check className="size-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Action Button */}
      <Button
        onClick={handleSelect}
        variant={isPopular ? 'default' : 'outline'}
        className={cn(
          'w-full font-semibold rounded-xl',
          isPopular
            ? 'bg-primary hover:bg-brand-hover text-white'
            : 'hover:bg-slate-100 text-slate-800 border-slate-300',
        )}
      >
        Velg {tier.size.toFixed(1).replace('.0', '').replace('.', ',')} m²
      </Button>
    </div>
  )
}
