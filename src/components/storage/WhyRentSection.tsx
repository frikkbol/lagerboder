import * as React from 'react'
import { Waves, Wrench, Package } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { USE_CASES } from '#/data/storage-data'
import { cn } from '#/lib/utils'

export interface WhyRentSectionProps extends React.ComponentProps<'section'> {}

export function WhyRentSection({ className, ...props }: WhyRentSectionProps) {
  const iconMap = {
    surfing: Waves,
    tool: Wrench,
    box: Package,
  }

  const handleContactClick = () => {
    const el = document.querySelector('#kontakt')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section
      id="om-oss"
      className={cn(
        'w-full py-16 md:py-20 bg-slate-900 text-white scroll-mt-16',
        className,
      )}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Use cases */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Når passer det å leie bod?
              </h2>
              <p className="text-base text-slate-300 mt-2 max-w-xl">
                Uansett om du trenger lagring i én måned eller flere år, har vi
                en bod som passer.
              </p>
            </div>

            <div className="space-y-6">
              {USE_CASES.map((uc) => {
                const Icon = iconMap[uc.iconName]
                return (
                  <div key={uc.title} className="flex items-start gap-4">
                    <div className="size-10 rounded-xl bg-slate-800 flex items-center justify-center text-primary shrink-0">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">
                        {uc.title}
                      </h3>
                      <p className="text-sm text-slate-300 mt-1 leading-relaxed">
                        {uc.description}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Right Column: Simple Large Space Note */}
          <div className="lg:col-span-5 bg-slate-800/80 border border-slate-700/80 rounded-2xl p-7 sm:p-8 flex flex-col justify-between">
            <div className="flex flex-col gap-3">
              <h3 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Trenger du mer enn 9 m²?
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed">
                Vi kan enkelt fjerne skilleveggen mellom to eller flere boder,
                slik at du får et større lagerrom tilpasset ditt behov.
              </p>
            </div>

            <Button
              onClick={handleContactClick}
              size="lg"
              className="mt-6 w-full font-bold bg-primary hover:bg-[#c93d29] text-white"
            >
              Ta kontakt for større plass
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
