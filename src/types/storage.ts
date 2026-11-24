export type StorageUnitStatus = 'available' | 'soon' | 'occupied'

export type StorageLocationId = 'burmaveien'

export interface StorageUnit {
  id: string
  locationId: StorageLocationId
  locationName: string
  size: number // e.g. 5.0, 6.5, 7.5, 9.0
  price: number // monthly price in NOK
  status: StorageUnitStatus
  availableDate: string // e.g. 'Ledig nå', '01. mai 2026'
  dimensions: {
    width: number
    length: number
    height: number
  }
  doorWidth: number // meters, e.g. 1.1
  floor: string // e.g. '1. Etasje' or 'Bakkeplan'
  tag?: string // e.g. 'XL', 'DRIVE-IN', 'MEST POPULÆR'
  capacitySummary: string
  capacityItems: string[]
}

export interface StorageLocation {
  id: StorageLocationId
  name: string
  shortName: string
  address: string
  postalCode: string
  city: string
  floorDescription: string
  ceilingHeight: string
  driveIn: boolean
  heated: boolean
  totalUnits: number
  availableUnits: number
  features: string[]
}

export interface PricingTier {
  size: number
  volume: number
  price: number
  popular?: boolean
  badge?: string
  suitableFor: string
  features: string[]
}

export interface FaqItem {
  id: string
  question: string
  answer: string
}

export interface FacilityFeature {
  iconName: 'thermometer' | 'shield' | 'truck' | 'clock' | 'sparkles' | 'key'
  title: string
  description: string
  tagline: string
}

export interface UseCase {
  iconName: 'surfing' | 'tool' | 'box'
  title: string
  description: string
}

export interface FacilityImage {
  id: string
  src: string
  alt: string
  caption?: string
}
