import * as React from 'react'
import type { FloorplanUnitPlacement } from '#/types/floorplan'
import type { StorageUnit } from '#/types/storage'

export interface FloorplanUnitProps {
  unit: StorageUnit
  placement: FloorplanUnitPlacement
  scale: number
  isSelected: boolean
  isDimmed?: boolean
  onSelect: (unit: StorageUnit) => void
}

function formatUnitSize(size: number): string {
  return size.toFixed(1).replace('.0', '').replace('.', ',')
}

export function FloorplanUnit({
  unit,
  placement,
  scale,
  isSelected,
  isDimmed = false,
  onSelect,
}: FloorplanUnitProps) {
  const [isHovered, setIsHovered] = React.useState(false)

  const isAvailable = unit.status === 'available'
  const isSoon = unit.status === 'soon'
  const isOccupied = unit.status === 'occupied'

  const wallInset = 2
  const x = placement.x * scale + wallInset
  const y = placement.y * scale + wallInset
  const width = Math.max(0, placement.width * scale - wallInset * 2)
  const height = Math.max(0, placement.height * scale - wallInset * 2)

  let fill = '#ffffff'
  let stroke = '#6ee7b7' // emerald-300
  let strokeWidth = 1.5
  let sizeColor = '#0f172a' // slate-900
  let statusColor = '#047857' // emerald-700
  let priceColor = '#334155' // slate-700
  let dotColor = '#10b981' // emerald-500
  let idColor = '#94a3b8' // slate-400
  let doorColor = '#10b981'

  if (isSelected) {
    fill = '#0f172a' // slate-900
    stroke = '#0f172a'
    strokeWidth = 2.5
    sizeColor = '#ffffff'
    statusColor = '#cbd5e1' // slate-300
    priceColor = '#ffffff'
    dotColor = isAvailable ? '#10b981' : isSoon ? '#f59e0b' : '#ef4444'
    idColor = '#94a3b8'
    doorColor = '#ffffff'
  } else if (isAvailable) {
    fill = isHovered ? '#ecfdf5' : '#ffffff'
    stroke = isHovered ? '#10b981' : '#6ee7b7'
    sizeColor = '#0f172a'
    statusColor = '#047857'
    priceColor = '#334155'
    dotColor = '#10b981'
    idColor = '#94a3b8'
    doorColor = '#10b981'
  } else if (isSoon) {
    fill = isHovered ? '#fffbeb' : '#ffffff'
    stroke = isHovered ? '#f59e0b' : '#fcd34d'
    sizeColor = '#0f172a'
    statusColor = '#b45309' // amber-700
    priceColor = '#334155'
    dotColor = '#f59e0b'
    idColor = '#94a3b8'
    doorColor = '#f59e0b'
  } else {
    fill = isHovered ? '#b91c1c' : '#dc2626' // red-700 / red-600
    stroke = '#b91c1c'
    sizeColor = '#ffffff'
    statusColor = '#fee2e2' // red-100
    priceColor = '#ffffff'
    dotColor = 'rgba(255,255,255,0.85)'
    idColor = 'rgba(255,255,255,0.7)'
    doorColor = 'rgba(255,255,255,0.85)'
  }

  const getStatusText = () => {
    if (isAvailable) return 'Ledig'
    if (isSoon) return `Ledig ${unit.availableDate.replace('. 2026', '')}`
    return 'Utleid'
  }

  const handleKeyDown = (e: React.KeyboardEvent<SVGGElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      onSelect(unit)
    }
  }

  const isNarrow = width < 120
  const isShort = height < 100
  const isCompact = isNarrow || isShort

  // Door indicator dimensions (scaled from unit.doorWidth, capped to fit unit edge)
  const isVerticalWall =
    placement.doorSide === 'left' || placement.doorSide === 'right'
  const wallSpan = isVerticalWall ? height : width
  const doorLength = Math.min(unit.doorWidth * scale * 0.78, wallSpan * 0.62)
  const doorMargin = Math.min(10, Math.max(4, (wallSpan - doorLength) * 0.15))

  const getDoorAxisPos = (start: number, span: number) => {
    const offset = placement.doorOffset ?? 'center'
    if (offset === 'start') return start + doorMargin
    if (offset === 'end') return start + span - doorLength - doorMargin
    return start + (span - doorLength) / 2
  }

  const renderDoorIndicator = () => {
    if (!placement.doorSide || doorLength <= 0) return null
    const thickness = 3.5

    switch (placement.doorSide) {
      case 'top':
        return (
          <rect
            x={getDoorAxisPos(x, width)}
            y={y - thickness / 2}
            width={doorLength}
            height={thickness}
            rx={1.5}
            fill={doorColor}
          />
        )
      case 'bottom':
        return (
          <rect
            x={getDoorAxisPos(x, width)}
            y={y + height - thickness / 2}
            width={doorLength}
            height={thickness}
            rx={1.5}
            fill={doorColor}
          />
        )
      case 'left':
        return (
          <rect
            x={x - thickness / 2}
            y={getDoorAxisPos(y, height)}
            width={thickness}
            height={doorLength}
            rx={1.5}
            fill={doorColor}
          />
        )
      case 'right':
        return (
          <rect
            x={x + width - thickness / 2}
            y={getDoorAxisPos(y, height)}
            width={thickness}
            height={doorLength}
            rx={1.5}
            fill={doorColor}
          />
        )
    }
  }

  return (
    <g
      role="button"
      tabIndex={isDimmed && !isSelected ? -1 : 0}
      aria-pressed={isSelected}
      aria-label={
        isOccupied
          ? `Bod ${unit.id}, ${unit.size} kvadratmeter, utleid`
          : `Bod ${unit.id}, ${unit.size} kvadratmeter, ${unit.price} kroner per måned`
      }
      onClick={() => onSelect(unit)}
      onKeyDown={handleKeyDown}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      opacity={isDimmed && !isSelected ? 0.25 : 1}
      style={{
        cursor: isDimmed && !isSelected ? 'default' : 'pointer',
        pointerEvents: isDimmed && !isSelected ? 'none' : 'auto',
      }}
      className="outline-none focus-visible:[&_.unit-focus-ring]:opacity-100"
    >
      {/* Selected outer halo */}
      {isSelected && (
        <rect
          x={x - 2.5}
          y={y - 2.5}
          width={width + 5}
          height={height + 5}
          rx={10}
          fill="none"
          stroke="rgba(15, 23, 42, 0.22)"
          strokeWidth={3}
        />
      )}

      {/* Keyboard focus ring */}
      <rect
        className="unit-focus-ring opacity-0 transition-opacity"
        x={x - 3}
        y={y - 3}
        width={width + 6}
        height={height + 6}
        rx={10}
        fill="none"
        stroke="#2563eb"
        strokeWidth={2}
      />

      {/* Main unit footprint */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={8}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
        style={{ transition: 'fill 150ms ease, stroke 150ms ease' }}
      />

      {/* Door opening indicator */}
      {renderDoorIndicator()}

      {/* Clipped, wrapping unit content */}
      <foreignObject
        x={x}
        y={y}
        width={width}
        height={height}
        style={{ pointerEvents: 'none' }}
      >
        <div
          className="w-full h-full overflow-hidden flex flex-col justify-between box-border"
          style={{
            padding: isCompact ? '7px 8px' : '10px 11px',
          }}
        >
          {/* Top: size + status dot + optional unit ID */}
          <div className="min-w-0">
            <div className="flex items-start justify-between gap-1">
              <span
                className="font-bold leading-tight break-words min-w-0"
                style={{
                  color: sizeColor,
                  fontSize: isNarrow ? '13.5px' : '15px',
                }}
              >
                {formatUnitSize(unit.size)} m²
              </span>
              <span
                className="rounded-full shrink-0 mt-1"
                style={{
                  width: '8.5px',
                  height: '8.5px',
                  backgroundColor: dotColor,
                }}
              />
            </div>

            {height >= 115 && (
              <div
                className="font-medium leading-tight break-words mt-0.5"
                style={{
                  color: idColor,
                  fontSize: '11px',
                }}
              >
                #{unit.id}
                {width >= 135
                  ? ` · ${placement.width}×${placement.height} m`
                  : ''}
              </div>
            )}
          </div>

          {/* Bottom: status + price (wraps cleanly when narrow) */}
          <div
            className={
              isNarrow
                ? 'flex flex-col gap-0.5 min-w-0'
                : 'flex flex-wrap items-baseline justify-between gap-x-1.5 gap-y-0.5 min-w-0'
            }
          >
            {isNarrow && !isOccupied && (
              <span
                className="font-bold leading-tight break-words"
                style={{
                  color: priceColor,
                  fontSize: '11.5px',
                }}
              >
                {unit.price} kr
              </span>
            )}
            <span
              className="font-semibold leading-tight break-words min-w-0"
              style={{
                color: statusColor,
                fontSize: isCompact ? '11px' : '12px',
              }}
            >
              {getStatusText()}
            </span>
            {!isNarrow && !isOccupied && (
              <span
                className="font-bold leading-tight whitespace-nowrap"
                style={{
                  color: priceColor,
                  fontSize: isCompact ? '11px' : '12px',
                }}
              >
                {unit.price} kr
              </span>
            )}
          </div>
        </div>
      </foreignObject>
    </g>
  )
}
