import * as React from 'react'
import { ArrowDown, Check } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { cn } from '#/lib/utils'

export interface HeroSectionProps extends React.ComponentProps<'section'> {
  onExploreMapClick?: () => void
  totalAvailable?: number
}

export function HeroSection({
  className,
  onExploreMapClick,
  ...props
}: HeroSectionProps) {
  const handleScrollToMap = () => {
    if (onExploreMapClick) {
      onExploreMapClick()
    } else {
      const el = document.querySelector('#interactive-map')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  const handleScrollToPrices = () => {
    const el = document.querySelector('#priser')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const highlights = [
    'Tørt og oppvarmet hele året',
    'Tilgang hele døgnet',
    'Ingen bindingstid',
  ]

  return (
    <section
      className={cn(
        'relative w-full bg-white border-b border-slate-200/60 pt-28 pb-16 md:pt-36 md:pb-20',
        className,
      )}
      {...props}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1] max-w-3xl">
          Enkel og trygg lagring i Holmestrand
        </h1>

        <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mt-5">
          Lei en tørr og oppvarmet lagerbod i Burmaveien 1. Velg en ledig bod
          nedenfor og flytt inn når det passer deg.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3.5 mt-8">
          <Button
            onClick={handleScrollToMap}
            size="lg"
            className="font-bold px-7 h-12 rounded-xl shadow-sm bg-primary hover:bg-brand-hover text-white flex items-center gap-2 text-base"
          >
            <span>Finn ledig bod</span>
            <ArrowDown className="size-4" />
          </Button>
          {/* <Button
            onClick={handleScrollToPrices}
            variant="outline"
            size="lg"
            className="font-semibold px-6 h-12 rounded-xl border-slate-300 text-slate-700 hover:bg-slate-50 text-base"
          >
            Se priser og størrelser
          </Button> */}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-2 mt-8 text-sm text-slate-600 font-medium">
          {highlights.map((item) => (
            <div key={item} className="flex items-center gap-2">
              <Check className="size-4 text-emerald-600 shrink-0" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
