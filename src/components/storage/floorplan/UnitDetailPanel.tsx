import * as React from 'react'
import { Check } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import type { StorageUnit } from '#/types/storage'
import { cn } from '#/lib/utils'

export interface BookingFormData {
  fullName: string
  phone: string
  email: string
  moveInDate: string
}

export interface UnitDetailPanelProps extends React.ComponentProps<'div'> {
  unit: StorageUnit
  onBookUnit: (unit: StorageUnit, data: BookingFormData) => void
}

export function UnitDetailPanel({
  unit,
  onBookUnit,
  className,
  ...props
}: UnitDetailPanelProps) {
  const [formData, setFormData] = React.useState<BookingFormData>({
    fullName: '',
    phone: '',
    email: '',
    moveInDate: '2026-05-01',
  })

  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const isAvailable = unit.status === 'available'
  const isSoon = unit.status === 'soon'
  const isOccupied = unit.status === 'occupied'

  const getCtaText = () => {
    if (isAvailable) return 'Lei denne boden'
    if (isSoon) return `Reserver fra ${unit.availableDate}`
    return 'Sett meg på venteliste'
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setTimeout(() => {
      setIsSubmitting(false)
      onBookUnit(unit, formData)
    }, 300)
  }

  return (
    <div
      className={cn(
        'bg-white rounded-2xl p-6 shadow-xs border border-slate-200/80 flex flex-col gap-5',
        className,
      )}
      {...props}
    >
      {/* Header of selected unit */}
      <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <h3 className="text-2xl font-extrabold text-slate-900 mt-0.5">
            {unit.size.toFixed(1).replace('.0', '').replace('.', ',')} m² bod
          </h3>
          <span
            className={cn(
              'text-xs font-semibold inline-block mt-1',
              isAvailable
                ? 'text-emerald-700'
                : isSoon
                  ? 'text-amber-700'
                  : 'text-slate-500',
            )}
          >
            {isAvailable
              ? 'Ledig for innflytting nå'
              : isSoon
                ? `Blir ledig ${unit.availableDate}`
                : 'Utleid for øyeblikket'}
          </span>
        </div>

        <div className="text-right">
          <div className="flex items-baseline justify-end gap-1">
            <span className="text-2xl font-extrabold text-slate-900">
              {unit.price} kr
            </span>
            <span className="text-xs text-slate-500 font-medium">/mnd</span>
          </div>
        </div>
      </div>

      {/* What fits inside */}
      <div className="bg-slate-50 rounded-xl p-4 flex flex-col gap-2">
        <span className="text-xs font-bold text-slate-800">
          Dette får du plass til:
        </span>
        <ul className="space-y-1.5 text-sm text-slate-600">
          {unit.capacityItems.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <Check className="size-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Simple Booking Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="space-y-2.5">
          <div>
            <Label htmlFor="book-fullName" className="sr-only">
              Fullt navn
            </Label>
            <Input
              id="book-fullName"
              placeholder="Ditt navn"
              required
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              className="bg-slate-50 focus:bg-white h-10 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div>
              <Label htmlFor="book-phone" className="sr-only">
                Mobilnummer
              </Label>
              <Input
                id="book-phone"
                type="tel"
                placeholder="Mobilnummer"
                required
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="bg-slate-50 focus:bg-white h-10 text-sm"
              />
            </div>
            <div>
              <Label htmlFor="book-email" className="sr-only">
                E-post
              </Label>
              <Input
                id="book-email"
                type="email"
                placeholder="E-post"
                required
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="bg-slate-50 focus:bg-white h-10 text-sm"
              />
            </div>
          </div>

          <div>
            <Label
              htmlFor="book-date"
              className="text-xs text-slate-500 font-medium mb-1 block"
            >
              Ønsket startdato
            </Label>
            <Input
              id="book-date"
              type="date"
              value={formData.moveInDate}
              onChange={(e) =>
                setFormData({ ...formData, moveInDate: e.target.value })
              }
              className="bg-slate-50 focus:bg-white h-10 text-sm"
            />
          </div>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className={cn(
            'w-full mt-1 font-bold rounded-xl text-white',
            isOccupied
              ? 'bg-slate-800 hover:bg-slate-900'
              : 'bg-primary hover:bg-[#c93d29]',
          )}
        >
          {isSubmitting ? 'Sender...' : getCtaText()}
        </Button>
      </form>
    </div>
  )
}
