import { createServerFn } from '@tanstack/react-start'
import { STORAGE_UNITS } from '#/data/storage-data'
import {
  applyStorageUnitOverrides,
  parseStorageSheetCsv,
} from '#/lib/storage-sheet'
import type { StorageUnit } from '#/types/storage'

const DEFAULT_CACHE_TTL_MS = 120_000 // 2 minutes
const FETCH_TIMEOUT_MS = 5_000

let cachedUnits: StorageUnit[] | null = null
let cachedAt = 0
let inFlightFetch: Promise<StorageUnit[]> | null = null

function getCacheTtlMs(): number {
  const raw = process.env.STORAGE_UNITS_CACHE_TTL_SECONDS
  if (!raw) return DEFAULT_CACHE_TTL_MS
  const parsed = Number.parseInt(raw, 10)
  return Number.isFinite(parsed) && parsed > 0
    ? parsed * 1000
    : DEFAULT_CACHE_TTL_MS
}

async function fetchSheetUnits(sheetUrl: string): Promise<StorageUnit[]> {
  try {
    const response = await fetch(sheetUrl, {
      headers: { Accept: 'text/csv,text/plain;q=0.9,*/*;q=0.8' },
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${response.statusText}`)
    }

    const csvText = await response.text()
    const overrides = parseStorageSheetCsv(csvText)
    const merged = applyStorageUnitOverrides(STORAGE_UNITS, overrides)

    cachedUnits = merged
    cachedAt = Date.now()
    return merged
  } catch (error) {
    console.warn(
      '[storage-units] Failed to refresh units from Google Sheet; using cached/default data:',
      error instanceof Error ? error.message : error,
    )
    return cachedUnits ?? [...STORAGE_UNITS]
  }
}

/**
 * Loads storage units with live price/availability overrides from a published
 * Google Sheet CSV (configured via STORAGE_UNITS_SHEET_CSV_URL).
 *
 * Results are cached in memory for 2 minutes (configurable) and concurrent
 * refreshes are deduplicated so at most one request goes to Google per TTL window.
 */
export async function loadStorageUnits(): Promise<StorageUnit[]> {
  const sheetUrl = process.env.STORAGE_UNITS_SHEET_CSV_URL?.trim()
  if (!sheetUrl) {
    return [...STORAGE_UNITS]
  }

  const now = Date.now()
  if (cachedUnits && now - cachedAt < getCacheTtlMs()) {
    return cachedUnits
  }

  if (!inFlightFetch) {
    inFlightFetch = fetchSheetUnits(sheetUrl).finally(() => {
      inFlightFetch = null
    })
  }

  return inFlightFetch
}

export const getStorageUnits = createServerFn({ method: 'GET' }).handler(
  async () => loadStorageUnits(),
)
