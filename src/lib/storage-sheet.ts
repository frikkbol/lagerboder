import type { StorageUnit, StorageUnitStatus } from '#/types/storage'

export interface StorageUnitOverride {
  id: string
  price?: number
  status?: StorageUnitStatus
  availableDate?: string
}

/**
 * RFC 4180 CSV parser supporting quoted fields, escaped quotes (""),
 * and both CRLF and LF line endings.
 */
export function parseCsv(csvText: string): string[][] {
  const rows: string[][] = []
  let currentRow: string[] = []
  let currentField = ''
  let inQuotes = false

  // Strip UTF-8 BOM if present
  const input = csvText.startsWith('\uFEFF') ? csvText.slice(1) : csvText

  for (let i = 0; i < input.length; i++) {
    const char = input[i]

    if (inQuotes) {
      if (char === '"') {
        if (input[i + 1] === '"') {
          currentField += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        currentField += char
      }
      continue
    }

    if (char === '"') {
      inQuotes = true
    } else if (char === ',') {
      currentRow.push(currentField)
      currentField = ''
    } else if (char === '\r') {
      if (input[i + 1] === '\n') {
        i++
      }
      currentRow.push(currentField)
      rows.push(currentRow)
      currentRow = []
      currentField = ''
    } else if (char === '\n') {
      currentRow.push(currentField)
      rows.push(currentRow)
      currentRow = []
      currentField = ''
    } else {
      currentField += char
    }
  }

  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField)
    rows.push(currentRow)
  }

  return rows.filter((row) => row.some((cell) => cell.trim().length > 0))
}

function normalizeHeader(header: string): string {
  return header.trim().toLowerCase().replace(/[\s_-]+/g, '')
}

function parseStatus(raw: string): StorageUnitStatus | undefined {
  const normalized = raw.trim().toLowerCase()
  if (!normalized) return undefined

  if (
    normalized === 'available' ||
    normalized === 'ledig' ||
    normalized === 'ledig nå' ||
    normalized === 'ledig na'
  ) {
    return 'available'
  }

  if (
    normalized === 'soon' ||
    normalized === 'snart' ||
    normalized === 'ledig snart' ||
    normalized === 'kommer snart'
  ) {
    return 'soon'
  }

  if (
    normalized === 'occupied' ||
    normalized === 'utleid' ||
    normalized === 'opptatt'
  ) {
    return 'occupied'
  }

  return undefined
}

function parsePrice(raw: string): number | undefined {
  const trimmed = raw.trim()
  if (!trimmed) return undefined

  // Allow formats like "1 050 kr", "1050,-", "1050"
  const digitsOnly = trimmed
    .replace(/kr/gi, '')
    .replace(/,-/g, '')
    .replace(/\s+/g, '')

  if (!/^\d+$/.test(digitsOnly)) return undefined

  const value = Number.parseInt(digitsOnly, 10)
  return Number.isFinite(value) && value > 0 ? value : undefined
}

const ID_HEADERS = new Set(['id', 'bod', 'bodnr', 'unit', 'unitid'])
const PRICE_HEADERS = new Set(['price', 'pris', 'månedspris', 'manedspris'])
const STATUS_HEADERS = new Set(['status', 'tilgjengelighet'])
const DATE_HEADERS = new Set([
  'availabledate',
  'ledigfra',
  'dato',
  'tilgjengeligfra',
])

export function parseStorageSheetCsv(
  csvText: string,
): Map<string, StorageUnitOverride> {
  const rows = parseCsv(csvText)
  const overrides = new Map<string, StorageUnitOverride>()

  if (rows.length < 2) return overrides

  const headers = rows[0].map(normalizeHeader)
  const idIdx = headers.findIndex((h) => ID_HEADERS.has(h))
  if (idIdx === -1) return overrides

  const priceIdx = headers.findIndex((h) => PRICE_HEADERS.has(h))
  const statusIdx = headers.findIndex((h) => STATUS_HEADERS.has(h))
  const dateIdx = headers.findIndex((h) => DATE_HEADERS.has(h))

  for (let i = 1; i < rows.length; i++) {
    const row = rows[i]
    const rawId = (row[idIdx] ?? '').trim().replace(/^#/, '')
    if (!rawId) continue

    const price = priceIdx >= 0 ? parsePrice(row[priceIdx] ?? '') : undefined
    const status =
      statusIdx >= 0 ? parseStatus(row[statusIdx] ?? '') : undefined
    const availableDate =
      dateIdx >= 0 ? (row[dateIdx] ?? '').trim() || undefined : undefined

    overrides.set(rawId, {
      id: rawId,
      price,
      status,
      availableDate,
    })
  }

  return overrides
}

function defaultAvailableDateForStatus(
  status: StorageUnitStatus,
  fallback: string,
): string {
  if (status === 'available') return 'Ledig nå'
  if (status === 'occupied') return 'Utleid på ubestemt tid'
  return fallback || 'Ledig snart'
}

export function applyStorageUnitOverrides(
  baseUnits: readonly StorageUnit[],
  overrides: ReadonlyMap<string, StorageUnitOverride>,
): StorageUnit[] {
  if (overrides.size === 0) return [...baseUnits]

  return baseUnits.map((unit) => {
    const override = overrides.get(unit.id)
    if (!override) return unit

    const nextStatus = override.status ?? unit.status
    const statusChanged =
      override.status !== undefined && override.status !== unit.status

    const nextAvailableDate =
      override.availableDate ??
      (statusChanged
        ? defaultAvailableDateForStatus(nextStatus, unit.availableDate)
        : unit.availableDate)

    return {
      ...unit,
      price: override.price ?? unit.price,
      status: nextStatus,
      availableDate: nextAvailableDate,
    }
  })
}
