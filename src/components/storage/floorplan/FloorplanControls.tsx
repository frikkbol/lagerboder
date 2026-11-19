import * as React from 'react'
import { MapPin } from 'lucide-react'
import type { StorageLocationId, StorageUnitStatus } from '#/types/storage'
import { cn } from '#/lib/utils'

export interface FloorplanControlsProps extends React.ComponentProps<'div'> {
  selectedLocation: StorageLocationId
  onLocationChange: (loc: StorageLocationId) => void
  selectedSize: number | 'all'
  onSizeChange: (size: number | 'all') => void
  selectedStatus?: StorageUnitStatus | 'all'
  onStatusChange?: (status: StorageUnitStatus | 'all') => void
}

export function FloorplanControls({
  className,
  selectedLocation,
  onLocationChange,
  selectedSize,
  onSizeChange,
  ...props
}: FloorplanControlsProps) {
  const sizeOptions: Array<{ label: string; value: number | 'all' }> = [
    { label: 'Alle størrelser', value: 'all' },
    { label: '5 m²', value: 5 },
    { label: '6,5 m²', value: 6.5 },
    { label: '7,5 m²', value: 7.5 },
    { label: '9 m²', value: 9 },
  ]

  return (
    <div
      className={cn(
        'bg-white rounded-2xl p-4 sm:p-5 shadow-xs border border-slate-200/80 flex flex-col md:flex-row md:items-center justify-between gap-4',
        className,
      )}
      {...props}
    >
      {/* Location Switcher Tabs */}
      <div
        className="inline-flex p-1 bg-slate-100 rounded-xl self-start"
        role="tablist"
        aria-label="Velg avdeling"
      >
        <button
          type="button"
          role="tab"
          aria-selected={selectedLocation === 'harestien'}
          onClick={() => onLocationChange('harestien')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer',
            selectedLocation === 'harestien'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900',
          )}
        >
          <MapPin className="size-4" />
          <span>Harestien 15</span>
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={selectedLocation === 'beverstien'}
          onClick={() => onLocationChange('beverstien')}
          className={cn(
            'px-4 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 cursor-pointer',
            selectedLocation === 'beverstien'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900',
          )}
        >
          <MapPin className="size-4" />
          <span>Beverstien 3</span>
        </button>
      </div>

      {/* Size Filter */}
      <div className="flex flex-wrap items-center gap-1.5">
        {sizeOptions.map((opt) => {
          const isActive = selectedSize === opt.value
          return (
            <button
              key={opt.label}
              type="button"
              onClick={() => onSizeChange(opt.value)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-all cursor-pointer',
                isActive
                  ? 'bg-slate-900 text-white font-semibold'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70',
              )}
            >
              {opt.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
