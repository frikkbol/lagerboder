import type {
  FloorplanCorridor,
  FloorplanDoorOffset,
  FloorplanEntrance,
  FloorplanEntranceKind,
  FloorplanLayout,
  FloorplanOrientation,
  FloorplanSide,
  FloorplanUnitPlacement,
  FloorplanZone,
} from '#/types/floorplan'
import type { StorageLocationId, StorageUnit } from '#/types/storage'

const EPSILON = 1e-6

export interface FloorplanBuilderOptions {
  id: string
  locationId: StorageLocationId
  name: string
  /** Catalog of storage units used to resolve default width/length and validate unit IDs */
  unitsCatalog: readonly StorageUnit[]
  /** Optional explicit interior width in meters (auto-computed from content if omitted) */
  width?: number
  /** Optional explicit interior height in meters (auto-computed from content if omitted) */
  height?: number
  /** Meter grid step for background grid lines (default: 1) */
  gridStep?: number
  /** Optional default rendering scale in pixels per meter */
  pixelsPerMeter?: number
}

export interface UnitPlacementInput {
  unitId: string
  x: number
  y: number
  width?: number
  height?: number
  /** Swap width and length from the unit's dimensions */
  rotate?: boolean
  doorSide?: FloorplanSide
  doorOffset?: FloorplanDoorOffset
}

export type FlowUnitItem =
  | string
  | {
      unitId: string
      width?: number
      height?: number
      rotate?: boolean
      doorSide?: FloorplanSide
      doorOffset?: FloorplanDoorOffset
    }

export interface AddRowOptions {
  x: number
  y: number
  /** Gap between adjacent units in meters (default: 0) */
  gap?: number
  /** Vertical alignment of units with different depths within the row (default: 'top') */
  align?: 'top' | 'bottom'
  /** Default door side applied to units in this row unless overridden per unit */
  doorSide?: FloorplanSide
  /** Default door offset along the wall unless overridden per unit */
  doorOffset?: FloorplanDoorOffset
  units: readonly FlowUnitItem[]
}

export interface AddColumnOptions {
  x: number
  y: number
  /** Gap between adjacent units in meters (default: 0) */
  gap?: number
  /** Horizontal alignment of units with different widths within the column (default: 'left') */
  align?: 'left' | 'right'
  /** Default door side applied to units in this column unless overridden per unit */
  doorSide?: FloorplanSide
  /** Default door offset along the wall unless overridden per unit */
  doorOffset?: FloorplanDoorOffset
  units: readonly FlowUnitItem[]
}

export interface CorridorInput {
  id?: string
  x: number
  y: number
  width: number
  height: number
  label?: string
  orientation?: FloorplanOrientation
}

export interface HorizontalCorridorInput {
  id?: string
  y: number
  height: number
  /** Left start in meters (default: 0) */
  x?: number
  /** Width in meters (defaults to full floorplan width when omitted) */
  width?: number
  label?: string
}

export interface VerticalCorridorInput {
  id?: string
  x: number
  width: number
  /** Top start in meters (default: 0) */
  y?: number
  /** Height in meters (defaults to full floorplan height when omitted) */
  height?: number
  label?: string
}

export interface EntranceInput {
  id?: string
  label: string
  kind?: FloorplanEntranceKind
  x: number
  y: number
  /** Opening width in meters (default: 1.4) */
  width?: number
  side: FloorplanSide
}

export interface ZoneInput {
  id?: string
  label: string
  x: number
  y: number
  width: number
  height: number
}

interface PendingCorridor {
  id: string
  x: number
  y: number
  width?: number
  height?: number
  label?: string
  orientation: FloorplanOrientation
}

export class FloorplanValidationError extends Error {
  readonly issues: readonly string[]

  constructor(layoutId: string, issues: readonly string[]) {
    super(
      `Invalid floorplan "${layoutId}":\n${issues.map((issue) => `  - ${issue}`).join('\n')}`,
    )
    this.name = 'FloorplanValidationError'
    this.issues = issues
  }
}

function roundMeters(value: number): number {
  return Math.round(value * 1000) / 1000
}

function rectsOverlap(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number },
): boolean {
  const aRight = a.x + a.width
  const aBottom = a.y + a.height
  const bRight = b.x + b.width
  const bBottom = b.y + b.height

  return (
    a.x < bRight - EPSILON &&
    aRight > b.x + EPSILON &&
    a.y < bBottom - EPSILON &&
    aBottom > b.y + EPSILON
  )
}

export function validateFloorplan(
  layout: FloorplanLayout,
  unitsCatalog: readonly StorageUnit[],
): string[] {
  const issues: string[] = []
  const unitMap = new Map(unitsCatalog.map((u) => [u.id, u]))
  const seenUnitIds = new Set<string>()

  if (layout.width <= 0 || layout.height <= 0) {
    issues.push(
      `Floorplan dimensions must be positive (got ${layout.width}m × ${layout.height}m).`,
    )
  }

  for (const placement of layout.units) {
    if (!unitMap.has(placement.unitId)) {
      issues.push(
        `Unknown unitId "${placement.unitId}" is not present in unitsCatalog.`,
      )
    }

    if (seenUnitIds.has(placement.unitId)) {
      issues.push(
        `Duplicate placement for unitId "${placement.unitId}" in floorplan "${layout.id}".`,
      )
    }
    seenUnitIds.add(placement.unitId)

    if (placement.width <= 0 || placement.height <= 0) {
      issues.push(
        `Unit "${placement.unitId}" has non-positive dimensions (${placement.width}m × ${placement.height}m).`,
      )
    }

    if (
      placement.x < -EPSILON ||
      placement.y < -EPSILON ||
      placement.x + placement.width > layout.width + EPSILON ||
      placement.y + placement.height > layout.height + EPSILON
    ) {
      issues.push(
        `Unit "${placement.unitId}" (${placement.x}, ${placement.y}, ${placement.width}×${placement.height}) extends outside floorplan bounds (${layout.width}×${layout.height}).`,
      )
    }
  }

  for (let i = 0; i < layout.units.length; i++) {
    for (let j = i + 1; j < layout.units.length; j++) {
      const a = layout.units[i]
      const b = layout.units[j]
      if (rectsOverlap(a, b)) {
        issues.push(
          `Units "${a.unitId}" and "${b.unitId}" overlap in floorplan "${layout.id}".`,
        )
      }
    }
  }

  for (const corridor of layout.corridors) {
    if (corridor.width <= 0 || corridor.height <= 0) {
      issues.push(
        `Corridor "${corridor.id}" has non-positive dimensions (${corridor.width}m × ${corridor.height}m).`,
      )
    }
    if (
      corridor.x < -EPSILON ||
      corridor.y < -EPSILON ||
      corridor.x + corridor.width > layout.width + EPSILON ||
      corridor.y + corridor.height > layout.height + EPSILON
    ) {
      issues.push(
        `Corridor "${corridor.id}" extends outside floorplan bounds (${layout.width}×${layout.height}).`,
      )
    }
  }

  for (const zone of layout.zones) {
    if (zone.width <= 0 || zone.height <= 0) {
      issues.push(
        `Zone "${zone.id}" has non-positive dimensions (${zone.width}m × ${zone.height}m).`,
      )
    }
    if (
      zone.x < -EPSILON ||
      zone.y < -EPSILON ||
      zone.x + zone.width > layout.width + EPSILON ||
      zone.y + zone.height > layout.height + EPSILON
    ) {
      issues.push(
        `Zone "${zone.id}" extends outside floorplan bounds (${layout.width}×${layout.height}).`,
      )
    }
  }

  return issues
}

class FloorplanBuilder {
  private readonly options: FloorplanBuilderOptions
  private readonly unitMap: Map<string, StorageUnit>
  private readonly units: FloorplanUnitPlacement[] = []
  private readonly pendingCorridors: PendingCorridor[] = []
  private readonly entrances: FloorplanEntrance[] = []
  private readonly zones: FloorplanZone[] = []

  constructor(options: FloorplanBuilderOptions) {
    this.options = options
    this.unitMap = new Map(options.unitsCatalog.map((u) => [u.id, u]))
  }

  private resolveUnitDimensions(item: {
    unitId: string
    width?: number
    height?: number
    rotate?: boolean
  }): { width: number; height: number } {
    const catalogUnit = this.unitMap.get(item.unitId)
    const baseWidth = catalogUnit?.dimensions.width ?? 0
    const baseLength = catalogUnit?.dimensions.length ?? 0

    const defaultWidth = item.rotate ? baseLength : baseWidth
    const defaultHeight = item.rotate ? baseWidth : baseLength

    return {
      width: roundMeters(item.width ?? defaultWidth),
      height: roundMeters(item.height ?? defaultHeight),
    }
  }

  unit(input: UnitPlacementInput): this {
    const { width, height } = this.resolveUnitDimensions(input)
    this.units.push({
      unitId: input.unitId,
      x: roundMeters(input.x),
      y: roundMeters(input.y),
      width,
      height,
      doorSide: input.doorSide,
      doorOffset: input.doorOffset,
    })
    return this
  }

  addRow(options: AddRowOptions): this {
    const gap = options.gap ?? 0
    const align = options.align ?? 'top'

    const resolved = options.units.map((entry) => {
      const normalized = typeof entry === 'string' ? { unitId: entry } : entry
      const dims = this.resolveUnitDimensions(normalized)
      return {
        unitId: normalized.unitId,
        width: dims.width,
        height: dims.height,
        doorSide: normalized.doorSide ?? options.doorSide,
        doorOffset: normalized.doorOffset ?? options.doorOffset,
      }
    })

    const maxHeight = resolved.reduce((max, u) => Math.max(max, u.height), 0)
    let cursorX = options.x

    for (const item of resolved) {
      const y =
        align === 'bottom' ? options.y + (maxHeight - item.height) : options.y

      this.units.push({
        unitId: item.unitId,
        x: roundMeters(cursorX),
        y: roundMeters(y),
        width: item.width,
        height: item.height,
        doorSide: item.doorSide,
        doorOffset: item.doorOffset,
      })

      cursorX += item.width + gap
    }

    return this
  }

  addColumn(options: AddColumnOptions): this {
    const gap = options.gap ?? 0
    const align = options.align ?? 'left'

    const resolved = options.units.map((entry) => {
      const normalized = typeof entry === 'string' ? { unitId: entry } : entry
      const dims = this.resolveUnitDimensions(normalized)
      return {
        unitId: normalized.unitId,
        width: dims.width,
        height: dims.height,
        doorSide: normalized.doorSide ?? options.doorSide,
        doorOffset: normalized.doorOffset ?? options.doorOffset,
      }
    })

    const maxWidth = resolved.reduce((max, u) => Math.max(max, u.width), 0)
    let cursorY = options.y

    for (const item of resolved) {
      const x =
        align === 'right' ? options.x + (maxWidth - item.width) : options.x

      this.units.push({
        unitId: item.unitId,
        x: roundMeters(x),
        y: roundMeters(cursorY),
        width: item.width,
        height: item.height,
        doorSide: item.doorSide,
        doorOffset: item.doorOffset,
      })

      cursorY += item.height + gap
    }

    return this
  }

  corridor(input: CorridorInput): this {
    const orientation: FloorplanOrientation =
      input.orientation ??
      (input.width >= input.height ? 'horizontal' : 'vertical')

    this.pendingCorridors.push({
      id: input.id ?? `corridor-${this.pendingCorridors.length + 1}`,
      x: roundMeters(input.x),
      y: roundMeters(input.y),
      width: roundMeters(input.width),
      height: roundMeters(input.height),
      label: input.label,
      orientation,
    })
    return this
  }

  addHorizontalCorridor(input: HorizontalCorridorInput): this {
    this.pendingCorridors.push({
      id: input.id ?? `corridor-${this.pendingCorridors.length + 1}`,
      x: roundMeters(input.x ?? 0),
      y: roundMeters(input.y),
      width: input.width !== undefined ? roundMeters(input.width) : undefined,
      height: roundMeters(input.height),
      label: input.label,
      orientation: 'horizontal',
    })
    return this
  }

  addVerticalCorridor(input: VerticalCorridorInput): this {
    this.pendingCorridors.push({
      id: input.id ?? `corridor-${this.pendingCorridors.length + 1}`,
      x: roundMeters(input.x),
      y: roundMeters(input.y ?? 0),
      width: roundMeters(input.width),
      height:
        input.height !== undefined ? roundMeters(input.height) : undefined,
      label: input.label,
      orientation: 'vertical',
    })
    return this
  }

  entrance(input: EntranceInput): this {
    this.entrances.push({
      id: input.id ?? `entrance-${this.entrances.length + 1}`,
      label: input.label,
      kind: input.kind ?? 'door',
      x: roundMeters(input.x),
      y: roundMeters(input.y),
      width: roundMeters(input.width ?? 1.4),
      side: input.side,
    })
    return this
  }

  zone(input: ZoneInput): this {
    this.zones.push({
      id: input.id ?? `zone-${this.zones.length + 1}`,
      label: input.label,
      x: roundMeters(input.x),
      y: roundMeters(input.y),
      width: roundMeters(input.width),
      height: roundMeters(input.height),
    })
    return this
  }

  build(): FloorplanLayout {
    let maxRight = 0
    let maxBottom = 0

    for (const u of this.units) {
      maxRight = Math.max(maxRight, u.x + u.width)
      maxBottom = Math.max(maxBottom, u.y + u.height)
    }

    for (const z of this.zones) {
      maxRight = Math.max(maxRight, z.x + z.width)
      maxBottom = Math.max(maxBottom, z.y + z.height)
    }

    for (const c of this.pendingCorridors) {
      if (c.width !== undefined) {
        maxRight = Math.max(maxRight, c.x + c.width)
      }
      if (c.height !== undefined) {
        maxBottom = Math.max(maxBottom, c.y + c.height)
      }
    }

    const totalWidth = roundMeters(this.options.width ?? maxRight)
    const totalHeight = roundMeters(this.options.height ?? maxBottom)

    const resolvedCorridors: FloorplanCorridor[] = this.pendingCorridors.map(
      (c) => ({
        id: c.id,
        x: c.x,
        y: c.y,
        width: roundMeters(c.width ?? totalWidth - c.x),
        height: roundMeters(c.height ?? totalHeight - c.y),
        label: c.label,
        orientation: c.orientation,
      }),
    )

    const layout: FloorplanLayout = {
      id: this.options.id,
      locationId: this.options.locationId,
      name: this.options.name,
      width: totalWidth,
      height: totalHeight,
      gridStep: this.options.gridStep ?? 1,
      pixelsPerMeter: this.options.pixelsPerMeter,
      units: Object.freeze([...this.units]),
      corridors: Object.freeze(resolvedCorridors),
      entrances: Object.freeze([...this.entrances]),
      zones: Object.freeze([...this.zones]),
    }

    const issues = validateFloorplan(layout, this.options.unitsCatalog)
    if (issues.length > 0) {
      throw new FloorplanValidationError(layout.id, issues)
    }

    return Object.freeze(layout)
  }
}

export function createFloorplan(
  options: FloorplanBuilderOptions,
): FloorplanBuilder {
  return new FloorplanBuilder(options)
}
