import * as React from 'react'
import { FloorplanCanvas } from './FloorplanCanvas'
import { UnitDetailPanel } from './UnitDetailPanel'
import type { BookingFormData } from './UnitDetailPanel'
import { BookingModal } from '../BookingModal'
import { LOCATIONS, STORAGE_UNITS } from '#/data/storage-data'
import type { StorageUnit } from '#/types/storage'
import { cn } from '#/lib/utils'

export interface InteractiveMapSectionProps extends React.ComponentProps<'section'> {
  initialUnitId?: string
}

export function InteractiveMapSection({
  initialUnitId = '104',
  className,
  ...props
}: InteractiveMapSectionProps) {
  // Active selected unit
  const [selectedUnit, setSelectedUnit] = React.useState<StorageUnit>(() => {
    return STORAGE_UNITS.find((u) => u.id === initialUnitId) || STORAGE_UNITS[0]
  })

  // Booking Modal state
  const [bookingModalOpen, setBookingModalOpen] = React.useState(false)
  const [confirmedBookingData, setConfirmedBookingData] =
    React.useState<BookingFormData | null>(null)

  // Handle booking form submission
  const handleBookUnit = (_unit: StorageUnit, data: BookingFormData) => {
    setConfirmedBookingData(data)
    setBookingModalOpen(true)
  }

  return (
    <section
      id="interactive-map"
      className={cn('w-full py-16 md:py-20 scroll-mt-16', className)}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Velg din bod
          </h2>
          <p className="text-base text-slate-600 mt-1.5 max-w-xl">
            Klikk på en bod i oversikten for å se hva du får plass til og
            bestille.
          </p>
        </div>

        {/* Canvas + Detail Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Floorplan (7 Cols) */}
          <div className="lg:col-span-7">
            <FloorplanCanvas
              location={LOCATIONS.burmaveien}
              units={STORAGE_UNITS}
              selectedUnit={selectedUnit}
              onSelectUnit={setSelectedUnit}
            />
          </div>

          {/* Selected Unit Details Panel (5 Cols) */}
          <div className="lg:col-span-5 top-24">
            <UnitDetailPanel unit={selectedUnit} onBookUnit={handleBookUnit} />
          </div>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      <BookingModal
        isOpen={bookingModalOpen}
        onClose={() => setBookingModalOpen(false)}
        unit={selectedUnit}
        formData={confirmedBookingData}
      />
    </section>
  )
}
