import { createFileRoute } from '@tanstack/react-router'
import { HeroSection } from '#/components/storage/HeroSection'
import { InteractiveMapSection } from '#/components/storage/floorplan/InteractiveMapSection'
import { ViewingSection } from '#/components/storage/ViewingSection'
import { FacilityFeatures } from '#/components/storage/FacilityFeatures'
import { FaqSection } from '#/components/storage/FaqSection'
import { ContactSection } from '#/components/storage/ContactSection'
import { getStorageUnits } from '#/server/storage-units'

export const Route = createFileRoute('/')({
  loader: () => getStorageUnits(),
  component: HomePage,
})

function HomePage() {
  const units = Route.useLoaderData()

  return (
    <main className="w-full min-h-screen bg-slate-50/50">
      <HeroSection />
      <InteractiveMapSection units={units} />
      <ViewingSection />
      <FacilityFeatures />
      <FaqSection />
      <ContactSection />
    </main>
  )
}
