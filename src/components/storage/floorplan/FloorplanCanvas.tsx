import * as React from 'react'
import { DoorOpen } from 'lucide-react'
import { UnitCard } from './UnitCard'
import type {
  StorageUnit,
  StorageLocation,
  StorageUnitStatus,
} from '#/types/storage'
import { cn } from '#/lib/utils'

export interface FloorplanCanvasProps extends React.ComponentProps<'div'> {
  location: StorageLocation
  units: StorageUnit[]
  selectedUnit: StorageUnit
  onSelectUnit: (unit: StorageUnit) => void
  statusFilter?: StorageUnitStatus | 'all'
}

export function FloorplanCanvas({
  location,
  units,
  selectedUnit,
  onSelectUnit,
  statusFilter = 'all',
  className,
  ...props
}: FloorplanCanvasProps) {
  const isUnitMatching = (u: StorageUnit) => {
    if (statusFilter === 'available') return u.status === 'available'
    if (statusFilter === 'soon') return u.status === 'soon'
    return true
  }

  const row1 = units.slice(0, 4)
  const row2 = units.slice(4, 8)
  const row3 = units.slice(8, 12)

  return (
    <div
      className={cn(
        'bg-white rounded-2xl p-4 sm:p-6 shadow-xs border border-slate-200/80 flex flex-col',
        className,
      )}
      {...props}
    >
      {/* Simple Header & Legend */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div>
          <span className="font-bold text-slate-900 text-base">
            {location.name}
          </span>
        </div>

        {/* Simple color legend */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-emerald-500"></span>
            <span>Ledig</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-amber-500"></span>
            <span>Ledig snart</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-3 rounded-full bg-slate-300"></span>
            <span>Utleid</span>
          </div>
        </div>
      </div>

      {/* Clean Floorplan Grid */}
      <div className="w-full bg-slate-50 rounded-xl p-4 sm:p-5 mt-4">
        <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 mb-3">
          <DoorOpen className="size-4 text-slate-400" />
          <span>Inngang</span>
        </div>

        <div className="flex flex-col gap-3">
          {/* Row 1 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {row1.map((unit) => (
              <UnitCard
                key={unit.id}
                unit={unit}
                isSelected={selectedUnit.id === unit.id}
                isDimmed={!isUnitMatching(unit)}
                onSelect={onSelectUnit}
              />
            ))}
          </div>

          {/* Simple Corridor Spacer */}
          <div className="py-1.5 text-center text-[11px] font-medium text-slate-400">
            Gang
          </div>

          {/* Row 2 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            {row2.map((unit) => (
              <UnitCard
                key={unit.id}
                unit={unit}
                isSelected={selectedUnit.id === unit.id}
                isDimmed={!isUnitMatching(unit)}
                onSelect={onSelectUnit}
              />
            ))}
          </div>

          {/* Row 3 */}
          {row3.length > 0 && (
            <>
              <div className="py-1.5 text-center text-[11px] font-medium text-slate-400">
                Gang
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
                {row3.map((unit) => (
                  <UnitCard
                    key={unit.id}
                    unit={unit}
                    isSelected={selectedUnit.id === unit.id}
                    isDimmed={!isUnitMatching(unit)}
                    onSelect={onSelectUnit}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
