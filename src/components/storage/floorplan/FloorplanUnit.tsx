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
  const hatchPatternId = React.useId()

  const isAvailable = unit.status === 'available'
  const isSoon = unit.status === 'soon'
  const isOccupied = unit.status === 'occupied'

  const wallInset = 2
  const x = placement.x * scale + wallInset
  const y = placement.y * scale + wallInset
  const width = Math.max(0, placement.width * scale - wallInset * 2)
  const height = Math.max(0, placement.height * scale - wallInset * 2)

  let fill = '#d1fae5'
  let stroke = '#10b981'
  let strokeWidth = 2
  let sizeColor = '#064e3b'
  let statusColor = '#047857'
  let priceColor = '#065f46'
  let dotColor = '#10b981'
  let idColor = '#059669'
  let doorColor = '#059669'

  if (isSelected) {
    fill = '#0f172a' // slate-900
    stroke = '#0f172a'
    strokeWidth = 2.5
    sizeColor = '#ffffff'
    statusColor = '#cbd5e1' // slate-300
    priceColor = '#ffffff'
    dotColor = isAvailable ? '#34d399' : isSoon ? '#fbbf24' : '#94a3b8'
    idColor = '#94a3b8'
    doorColor = '#ffffff'
  } else if (isAvailable) {
    fill = isHovered ? '#a7f3d0' : '#d1fae5' // emerald-200 / emerald-100
    stroke = isHovered ? '#059669' : '#10b981' // emerald-600 / emerald-500
    strokeWidth = 2
    sizeColor = '#064e3b' // emerald-950
    statusColor = '#047857' // emerald-700
    priceColor = '#065f46' // emerald-800
    dotColor = '#10b981'
    idColor = '#059669' // emerald-600
    doorColor = '#059669'
  } else if (isSoon) {
    fill = isHovered ? '#fde68a' : '#fef3c7' // amber-200 / amber-100
    stroke = isHovered ? '#d97706' : '#f59e0b' // amber-600 / amber-500
    strokeWidth = 1.75
    sizeColor = '#78350f' // amber-900
    statusColor = '#b45309' // amber-700
    priceColor = '#92400e' // amber-800
    dotColor = '#f59e0b'
    idColor = '#b45309'
    doorColor = '#d97706'
  } else {
    fill = isHovered ? '#e2e8f0' : '#f1f5f9' // slate-200 / slate-100
    stroke = isHovered ? '#94a3b8' : '#cbd5e1' // slate-400 / slate-300
    strokeWidth = 1.25
    sizeColor = '#64748b' // slate-500
    statusColor = '#94a3b8' // slate-400
    priceColor = '#94a3b8'
    dotColor = '#94a3b8'
    idColor = '#94a3b8'
    doorColor = '#94a3b8'
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
        style={{
          transition: 'fill 150ms ease, stroke 150ms ease',
          filter:
            isAvailable && !isSelected
              ? 'drop-shadow(0 1px 2px rgba(16, 185, 129, 0.18))'
              : undefined,
        }}
      />

      {/* Subtle diagonal hatching for occupied units so they visually recede */}
      {isOccupied && !isSelected && (
        <>
          <defs>
            <pattern
              id={hatchPatternId}
              width={8}
              height={8}
              patternTransform="rotate(45)"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1={0}
                y1={0}
                x2={0}
                y2={8}
                stroke="#cbd5e1"
                strokeWidth={1.25}
              />
            </pattern>
          </defs>
          <rect
            x={x + 0.75}
            y={y + 0.75}
            width={Math.max(0, width - 1.5)}
            height={Math.max(0, height - 1.5)}
            rx={7.25}
            fill={`url(#${hatchPatternId})`}
            opacity={0.55}
            style={{ pointerEvents: 'none' }}
          />
        </>
      )}

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
              {/* <span
                className="rounded-full shrink-0 mt-1"
                style={{
                  width: '8.5px',
                  height: '8.5px',
                  backgroundColor: dotColor,
                }}
              /> */}
            </div>

            {height >= 78 && (
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
