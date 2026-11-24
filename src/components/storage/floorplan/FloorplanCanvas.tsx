import * as React from 'react'
import { FloorplanUnit } from './FloorplanUnit'
import type { FloorplanEntrance, FloorplanLayout } from '#/types/floorplan'
import type {
  StorageLocation,
  StorageUnit,
  StorageUnitStatus,
} from '#/types/storage'
import { cn } from '#/lib/utils'

export interface FloorplanCanvasProps extends React.ComponentProps<'div'> {
  location: StorageLocation
  layout: FloorplanLayout
  floorplans?: readonly FloorplanLayout[]
  onSelectFloorplan?: (layout: FloorplanLayout) => void
  units: readonly StorageUnit[]
  selectedUnit: StorageUnit
  onSelectUnit: (unit: StorageUnit) => void
  statusFilter?: StorageUnitStatus | 'all'
  /** Pixels per meter for true-to-scale SVG rendering (default: 56) */
  pixelsPerMeter?: number
}

function renderEntrance(entrance: FloorplanEntrance, scale: number) {
  const openingPx = entrance.width * scale
  const xPx = entrance.x * scale
  const yPx = entrance.y * scale
  const badgeHeight = 25
  const badgeWidth = Math.max(66, entrance.label.length * 8.2 + 20)

  if (entrance.side === 'left' || entrance.side === 'right') {
    const isLeft = entrance.side === 'left'
    const centerY = yPx + openingPx / 2
    const badgeX = isLeft ? xPx - badgeWidth - 10 : xPx + 10
    const arrowX1 = isLeft ? xPx - 7 : xPx + 7
    const arrowX2 = isLeft ? xPx + 7 : xPx - 7

    return (
      <g key={entrance.id} aria-label={`${entrance.label}`}>
        {/* Wall opening gap */}
        <line
          x1={xPx}
          y1={yPx}
          x2={xPx}
          y2={yPx + openingPx}
          stroke="#f8fafc"
          strokeWidth={5}
        />
        {/* Opening threshold bar */}
        <line
          x1={xPx}
          y1={yPx + 4}
          x2={xPx}
          y2={yPx + openingPx - 4}
          stroke="#0f172a"
          strokeWidth={2.5}
          strokeDasharray="4 3"
        />
        {/* Entry direction arrow */}
        <line
          x1={arrowX1}
          y1={centerY}
          x2={arrowX2}
          y2={centerY}
          stroke="#475569"
          strokeWidth={1.75}
          strokeLinecap="round"
        />
        <polyline
          points={
            isLeft
              ? `${arrowX2 - 4},${centerY - 3.5} ${arrowX2},${centerY} ${arrowX2 - 4},${centerY + 3.5}`
              : `${arrowX2 + 4},${centerY - 3.5} ${arrowX2},${centerY} ${arrowX2 + 4},${centerY + 3.5}`
          }
          fill="none"
          stroke="#475569"
          strokeWidth={1.75}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        {/* Label badge */}
        <rect
          x={badgeX}
          y={centerY - badgeHeight / 2}
          width={badgeWidth}
          height={badgeHeight}
          rx={6}
          fill="#ffffff"
          stroke="#cbd5e1"
          strokeWidth={1}
        />
        <text
          x={badgeX + badgeWidth / 2}
          y={centerY + 4}
          textAnchor="middle"
          fill="#334155"
          fontSize={12}
          fontWeight={600}
          fontFamily="inherit"
        >
          {entrance.label}
        </text>
      </g>
    )
  }

  // Top or bottom wall entrance
  const isTop = entrance.side === 'top'
  const centerX = xPx + openingPx / 2
  const badgeY = isTop ? yPx - badgeHeight - 10 : yPx + 10
  const arrowY1 = isTop ? yPx - 7 : yPx + 7
  const arrowY2 = isTop ? yPx + 7 : yPx - 7

  return (
    <g key={entrance.id} aria-label={`${entrance.label}`}>
      {/* Wall opening gap */}
      <line
        x1={xPx}
        y1={yPx}
        x2={xPx + openingPx}
        y2={yPx}
        stroke="#f8fafc"
        strokeWidth={5}
      />
      {/* Opening threshold bar */}
      <line
        x1={xPx + 4}
        y1={yPx}
        x2={xPx + openingPx - 4}
        y2={yPx}
        stroke="#0f172a"
        strokeWidth={2.5}
        strokeDasharray="4 3"
      />
      {/* Entry direction arrow */}
      <line
        x1={centerX}
        y1={arrowY1}
        x2={centerX}
        y2={arrowY2}
        stroke="#475569"
        strokeWidth={1.75}
        strokeLinecap="round"
      />
      <polyline
        points={
          isTop
            ? `${centerX - 3.5},${arrowY2 - 4} ${centerX},${arrowY2} ${centerX + 3.5},${arrowY2 - 4}`
            : `${centerX - 3.5},${arrowY2 + 4} ${centerX},${arrowY2} ${centerX + 3.5},${arrowY2 + 4}`
        }
        fill="none"
        stroke="#475569"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Label badge */}
      <rect
        x={centerX - badgeWidth / 2}
        y={badgeY}
        width={badgeWidth}
        height={badgeHeight}
        rx={6}
        fill="#ffffff"
        stroke="#cbd5e1"
        strokeWidth={1}
      />
      <text
        x={centerX}
        y={badgeY + badgeHeight / 2 + 4}
        textAnchor="middle"
        fill="#334155"
        fontSize={12}
        fontWeight={600}
        fontFamily="inherit"
      >
        {entrance.label}
      </text>
    </g>
  )
}

export function FloorplanCanvas({
  location,
  layout,
  floorplans,
  onSelectFloorplan,
  units,
  selectedUnit,
  onSelectUnit,
  statusFilter = 'all',
  pixelsPerMeter,
  className,
  ...props
}: FloorplanCanvasProps) {
  const scale = pixelsPerMeter ?? layout.pixelsPerMeter ?? 64
  const isUnitMatching = (u: StorageUnit) => {
    if (statusFilter === 'available') return u.status === 'available'
    if (statusFilter === 'soon') return u.status === 'soon'
    return true
  }

  const unitMap = React.useMemo(
    () => new Map(units.map((u) => [u.id, u])),
    [units],
  )

  const hasLeftEntrance = layout.entrances.some((e) => e.side === 'left')
  const hasRightEntrance = layout.entrances.some((e) => e.side === 'right')
  const hasTopEntrance = layout.entrances.some((e) => e.side === 'top')
  const hasBottomEntrance = layout.entrances.some((e) => e.side === 'bottom')

  const padLeft = hasLeftEntrance ? 92 : 16
  const padRight = hasRightEntrance ? 92 : 16
  const padTop = hasTopEntrance ? 50 : 16
  const padBottom = hasBottomEntrance ? 50 : 16
  const scaleBarBand = 26

  const interiorWidthPx = layout.width * scale
  const interiorHeightPx = layout.height * scale
  const svgWidth = interiorWidthPx + padLeft + padRight
  const svgHeight = interiorHeightPx + padTop + padBottom + scaleBarBand

  const gridPatternId = React.useId()
  const gridStepPx = layout.gridStep * scale

  const showFloorTabs =
    floorplans !== undefined &&
    floorplans.length > 1 &&
    onSelectFloorplan !== undefined

  return (
    <div
      className={cn(
        'bg-white rounded-2xl p-4 sm:p-6 shadow-xs border border-slate-200/80 flex flex-col',
        className,
      )}
      {...props}
    >
      {/* Header & Legend */}
      <div className="flex flex-wrap items-center justify-between pb-4 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="font-bold text-slate-900 text-base">
            {location.name}
          </span>
          {!showFloorTabs && layout.name && (
            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
              {layout.name}
            </span>
          )}
        </div>

        {/* Color legend */}
        <div className="flex items-center gap-4 text-xs font-medium text-slate-600">
          <div className="flex items-center gap-1.5">
            <span className="size-3 rounded-sm bg-emerald-200 border border-emerald-500" />
            <span>Ledig</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-3 rounded-sm bg-amber-100 border border-amber-500" />
            <span>Ledig snart</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-3 rounded-sm bg-slate-200 border border-slate-300" />
            <span>Utleid</span>
          </div>
        </div>
      </div>

      {/* Optional Floor / Zone Switcher */}
      {showFloorTabs && (
        <div
          role="tablist"
          aria-label="Velg etasje eller sone"
          className="inline-flex flex-wrap items-center gap-1.5 mt-4 p-1 bg-slate-100 rounded-xl w-fit"
        >
          {floorplans.map((fp) => {
            const isActive = fp.id === layout.id
            const floorAvailableCount = fp.units.filter(
              (p) => unitMap.get(p.unitId)?.status === 'available',
            ).length
            return (
              <button
                key={fp.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => onSelectFloorplan(fp)}
                className={cn(
                  'px-3.5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all cursor-pointer flex items-center gap-2',
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900',
                )}
              >
                <span>{fp.name}</span>
                <span
                  className={cn(
                    'text-[11px] font-medium px-1.5 py-0.5 rounded-md',
                    isActive
                      ? 'bg-white/15 text-slate-200'
                      : 'bg-slate-200/80 text-slate-600',
                  )}
                >
                  {floorAvailableCount} ledige
                </span>
              </button>
            )
          })}
        </div>
      )}

      {/* True-to-scale SVG Blueprint (horizontally scrollable on narrow mobile screens) */}
      <div className="w-full bg-slate-50 rounded-xl p-2 sm:p-3 mt-4 overflow-x-auto">
        <div
          className="w-full mx-auto"
          style={{
            minWidth: `${Math.round(svgWidth * 0.9)}px`,
          }}
        >
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto block select-none"
            role="img"
            aria-label={`Plantegning for ${location.name}, ${layout.name}`}
          >
            <defs>
              <pattern
                id={gridPatternId}
                width={gridStepPx}
                height={gridStepPx}
                patternUnits="userSpaceOnUse"
              >
                <path
                  d={`M ${gridStepPx} 0 L 0 0 0 ${gridStepPx}`}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth={0.75}
                />
              </pattern>
            </defs>

            <g transform={`translate(${padLeft}, ${padTop})`}>
              {/* Interior floor background + meter grid */}
              <rect
                x={0}
                y={0}
                width={interiorWidthPx}
                height={interiorHeightPx}
                rx={10}
                fill="#f8fafc"
              />
              <rect
                x={0}
                y={0}
                width={interiorWidthPx}
                height={interiorHeightPx}
                rx={10}
                fill={`url(#${gridPatternId})`}
                opacity={0.7}
              />

              {/* Corridors */}
              {layout.corridors.map((corridor) => {
                const cx = corridor.x * scale
                const cy = corridor.y * scale
                const cw = corridor.width * scale
                const ch = corridor.height * scale
                const isVertical = corridor.orientation === 'vertical'
                const labelX = cx + cw / 2
                const labelY = cy + ch / 2

                return (
                  <g key={corridor.id}>
                    <rect
                      x={cx}
                      y={cy}
                      width={cw}
                      height={ch}
                      rx={4}
                      fill="#f1f5f9"
                    />
                    {/* Subtle center guide line */}
                    {isVertical ? (
                      <line
                        x1={labelX}
                        y1={cy + 8}
                        x2={labelX}
                        y2={cy + ch - 8}
                        stroke="#cbd5e1"
                        strokeWidth={1}
                        strokeDasharray="4 6"
                      />
                    ) : (
                      <line
                        x1={cx + 8}
                        y1={labelY}
                        x2={cx + cw - 8}
                        y2={labelY}
                        stroke="#cbd5e1"
                        strokeWidth={1}
                        strokeDasharray="4 6"
                      />
                    )}
                    {corridor.label && (
                      <g
                        transform={
                          isVertical
                            ? `rotate(-90 ${labelX} ${labelY})`
                            : undefined
                        }
                      >
                        <rect
                          x={labelX - Math.max(28, corridor.label.length * 4.5)}
                          y={labelY - 11}
                          width={Math.max(56, corridor.label.length * 9)}
                          height={22}
                          rx={4}
                          fill="#f1f5f9"
                        />
                        <text
                          x={labelX}
                          y={labelY + 4}
                          textAnchor="middle"
                          fill="#64748b"
                          fontSize={12.5}
                          fontWeight={600}
                          fontFamily="inherit"
                        >
                          {corridor.label}
                        </text>
                      </g>
                    )}
                  </g>
                )
              })}

              {/* Non-rentable zones */}
              {layout.zones.map((zone) => {
                const zx = zone.x * scale
                const zy = zone.y * scale
                const zw = zone.width * scale
                const zh = zone.height * scale

                return (
                  <g key={zone.id}>
                    <rect
                      x={zx + 2}
                      y={zy + 2}
                      width={Math.max(0, zw - 4)}
                      height={Math.max(0, zh - 4)}
                      rx={6}
                      fill="#e2e8f0"
                      stroke="#cbd5e1"
                      strokeWidth={1}
                      strokeDasharray="3 3"
                    />
                    <text
                      x={zx + zw / 2}
                      y={zy + zh / 2 + 4}
                      textAnchor="middle"
                      fill="#64748b"
                      fontSize={12.5}
                      fontWeight={600}
                      fontFamily="inherit"
                    >
                      {zone.label}
                    </text>
                  </g>
                )
              })}

              {/* Outer building perimeter wall */}
              <rect
                x={0}
                y={0}
                width={interiorWidthPx}
                height={interiorHeightPx}
                rx={10}
                fill="none"
                stroke="#cbd5e1"
                strokeWidth={2}
              />

              {/* Storage units */}
              {layout.units.map((placement) => {
                const unit = unitMap.get(placement.unitId)
                if (!unit) return null

                return (
                  <FloorplanUnit
                    key={placement.unitId}
                    unit={unit}
                    placement={placement}
                    scale={scale}
                    isSelected={selectedUnit.id === unit.id}
                    isDimmed={!isUnitMatching(unit)}
                    onSelect={onSelectUnit}
                  />
                )
              })}

              {/* Entrances / Gates / Loading Bays */}
              {layout.entrances.map((entrance) =>
                renderEntrance(entrance, scale),
              )}

              {/* True-to-scale 1 m bar (sits in dedicated bottom band below any bottom entrances) */}
              <g
                transform={`translate(${interiorWidthPx - scale}, ${interiorHeightPx + padBottom + 4})`}
                aria-label="1 meter"
              >
                <line
                  x1={0}
                  y1={0}
                  x2={scale}
                  y2={0}
                  stroke="#64748b"
                  strokeWidth={1.5}
                />
                <line
                  x1={0}
                  y1={-3.5}
                  x2={0}
                  y2={3.5}
                  stroke="#64748b"
                  strokeWidth={1.5}
                />
                <line
                  x1={scale}
                  y1={-3.5}
                  x2={scale}
                  y2={3.5}
                  stroke="#64748b"
                  strokeWidth={1.5}
                />
                <text
                  x={scale / 2}
                  y={15}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize={11.5}
                  fontWeight={600}
                  fontFamily="inherit"
                >
                  1 m
                </text>
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
  )
}
