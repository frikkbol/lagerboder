import * as React from 'react'
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '#/components/ui/dialog'
import { FACILITY_IMAGES } from '#/data/storage-data'
import type { FacilityImage } from '#/types/storage'
import { cn } from '#/lib/utils'

export interface FacilityGalleryProps extends React.ComponentProps<'section'> {
  images?: readonly FacilityImage[]
}

export function FacilityGallery({
  images = FACILITY_IMAGES,
  className,
  ...props
}: FacilityGalleryProps) {
  const [activeIndex, setActiveIndex] = React.useState<number | null>(null)

  const activeImage = activeIndex !== null ? images[activeIndex] : null
  const hasMultiple = images.length > 1

  const showPrevious = React.useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) return null
      return (current - 1 + images.length) % images.length
    })
  }, [images.length])

  const showNext = React.useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) return null
      return (current + 1) % images.length
    })
  }, [images.length])

  React.useEffect(() => {
    if (activeIndex === null || !hasMultiple) return

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowLeft') {
        event.preventDefault()
        showPrevious()
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        showNext()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [activeIndex, hasMultiple, showPrevious, showNext])

  if (images.length === 0) return null

  const gridClassName =
    images.length === 1
      ? 'grid grid-cols-1 max-w-md mx-auto gap-6'
      : images.length === 2
        ? 'grid grid-cols-1 sm:grid-cols-2 max-w-3xl mx-auto gap-6'
        : 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'

  return (
    <section
      id="bilder"
      className={cn(
        'w-full py-14 md:py-16 bg-white border-y border-slate-200/70 scroll-mt-16',
        className,
      )}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Bilder fra lageret
          </h2>
        </div>

        <div className={gridClassName}>
          {images.map((image, index) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setActiveIndex(index)}
              className="group text-left bg-slate-50 rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs hover:border-primary/40 hover:shadow-sm transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary cursor-pointer flex flex-col"
              aria-label={`Åpne bilde i full størrelse: ${image.alt}`}
            >
              <div className="relative w-full aspect-[4/5] overflow-hidden bg-slate-100">
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/15 transition-colors flex items-end justify-end p-3">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/95 backdrop-blur-xs px-3 py-1.5 text-xs font-semibold text-slate-800 shadow-xs opacity-90 group-hover:opacity-100 transition-opacity">
                    <ZoomIn className="size-3.5 text-primary" />
                    <span>Forstørr</span>
                  </span>
                </div>
              </div>

              {image.caption && (
                <div className="px-4 py-3.5 bg-white border-t border-slate-100">
                  <p className="text-sm font-medium text-slate-700 leading-snug">
                    {image.caption}
                  </p>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      <Dialog
        open={activeIndex !== null}
        onOpenChange={(open) => {
          if (!open) setActiveIndex(null)
        }}
      >
        <DialogContent className="max-w-4xl w-[calc(100%-2rem)] p-3 sm:p-4 bg-slate-950 border-slate-800 text-white [&>button]:text-white [&>button]:bg-slate-900/80 [&>button]:rounded-full [&>button]:p-1.5 [&>button]:right-3 [&>button]:top-3">
          {activeImage && (
            <div className="flex flex-col items-center gap-3">
              <DialogTitle className="sr-only">{activeImage.alt}</DialogTitle>
              <DialogDescription className="sr-only">
                {activeImage.caption ?? activeImage.alt}
              </DialogDescription>

              <div className="relative w-full flex items-center justify-center">
                {hasMultiple && (
                  <button
                    type="button"
                    onClick={showPrevious}
                    aria-label="Forrige bilde"
                    className="absolute left-2 z-10 size-10 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronLeft className="size-5" />
                  </button>
                )}

                <img
                  src={activeImage.src}
                  alt={activeImage.alt}
                  className="max-h-[80vh] w-auto max-w-full rounded-lg object-contain"
                />

                {hasMultiple && (
                  <button
                    type="button"
                    onClick={showNext}
                    aria-label="Neste bilde"
                    className="absolute right-2 z-10 size-10 rounded-full bg-slate-900/80 hover:bg-slate-800 text-white border border-slate-700 flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <ChevronRight className="size-5" />
                  </button>
                )}
              </div>

              {(activeImage.caption || hasMultiple) && (
                <div className="w-full flex items-center justify-between gap-4 px-2 pb-1 text-sm text-slate-300">
                  <p>{activeImage.caption ?? activeImage.alt}</p>
                  {hasMultiple && activeIndex !== null && (
                    <span className="text-xs font-medium text-slate-400 shrink-0">
                      {activeIndex + 1} / {images.length}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}
