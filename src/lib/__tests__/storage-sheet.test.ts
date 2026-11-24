import assert from 'node:assert/strict'
import { describe, it } from 'node:test'
import { STORAGE_UNITS } from '#/data/storage-data'
import {
  applyStorageUnitOverrides,
  parseCsv,
  parseStorageSheetCsv,
} from '#/lib/storage-sheet'

describe('Google Sheets CSV parsing & storage unit overrides', () => {
  it('parses quoted CSV fields and CRLF line endings', () => {
    const rows = parseCsv(
      'Bod,Pris,Status,Ledig fra\r\n101,"1 190 kr",Ledig,"Ledig nå"\r\n102,990,Utleid,""\r\n',
    )
    assert.equal(rows.length, 3)
    assert.deepEqual(rows[1], ['101', '1 190 kr', 'Ledig', 'Ledig nå'])
  })

  it('applies Norwegian headers, formatted prices, statuses, and automatic date defaults', () => {
    const csv = [
      'Bod,Pris,Status,Ledig fra',
      '#101,"1 250 kr",Utleid,',
      '102,1090,Ledig,',
      '104,1150,Ledig snart,01. juni 2026',
      '201,750,Ledig,Ledig nå',
    ].join('\n')

    const overrides = parseStorageSheetCsv(csv)
    const merged = applyStorageUnitOverrides(STORAGE_UNITS, overrides)

    const u101 = merged.find((u) => u.id === '101')
    assert.ok(u101)
    assert.equal(u101.price, 1250)
    assert.equal(u101.status, 'occupied')
    assert.equal(u101.availableDate, 'Utleid på ubestemt tid')
    // Physical dimensions must remain unchanged
    assert.equal(u101.dimensions.width, 1.713)

    const u102 = merged.find((u) => u.id === '102')
    assert.ok(u102)
    assert.equal(u102.price, 1090)
    assert.equal(u102.status, 'available')
    assert.equal(u102.availableDate, 'Ledig nå')

    const u104 = merged.find((u) => u.id === '104')
    assert.ok(u104)
    assert.equal(u104.price, 1150)
    assert.equal(u104.status, 'soon')
    assert.equal(u104.availableDate, '01. juni 2026')

    const u201 = merged.find((u) => u.id === '201')
    assert.ok(u201)
    assert.equal(u201.price, 750)
  })

  it('safely ignores invalid cells and unknown unit IDs without breaking defaults', () => {
    const csv = [
      'id,price,status,availableDate',
      '101,not-a-number,invalid-status,',
      '999,500,available,Ledig nå',
    ].join('\n')

    const overrides = parseStorageSheetCsv(csv)
    const merged = applyStorageUnitOverrides(STORAGE_UNITS, overrides)

    const base101 = STORAGE_UNITS.find((u) => u.id === '101')
    const merged101 = merged.find((u) => u.id === '101')
    assert.deepEqual(merged101, base101)
    assert.equal(merged.length, STORAGE_UNITS.length)
  })
})
