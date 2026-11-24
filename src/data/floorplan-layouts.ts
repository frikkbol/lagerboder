import { STORAGE_UNITS } from '#/data/storage-data'
import { createFloorplan } from '#/lib/floorplan-builder'
import type { FloorplanLayout } from '#/types/floorplan'
import type { StorageLocationId } from '#/types/storage'

const WALL = 0.1 // 100 mm interior partition walls

/**
 * Burmaveien 1 – 1. etasje (11.900 m × 11.860 m interior, true-to-scale from CAD drawing).
 *
 * All 18 units inherit their exact millimeter-converted width × length from STORAGE_UNITS,
 * separated by 100 mm (0.1 m) partition walls, with doorSide and doorOffset matching the drawing.
 */
export const BURMAVEIEN_FLOORPLAN: FloorplanLayout = createFloorplan({
  id: 'burmaveien-1etg',
  locationId: 'burmaveien',
  name: '1. etasje',
  width: 11.9,
  height: 11.86,
  unitsCatalog: STORAGE_UNITS,
})
  // Top row: 7 units (depth 3.10 m, doors opening south into top corridor)
  .addRow({
    x: 0,
    y: 0,
    gap: WALL,
    doorSide: 'bottom',
    units: [
      { unitId: '101', doorOffset: 'end' },
      { unitId: '102', doorOffset: 'end' },
      { unitId: '103', doorOffset: 'start' },
      { unitId: '104', doorOffset: 'start' },
      { unitId: '105', doorOffset: 'start' },
      { unitId: '106', doorOffset: 'start' },
      { unitId: '107', doorOffset: 'start' },
    ],
  })

  // Top horizontal corridor (3.10 + 0.10 wall = 3.20; height 1.33 m)
  .addHorizontalCorridor({
    id: 'corridor-top',
    y: 3.2,
    height: 1.33,
    label: 'Gang',
  })

  // Middle-left block (upper pair: y = 3.10 + 0.10 + 1.338 + 0.10 = 4.638, depth 2.90 m)
  .addRow({
    x: 0,
    y: 4.638,
    gap: WALL,
    units: [
      { unitId: '108', doorSide: 'top', doorOffset: 'start' },
      { unitId: '109', doorSide: 'right', doorOffset: 'start' },
    ],
  })

  // Middle-left block (lower pair: y = 4.638 + 2.90 + 0.10 = 7.638, depth 2.80 m)
  .addRow({
    x: 0,
    y: 7.638,
    gap: WALL,
    units: [
      { unitId: '110', doorSide: 'bottom', doorOffset: 'start' },
      { unitId: '111', doorSide: 'right', doorOffset: 'start' },
    ],
  })

  // Vertical central corridor (x = 1.58 + 0.10 + 1.58 + 0.10 = 3.36, width 1.461 m)
  .corridor({
    id: 'corridor-vertical',
    x: 3.36,
    y: 4.53,
    width: 1.461,
    height: 3.83,
    label: 'Gang',
    orientation: 'vertical',
  })

  // Middle-right block (4 units: x = 3.36 + 1.461 + 0.10 = 4.921, y = 4.63, depth 3.63 m)
  .addRow({
    x: 4.921,
    y: 4.63,
    gap: WALL,
    units: [
      { unitId: '112', doorSide: 'left', doorOffset: 'start' },
      { unitId: '113', doorSide: 'top', doorOffset: 'start' },
      { unitId: '114', doorSide: 'top', doorOffset: 'start' },
      { unitId: '115', doorSide: 'top', doorOffset: 'start' },
    ],
  })

  // Lower-right row (2 horizontal units: y = 4.63 + 3.63 + 0.10 = 8.36, depth 2.00 m)
  .addRow({
    x: 5.799,
    y: 8.36,
    gap: WALL,
    units: [
      { unitId: '116', doorSide: 'left', doorOffset: 'start' },
      { unitId: '117', doorSide: 'bottom', doorOffset: 'end' },
    ],
  })

  // Bottom-right small unit (1.78 × 1.40 m, door opening east into Gang 2,0 m²)
  .unit({
    unitId: '118',
    x: 8.62,
    y: 10.46,
    doorSide: 'right',
    doorOffset: 'center',
  })

  // Open lobby / SEKSJON area connecting vertical corridor, stairs, and entrances
  .corridor({
    id: 'lobby-center',
    x: 3.36,
    y: 8.36,
    width: 2.339,
    height: 2.1,
    orientation: 'horizontal',
  })
  .corridor({
    id: 'lobby-bottom',
    x: 0,
    y: 10.538,
    width: 5.15,
    height: 1.322,
    label: 'Inngangsparti',
    orientation: 'horizontal',
  })

  // Bottom-right corridor (Gang 2,0 m²: 1.40 × 1.40 m)
  .corridor({
    id: 'corridor-bottom-right',
    x: 10.5,
    y: 10.46,
    width: 1.4,
    height: 1.4,
    label: 'Gang',
    orientation: 'horizontal',
  })

  // Stairs to 2nd floor
  .zone({
    id: 'stairs',
    label: 'Trapp',
    x: 5.15,
    y: 10.46,
    width: 3.37,
    height: 1.4,
  })

  // Bottom entrances: left door (Inngang), wide loading gate (Port), and bottom-right door into Gang 2,0 m²
  .entrance({
    id: 'entrance-door-left',
    x: 0.25,
    y: 11.86,
    width: 1.0,
    side: 'bottom',
    label: 'Inngang',
    kind: 'door',
  })
  .entrance({
    id: 'entrance-gate',
    x: 1.75,
    y: 11.86,
    width: 3.2,
    side: 'bottom',
    label: 'Port',
    kind: 'gate',
  })
  .entrance({
    id: 'entrance-door-right',
    x: 10.7,
    y: 11.86,
    width: 1.0,
    side: 'bottom',
    label: 'Inngang',
    kind: 'door',
  })
  .build()

export const FLOORPLANS_BY_LOCATION: Record<
  StorageLocationId,
  readonly FloorplanLayout[]
> = {
  burmaveien: [BURMAVEIEN_FLOORPLAN],
}

export function getFloorplansForLocation(
  locationId: StorageLocationId,
): readonly FloorplanLayout[] {
  return FLOORPLANS_BY_LOCATION[locationId]
}
