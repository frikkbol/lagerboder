import { createFileRoute } from '@tanstack/react-router'
import { HeroSection } from '#/components/storage/HeroSection'
import { InteractiveMapSection } from '#/components/storage/floorplan/InteractiveMapSection'
import { FacilityFeatures } from '#/components/storage/FacilityFeatures'
import { FaqSection } from '#/components/storage/FaqSection'
import { ContactSection } from '#/components/storage/ContactSection'

export const Route = createFileRoute('/')({ component: HomePage })

function HomePage() {
  return (
    <main className="w-full min-h-screen bg-slate-50/50">
      <HeroSection />
      <InteractiveMapSection />
      <FacilityFeatures />
      <FaqSection />
      <ContactSection />
    </main>
  )
}
