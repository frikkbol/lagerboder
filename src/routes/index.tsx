import * as React from 'react'
import { createFileRoute } from '@tanstack/react-router'
import { HeroSection } from '#/components/storage/HeroSection'
import { InteractiveMapSection } from '#/components/storage/floorplan/InteractiveMapSection'
import { PricingSection } from '#/components/storage/pricing/PricingSection'
import { FacilityFeatures } from '#/components/storage/FacilityFeatures'
import { LocationCards } from '#/components/storage/LocationCards'
import { FaqSection } from '#/components/storage/FaqSection'
import { ContactSection } from '#/components/storage/ContactSection'
import type { StorageLocationId } from '#/types/storage'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  const [selectedLocation, setSelectedLocation] =
    React.useState<StorageLocationId>('harestien')
  const [sizeFilter, setSizeFilter] = React.useState<number | 'all'>('all')

  const handleSelectSize = (size: number) => {
    setSizeFilter(size)
    const el = document.querySelector('#interactive-map')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleSelectLocation = (loc: StorageLocationId) => {
    setSelectedLocation(loc)
    const el = document.querySelector('#interactive-map')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <main className="w-full min-h-screen bg-slate-50/50">
      <HeroSection />
      <InteractiveMapSection
        location={selectedLocation}
        onLocationChange={setSelectedLocation}
        sizeFilter={sizeFilter}
        onSizeChange={setSizeFilter}
      />
      <PricingSection onSelectSize={handleSelectSize} />
      <FacilityFeatures />
      <LocationCards onSelectLocation={handleSelectLocation} />
      <FaqSection />
      <ContactSection />
    </main>
  )
}
