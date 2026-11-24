import * as React from 'react'
import { FloorplanCanvas } from './FloorplanCanvas'
import { UnitDetailPanel } from './UnitDetailPanel'
import type { BookingFormData } from './UnitDetailPanel'
import { BookingModal } from '../BookingModal'
import { getFloorplansForLocation } from '#/data/floorplan-layouts'
import { LOCATIONS, STORAGE_UNITS } from '#/data/storage-data'
import type { FloorplanLayout } from '#/types/floorplan'
import type { StorageLocationId, StorageUnit } from '#/types/storage'
import { cn } from '#/lib/utils'

export interface InteractiveMapSectionProps extends React.ComponentProps<'section'> {
  locationId?: StorageLocationId
  initialUnitId?: string
}

export function InteractiveMapSection({
  locationId = 'burmaveien',
  initialUnitId = '104',
  className,
  ...props
}: InteractiveMapSectionProps) {
  const location = LOCATIONS[locationId]
  const locationUnits = React.useMemo(
    () =>
      STORAGE_UNITS.filter((u) => String(u.locationId) === String(locationId)),
    [locationId],
  )
  const floorplans = React.useMemo(
    () => getFloorplansForLocation(locationId),
    [locationId],
  )

  const [activeFloorplan, setActiveFloorplan] = React.useState<FloorplanLayout>(
    () =>
      floorplans.find((fp) =>
        fp.units.some((placement) => placement.unitId === initialUnitId),
      ) ?? floorplans[0],
  )

  // Active selected unit
  const [selectedUnit, setSelectedUnit] = React.useState<StorageUnit>(() => {
    return (
      locationUnits.find((u) => u.id === initialUnitId) || locationUnits[0]
    )
  })

  const handleSelectFloorplan = (nextFloorplan: FloorplanLayout) => {
    setActiveFloorplan(nextFloorplan)
    const isCurrentUnitOnFloor = nextFloorplan.units.some(
      (p) => p.unitId === selectedUnit.id,
    )
    if (!isCurrentUnitOnFloor && nextFloorplan.units.length > 0) {
      const firstUnit = locationUnits.find(
        (u) => u.id === nextFloorplan.units[0].unitId,
      )
      if (firstUnit) {
        setSelectedUnit(firstUnit)
      }
    }
  }

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
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
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
          {/* Floorplan (8 Cols) */}
          <div className="lg:col-span-8">
            <FloorplanCanvas
              location={location}
              layout={activeFloorplan}
              floorplans={floorplans}
              onSelectFloorplan={handleSelectFloorplan}
              units={locationUnits}
              selectedUnit={selectedUnit}
              onSelectUnit={setSelectedUnit}
            />
          </div>

          {/* Selected Unit Details Panel (4 Cols) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
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
