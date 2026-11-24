import type { StorageLocationId } from '#/types/storage'

export type FloorplanSide = 'top' | 'right' | 'bottom' | 'left'

export type FloorplanDoorOffset = 'start' | 'center' | 'end'

export type FloorplanEntranceKind = 'door' | 'gate' | 'loading-bay'

export type FloorplanOrientation = 'horizontal' | 'vertical'

export interface FloorplanUnitPlacement {
  unitId: string
  /** Distance from left interior wall in meters */
  x: number
  /** Distance from top interior wall in meters */
  y: number
  /** Width along X axis in meters */
  width: number
  /** Depth/height along Y axis in meters */
  height: number
  /** Which side of the unit has the door opening */
  doorSide?: FloorplanSide
  /** Position of the door along its wall (default: 'center') */
  doorOffset?: FloorplanDoorOffset
}

export interface FloorplanCorridor {
  id: string
  x: number
  y: number
  width: number
  height: number
  label?: string
  orientation: FloorplanOrientation
}

export interface FloorplanEntrance {
  id: string
  label: string
  kind: FloorplanEntranceKind
  /** Anchor coordinate in meters (along top/bottom wall: left edge of opening; along left/right wall: wall X) */
  x: number
  /** Anchor coordinate in meters (along left/right wall: top edge of opening; along top/bottom wall: wall Y) */
  y: number
  /** Opening width in meters */
  width: number
  side: FloorplanSide
}

export interface FloorplanZone {
  id: string
  label: string
  x: number
  y: number
  width: number
  height: number
}

export interface FloorplanLayout {
  id: string
  locationId: StorageLocationId
  name: string
  /** Total interior width in meters */
  width: number
  /** Total interior height in meters */
  height: number
  /** Background meter grid spacing in meters */
  gridStep: number
  /** Optional default rendering scale in pixels per meter */
  pixelsPerMeter?: number
  units: readonly FloorplanUnitPlacement[]
  corridors: readonly FloorplanCorridor[]
  entrances: readonly FloorplanEntrance[]
  zones: readonly FloorplanZone[]
}
