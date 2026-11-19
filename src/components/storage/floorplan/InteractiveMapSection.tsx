import * as React from 'react'
import { FloorplanControls } from './FloorplanControls'
import { FloorplanCanvas } from './FloorplanCanvas'
import { UnitDetailPanel } from './UnitDetailPanel'
import type { BookingFormData } from './UnitDetailPanel'
import { BookingModal } from '../BookingModal'
import { LOCATIONS, STORAGE_UNITS } from '#/data/storage-data'
import type {
  StorageLocationId,
  StorageUnitStatus,
  StorageUnit,
} from '#/types/storage'
import { cn } from '#/lib/utils'

export interface InteractiveMapSectionProps extends React.ComponentProps<'section'> {
  location?: StorageLocationId
  onLocationChange?: (loc: StorageLocationId) => void
  sizeFilter?: number | 'all'
  onSizeChange?: (size: number | 'all') => void
  initialLocation?: StorageLocationId
  initialUnitId?: string
}

export function InteractiveMapSection({
  location: controlledLocation,
  onLocationChange: controlledOnLocationChange,
  sizeFilter: controlledSizeFilter,
  onSizeChange: controlledOnSizeChange,
  initialLocation = 'harestien',
  initialUnitId = '104',
  className,
  ...props
}: InteractiveMapSectionProps) {
  const [internalLocation, setInternalLocation] =
    React.useState<StorageLocationId>(initialLocation)
  const [internalSizeFilter, setInternalSizeFilter] = React.useState<
    number | 'all'
  >('all')
  const [statusFilter, setStatusFilter] = React.useState<
    StorageUnitStatus | 'all'
  >('all')

  const selectedLocation = controlledLocation ?? internalLocation
  const sizeFilter = controlledSizeFilter ?? internalSizeFilter

  // Active selected unit
  const [selectedUnit, setSelectedUnit] = React.useState<StorageUnit>(() => {
    return STORAGE_UNITS.find((u) => u.id === initialUnitId) || STORAGE_UNITS[0]
  })

  const handleLocationChange = (loc: StorageLocationId) => {
    if (controlledOnLocationChange) {
      controlledOnLocationChange(loc)
    } else {
      setInternalLocation(loc)
    }
    const firstAvailable =
      STORAGE_UNITS.find(
        (u) => u.locationId === loc && u.status === 'available',
      ) || STORAGE_UNITS.find((u) => u.locationId === loc)
    if (firstAvailable) {
      setSelectedUnit(firstAvailable)
    }
  }

  const handleSizeChange = (size: number | 'all') => {
    if (controlledOnSizeChange) {
      controlledOnSizeChange(size)
    } else {
      setInternalSizeFilter(size)
    }
  }

  // Current units for active location
  const locationUnits = React.useMemo(() => {
    return STORAGE_UNITS.filter((u) => u.locationId === selectedLocation)
  }, [selectedLocation])

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

        {/* Filter Controls Bar */}
        <FloorplanControls
          selectedLocation={selectedLocation}
          onLocationChange={handleLocationChange}
          selectedSize={sizeFilter}
          onSizeChange={handleSizeChange}
          selectedStatus={statusFilter}
          onStatusChange={setStatusFilter}
          className="mb-6"
        />

        {/* Canvas + Detail Split View */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Floorplan (7 Cols) */}
          <div className="lg:col-span-7">
            <FloorplanCanvas
              location={LOCATIONS[selectedLocation]}
              units={locationUnits}
              selectedUnit={selectedUnit}
              onSelectUnit={setSelectedUnit}
              sizeFilter={sizeFilter}
              statusFilter={statusFilter}
            />
          </div>

          {/* Selected Unit Details Panel (5 Cols) */}
          <div className="lg:col-span-5 sticky top-24">
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
