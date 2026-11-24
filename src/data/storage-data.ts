import type {
  StorageUnit,
  StorageLocation,
  PricingTier,
  FaqItem,
  FacilityFeature,
  UseCase,
} from '#/types/storage'

export const LOCATIONS: Record<StorageLocation['id'], StorageLocation> = {
  burmaveien: {
    id: 'burmaveien',
    name: 'Burmaveien 1',
    shortName: 'Burmaveien 1',
    address: 'Burmaveien 1',
    postalCode: '',
    city: 'Holmestrand',
    floorDescription: '1. etasje',
    ceilingHeight: '2,70 m',
    driveIn: false,
    heated: true,
    totalUnits: 18,
    availableUnits: 13,
    features: [
      'Oppvarmet og tørt året rundt',
      'Traller står klare ved inngangen',
      'Kameraovervåket og låst bygg',
    ],
  },
}

const DEFAULT_CAPACITY_ITEMS: Record<string, string[]> = {
  small: [
    'Passer for sesongutstyr, dekk, ski og flyttekasser',
    'Plass til ca. 15–20 flyttekasser',
    'Smart og rimelig ekstra bodplass',
  ],
  medium: [
    'Passer for en hybel eller liten leilighet',
    'Plass til ca. 25–35 flyttekasser',
    'Fint til sykler, ski, dekk og hagemøbler',
  ],
  large: [
    'Passer for en 1–2 roms leilighet',
    'Plass til ca. 35–45 flyttekasser, seng og sofa',
    'Fint til sesongutstyr, møbler og esker',
  ],
}

function getCapacityItems(size: number): string[] {
  if (size < 3.5) return DEFAULT_CAPACITY_ITEMS.small
  if (size < 5.5) return DEFAULT_CAPACITY_ITEMS.medium
  return DEFAULT_CAPACITY_ITEMS.large
}

function createBurmaveienUnit(params: {
  id: string
  size: number
  width: number
  length: number
  price: number
  status: StorageUnit['status']
  availableDate: string
  tag?: string
}): StorageUnit {
  const height = 2.7
  const volume = (params.size * height).toFixed(1).replace('.', ',')
  return {
    id: params.id,
    locationId: 'burmaveien',
    locationName: 'Burmaveien 1',
    size: params.size,
    price: params.price,
    status: params.status,
    availableDate: params.availableDate,
    dimensions: {
      width: params.width,
      length: params.length,
      height,
    },
    doorWidth: 0.9,
    floor: '1. Etasje',
    tag: params.tag,
    capacitySummary: `Rommer ca. ${volume} m³ volum`,
    capacityItems: getCapacityItems(params.size),
  }
}

export const STORAGE_UNITS: StorageUnit[] = [
  // Burmaveien 1 – 1. etasje (18 units matching CAD floorplan)
  // Top row (7 units, depth 3.10 m)
  createBurmaveienUnit({
    id: '101',
    size: 5.3,
    width: 1.713,
    length: 3.1,
    price: 1050,
    status: 'available',
    availableDate: 'Ledig nå',
  }),
  createBurmaveienUnit({
    id: '102',
    size: 4.9,
    width: 1.59,
    length: 3.1,
    price: 990,
    status: 'occupied',
    availableDate: 'Utleid på ubestemt tid',
  }),
  createBurmaveienUnit({
    id: '103',
    size: 4.6,
    width: 1.498,
    length: 3.1,
    price: 940,
    status: 'soon',
    availableDate: '01. mai 2026',
  }),
  createBurmaveienUnit({
    id: '104',
    size: 5.0,
    width: 1.597,
    length: 3.1,
    price: 990,
    status: 'available',
    availableDate: 'Ledig nå',
    tag: 'MEST POPULÆR',
  }),
  createBurmaveienUnit({
    id: '105',
    size: 5.0,
    width: 1.597,
    length: 3.1,
    price: 990,
    status: 'available',
    availableDate: 'Ledig nå',
  }),
  createBurmaveienUnit({
    id: '106',
    size: 4.9,
    width: 1.594,
    length: 3.1,
    price: 990,
    status: 'available',
    availableDate: 'Ledig nå',
  }),
  createBurmaveienUnit({
    id: '107',
    size: 5.3,
    width: 1.711,
    length: 3.1,
    price: 1050,
    status: 'occupied',
    availableDate: 'Utleid på ubestemt tid',
  }),

  // Middle-left block (4 units: 2×2)
  createBurmaveienUnit({
    id: '108',
    size: 4.6,
    width: 1.58,
    length: 2.9,
    price: 940,
    status: 'available',
    availableDate: 'Ledig nå',
  }),
  createBurmaveienUnit({
    id: '109',
    size: 4.6,
    width: 1.58,
    length: 2.9,
    price: 940,
    status: 'available',
    availableDate: 'Ledig nå',
  }),
  createBurmaveienUnit({
    id: '110',
    size: 4.4,
    width: 1.58,
    length: 2.8,
    price: 890,
    status: 'occupied',
    availableDate: 'Utleid på ubestemt tid',
  }),
  createBurmaveienUnit({
    id: '111',
    size: 4.4,
    width: 1.58,
    length: 2.8,
    price: 890,
    status: 'available',
    availableDate: 'Ledig nå',
  }),

  // Middle-right block (4 units, depth 3.63 m)
  createBurmaveienUnit({
    id: '112',
    size: 6.6,
    width: 1.83,
    length: 3.63,
    price: 1290,
    status: 'available',
    availableDate: 'Ledig nå',
    tag: 'XL',
  }),
  createBurmaveienUnit({
    id: '113',
    size: 5.8,
    width: 1.596,
    length: 3.63,
    price: 1150,
    status: 'available',
    availableDate: 'Ledig nå',
  }),
  createBurmaveienUnit({
    id: '114',
    size: 5.8,
    width: 1.593,
    length: 3.63,
    price: 1150,
    status: 'soon',
    availableDate: '15. mai 2026',
  }),
  createBurmaveienUnit({
    id: '115',
    size: 6.0,
    width: 1.66,
    length: 3.63,
    price: 1190,
    status: 'available',
    availableDate: 'Ledig nå',
  }),

  // Lower-right row (2 horizontal units, depth 2.00 m)
  createBurmaveienUnit({
    id: '116',
    size: 6.0,
    width: 2.955,
    length: 2.0,
    price: 1190,
    status: 'available',
    availableDate: 'Ledig nå',
  }),
  createBurmaveienUnit({
    id: '117',
    size: 6.1,
    width: 3.046,
    length: 2.0,
    price: 1220,
    status: 'available',
    availableDate: 'Ledig nå',
  }),

  // Bottom-right small unit (1.78 × 1.40 m)
  createBurmaveienUnit({
    id: '118',
    size: 2.5,
    width: 1.78,
    length: 1.4,
    price: 590,
    status: 'available',
    availableDate: 'Ledig nå',
  }),
]

export const PRICING_TIERS: PricingTier[] = [
  {
    size: 5.0,
    volume: 13.5,
    price: 990,
    suitableFor: 'Hybel / liten leilighet',
    features: [
      'Ca. 25–30 flyttekasser',
      'Passer til ski, sykler og bildekk',
      'Oppvarmet og tilgang hele døgnet',
    ],
  },
  {
    size: 6.5,
    volume: 17.5,
    price: 1290,
    popular: true,
    suitableFor: '1–2 roms leilighet',
    features: [
      'Ca. 35–45 flyttekasser',
      'Plass til sofa, seng og hvitevarer',
      'Oppvarmet og tilgang hele døgnet',
    ],
  },
  {
    size: 7.5,
    volume: 20.2,
    price: 1490,
    suitableFor: '2–3 roms leilighet',
    features: [
      'Ca. 50–65 flyttekasser',
      'Plass til spisebord, senger og skap',
      'Perfekt ved oppussing eller flytting',
    ],
  },
  {
    size: 9.0,
    volume: 24.3,
    price: 1790,
    suitableFor: '3–4 roms bolig',
    features: [
      'Ca. 70–90 flyttekasser',
      'Plass til et helt flyttelass',
      'Mulig å slå sammen flere boder',
    ],
  },
]

export const FACILITY_FEATURES: FacilityFeature[] = [
  {
    iconName: 'thermometer',
    title: 'Tørt og oppvarmet',
    description:
      'Alle bodene står innendørs med jevn varme hele året. Møbler, klær og kasser holder seg tørre og fine.',
    tagline: 'Jevn varme året rundt',
  },
  {
    iconName: 'shield',
    title: 'Trygt og låst',
    description:
      'Kun leietakere har adgang til bygget, og du låser din egen bod. Lokalene er kameraovervåket hele døgnet.',
    tagline: 'Tilgang kun for leietakere',
  },
  {
    iconName: 'truck',
    title: 'Enkelt å flytte inn',
    description:
      'Ingen trapper eller tunge løft. Lån traller gratis ved inngangen og trill tingene rett fra bilen og inn i boden.',
    tagline: 'Lån traller gratis',
  },
]

export const USE_CASES: UseCase[] = [
  {
    iconName: 'surfing',
    title: 'Sesongutstyr',
    description:
      'Få bedre plass hjemme ved å sette bort ski, dekk, hagemøbler og sportsutstyr når du ikke bruker det.',
  },
  {
    iconName: 'tool',
    title: 'Flytting og oppussing',
    description:
      'Trenger du et trygt sted å sette møblene mens du pusser opp eller er mellom to boliger? Lei så lenge du trenger.',
  },
  {
    iconName: 'box',
    title: 'Ekstra bodplass',
    description:
      'Har du rett og slett litt for mange ting? En ekstra bod gir deg oversikten og plassen tilbake i hverdagen.',
  },
]

export const FAQ_ITEMS: FaqItem[] = [
  {
    id: 'faq-1',
    question: 'Når har jeg tilgang til boden min?',
    answer:
      'Du kan låse deg inn akkurat når det passer deg – 24 timer i døgnet, alle dager i året.',
  },
  {
    id: 'faq-2',
    question: 'Er det bindingstid?',
    answer:
      'Nei, det er ingen bindingstid. Du leier fra måned til måned og sier enkelt opp når du ikke trenger boden lenger.',
  },
  {
    id: 'faq-3',
    question: 'Er det varmt i lokalene?',
    answer:
      'Ja, bygget er isolert og oppvarmet hele året, slik at tingene dine står tørt og trygt.',
  },
  {
    id: 'faq-4',
    question: 'Hvor raskt kan jeg flytte inn?',
    answer:
      'Du kan flytte inn samme dag som du bestiller. Når avtalen er bekreftet får du adgangskode på telefonen.',
  },
  {
    id: 'faq-5',
    question: 'Kan jeg få større plass enn 9 m²?',
    answer:
      'Ja! Flere av bodene våre kan slås sammen ved å fjerne skilleveggen. Ta kontakt, så ordner vi en løsning som passer deg.',
  },
]
