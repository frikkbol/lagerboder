import * as React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '#/components/ui/dialog'
import { Button } from '#/components/ui/button'
import { CheckCircle2 } from 'lucide-react'
import type { StorageUnit } from '#/types/storage'
import type { BookingFormData } from './floorplan/UnitDetailPanel'

export interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  unit: StorageUnit | null
  formData: BookingFormData | null
}

export function BookingModal({
  isOpen,
  onClose,
  unit,
  formData,
}: BookingModalProps) {
  if (!unit) return null

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="mx-auto size-12 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 mb-2">
            <CheckCircle2 className="size-7" />
          </div>
          <DialogTitle className="text-center text-xl font-bold text-slate-900">
            Vi har mottatt din bestilling
          </DialogTitle>
          <DialogDescription className="text-center text-sm text-slate-600">
            Takk{formData?.fullName ? `, ${formData.fullName}` : ''}! Vi har
            holdt av boden til deg.
          </DialogDescription>
        </DialogHeader>

        <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 my-2 flex flex-col gap-2 text-sm text-slate-700">
          <div className="flex items-center justify-between">
            <span className="text-slate-500">Valgt bod:</span>
            <span className="font-bold text-slate-900">
              {unit.size.toFixed(1).replace('.0', '').replace('.', ',')} m² (Bod{' '}
              {unit.id})
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Adresse:</span>
            <span className="font-medium text-slate-900">
              {unit.locationName}, Holmestrand
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-slate-500">Månedspris:</span>
            <span className="font-bold text-slate-900">
              {unit.price} kr / mnd
            </span>
          </div>

          {formData?.moveInDate && (
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Startdato:</span>
              <span className="font-medium text-slate-900">
                {formData.moveInDate}
              </span>
            </div>
          )}
        </div>

        <p className="text-xs text-slate-500 text-center px-2">
          Vi sender deg en SMS til {formData?.phone || 'ditt mobilnummer'} med
          bekreftelse og adgangskode til bygget.
        </p>

        <DialogFooter className="mt-2">
          <Button
            onClick={onClose}
            className="w-full font-bold bg-primary hover:bg-brand-hover text-white"
          >
            Ferdig
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
