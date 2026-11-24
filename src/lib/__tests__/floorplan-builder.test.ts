import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import {
  BURMAVEIEN_FLOORPLAN,
  BURMAVEIEN_FLOORPLAN_2ETG,
  FLOORPLANS_BY_LOCATION,
} from '#/data/floorplan-layouts'
import { STORAGE_UNITS } from '#/data/storage-data'
import {
  FloorplanValidationError,
  createFloorplan,
  validateFloorplan,
} from '#/lib/floorplan-builder'

describe('createFloorplan builder & validation', () => {
  it('builds BURMAVEIEN_FLOORPLAN (1. etasje) and BURMAVEIEN_FLOORPLAN_2ETG (2. etasje) covering all 24 units', () => {
    assert.equal(BURMAVEIEN_FLOORPLAN.width, 11.9)
    assert.equal(BURMAVEIEN_FLOORPLAN.height, 11.86)
    assert.equal(BURMAVEIEN_FLOORPLAN.units.length, 18)
    assert.equal(BURMAVEIEN_FLOORPLAN.entrances.length, 3)
    assert.equal(BURMAVEIEN_FLOORPLAN.zones.length, 1)

    assert.equal(BURMAVEIEN_FLOORPLAN_2ETG.width, 5.3)
    assert.equal(BURMAVEIEN_FLOORPLAN_2ETG.height, 5.47)
    assert.equal(BURMAVEIEN_FLOORPLAN_2ETG.units.length, 6)
    assert.equal(BURMAVEIEN_FLOORPLAN_2ETG.corridors.length, 1)
    assert.equal(BURMAVEIEN_FLOORPLAN_2ETG.zones.length, 1)

    assert.equal(FLOORPLANS_BY_LOCATION.burmaveien.length, 2)

    assert.deepEqual(validateFloorplan(BURMAVEIEN_FLOORPLAN, STORAGE_UNITS), [])
    assert.deepEqual(
      validateFloorplan(BURMAVEIEN_FLOORPLAN_2ETG, STORAGE_UNITS),
      [],
    )

    const placedIds = new Set([
      ...BURMAVEIEN_FLOORPLAN.units.map((u) => u.unitId),
      ...BURMAVEIEN_FLOORPLAN_2ETG.units.map((u) => u.unitId),
    ])
    for (const unit of STORAGE_UNITS) {
      assert.ok(
        placedIds.has(unit.id),
        `Expected unit ${unit.id} to be placed on a Burmaveien floorplan`,
      )
    }

    // Verify specific CAD door placements
    const unit117 = BURMAVEIEN_FLOORPLAN.units.find((u) => u.unitId === '117')
    assert.ok(unit117)
    assert.equal(unit117.doorSide, 'bottom')
    assert.equal(unit117.doorOffset, 'end')

    const unit201 = BURMAVEIEN_FLOORPLAN_2ETG.units.find(
      (u) => u.unitId === '201',
    )
    assert.ok(unit201)
    assert.equal(unit201.doorSide, 'bottom')
    assert.equal(unit201.doorOffset, 'end')
  })

  it('resolves unit dimensions from catalog and supports rotation', () => {
    const layout = createFloorplan({
      id: 'test-rotate',
      locationId: 'burmaveien',
      name: 'Test',
      unitsCatalog: STORAGE_UNITS,
    })
      .unit({ unitId: '101', x: 0, y: 0 }) // 1.713 × 3.1
      .unit({ unitId: '116', x: 2.0, y: 0, rotate: true }) // 2.955 × 2.0 -> rotated 2.0 × 2.955
      .build()

    assert.equal(layout.units[0].width, 1.713)
    assert.equal(layout.units[0].height, 3.1)
    assert.equal(layout.units[1].width, 2.0)
    assert.equal(layout.units[1].height, 2.955)
    assert.equal(layout.width, 4.0)
    assert.equal(layout.height, 3.1)
  })

  it('supports addRow alignment (bottom/top) and auto-spanning horizontal corridors', () => {
    const layout = createFloorplan({
      id: 'test-row',
      locationId: 'burmaveien',
      name: 'Row Test',
      unitsCatalog: STORAGE_UNITS,
    })
      .addRow({
        x: 0,
        y: 0,
        align: 'bottom',
        gap: 0.1,
        doorSide: 'bottom',
        units: ['118', '101'], // 1.78×1.4 and 1.713×3.1
      })
      .addHorizontalCorridor({ y: 3.1, height: 1.5, label: 'Gang' })
      .build()

    // 118 has height 1.4 inside a 3.1m tall row, aligned bottom => y = 1.7
    assert.equal(layout.units[0].x, 0)
    assert.equal(layout.units[0].y, 1.7)
    assert.equal(layout.units[0].doorSide, 'bottom')

    // 101 starts at 1.78 + 0.1 = 1.88, height 3.1 => y = 0
    assert.equal(layout.units[1].x, 1.88)
    assert.equal(layout.units[1].y, 0)

    // Auto-spanning horizontal corridor matches total width (3.593m)
    assert.equal(layout.corridors[0].width, 3.593)
    assert.equal(layout.corridors[0].height, 1.5)
    assert.equal(layout.corridors[0].orientation, 'horizontal')
  })

  it('supports addColumn alignment (right) and auto-spanning vertical corridors', () => {
    const layout = createFloorplan({
      id: 'test-col',
      locationId: 'burmaveien',
      name: 'Col Test',
      unitsCatalog: STORAGE_UNITS,
    })
      .addColumn({
        x: 0,
        y: 0,
        align: 'right',
        doorSide: 'right',
        units: ['118', '116'], // 1.78×1.4 and 2.955×2.0
      })
      .addVerticalCorridor({ x: 2.955, width: 1.5, label: 'Gang' })
      .build()

    // 118 has width 1.78 inside a 2.955m wide column, aligned right => x = 1.175
    assert.equal(layout.units[0].x, 1.175)
    assert.equal(layout.units[0].y, 0)
    assert.equal(layout.units[1].x, 0)
    assert.equal(layout.units[1].y, 1.4)

    // Vertical corridor spans full height (3.4m)
    assert.equal(layout.corridors[0].x, 2.955)
    assert.equal(layout.corridors[0].width, 1.5)
    assert.equal(layout.corridors[0].height, 3.4)
    assert.equal(layout.corridors[0].orientation, 'vertical')
  })

  it('throws FloorplanValidationError on overlapping units', () => {
    assert.throws(
      () =>
        createFloorplan({
          id: 'test-overlap',
          locationId: 'burmaveien',
          name: 'Overlap',
          unitsCatalog: STORAGE_UNITS,
        })
          .unit({ unitId: '101', x: 0, y: 0 })
          .unit({ unitId: '102', x: 1.0, y: 0 })
          .build(),
      (err: unknown) =>
        err instanceof FloorplanValidationError &&
        err.issues.some((issue) => issue.includes('overlap')),
    )
  })

  it('throws FloorplanValidationError on duplicate or unknown unit IDs', () => {
    assert.throws(
      () =>
        createFloorplan({
          id: 'test-dup-unknown',
          locationId: 'burmaveien',
          name: 'Dup',
          unitsCatalog: STORAGE_UNITS,
        })
          .unit({ unitId: '101', x: 0, y: 0 })
          .unit({ unitId: '101', x: 3, y: 0 })
          .unit({ unitId: '999', x: 6, y: 0, width: 2, height: 2 })
          .build(),
      (err: unknown) =>
        err instanceof FloorplanValidationError &&
        err.issues.some((issue) => issue.includes('Duplicate')) &&
        err.issues.some((issue) => issue.includes('Unknown unitId "999"')),
    )
  })

  it('throws FloorplanValidationError when a unit exceeds explicit bounds', () => {
    assert.throws(
      () =>
        createFloorplan({
          id: 'test-bounds',
          locationId: 'burmaveien',
          name: 'Bounds',
          unitsCatalog: STORAGE_UNITS,
          width: 4,
          height: 4,
        })
          .unit({ unitId: '117', x: 2, y: 0 }) // 2 + 3.046 = 5.046 > 4
          .build(),
      (err: unknown) =>
        err instanceof FloorplanValidationError &&
        err.issues.some((issue) => issue.includes('outside floorplan bounds')),
    )
  })
})
