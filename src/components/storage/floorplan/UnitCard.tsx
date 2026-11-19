import * as React from 'react'
import type { StorageUnit } from '#/types/storage'
import { cn } from '#/lib/utils'

export interface UnitCardProps extends Omit<
  React.ComponentProps<'button'>,
  'onSelect'
> {
  unit: StorageUnit
  isSelected: boolean
  isDimmed?: boolean
  onSelect: (unit: StorageUnit) => void
}

export function UnitCard({
  unit,
  isSelected,
  isDimmed = false,
  onSelect,
  className,
  ...props
}: UnitCardProps) {
  const isAvailable = unit.status === 'available'
  const isSoon = unit.status === 'soon'
  const isOccupied = unit.status === 'occupied'

  let statusStyles = ''
  if (isSelected) {
    statusStyles =
      'bg-slate-900 text-white border-slate-900 ring-2 ring-slate-900/20 shadow-sm'
  } else if (isAvailable) {
    statusStyles =
      'bg-white text-slate-900 border-emerald-300 hover:border-emerald-500 hover:bg-emerald-50/40'
  } else if (isSoon) {
    statusStyles =
      'bg-white text-slate-900 border-amber-300 hover:border-amber-500 hover:bg-amber-50/40'
  } else {
    statusStyles =
      'bg-slate-100 text-slate-400 border-slate-200 opacity-75 hover:opacity-100'
  }

  const getStatusText = () => {
    if (isAvailable) return 'Ledig'
    if (isSoon) return `Ledig ${unit.availableDate.replace('. 2026', '')}`
    return 'Utleid'
  }

  return (
    <button
      type="button"
      aria-selected={isSelected}
      aria-label={`Bod ${unit.id}, ${unit.size} kvadratmeter, ${unit.price} kroner per måned`}
      onClick={() => onSelect(unit)}
      className={cn(
        'relative rounded-xl p-3 flex flex-col justify-between text-left border transition-all cursor-pointer min-h-[84px]',
        statusStyles,
        isDimmed && !isSelected && 'opacity-25 pointer-events-none',
        className,
      )}
      {...props}
    >
      {/* Top: Size & Status dot */}
      <div className="flex items-center justify-between w-full">
        <span
          className={cn(
            'font-bold text-sm sm:text-base',
            isSelected
              ? 'text-white'
              : isOccupied
                ? 'text-slate-400'
                : 'text-slate-900',
          )}
        >
          {unit.size.toFixed(1).replace('.0', '').replace('.', ',')} m²
        </span>

        <span
          className={cn(
            'size-2.5 rounded-full shrink-0',
            isAvailable
              ? 'bg-emerald-500'
              : isSoon
                ? 'bg-amber-500'
                : 'bg-slate-300',
          )}
        />
      </div>

      {/* Bottom: Price & Status label */}
      <div className="flex items-baseline justify-between mt-2 w-full">
        <span
          className={cn(
            'text-xs font-medium',
            isSelected
              ? 'text-slate-300'
              : isAvailable
                ? 'text-emerald-700'
                : isSoon
                  ? 'text-amber-700'
                  : 'text-slate-400',
          )}
        >
          {getStatusText()}
        </span>

        <span
          className={cn(
            'text-xs font-bold',
            isSelected
              ? 'text-white'
              : isOccupied
                ? 'text-slate-400'
                : 'text-slate-700',
          )}
        >
          {unit.price} kr
        </span>
      </div>
    </button>
  )
}
