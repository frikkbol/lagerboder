import * as React from 'react'
import { cn } from '#/lib/utils'

export interface BrandLogoProps extends React.ComponentProps<'div'> {
  variant?: 'light' | 'dark' | 'default'
  showSubtitle?: boolean
}

export function BrandLogo({
  className,
  variant = 'default',
  showSubtitle = true,
  ...props
}: BrandLogoProps) {
  const isDark = variant === 'dark'

  return (
    <div
      className={cn('flex items-center gap-2.5 select-none', className)}
      {...props}
    >
      {/* Locker Icon Badge */}
      <div className="relative flex size-10 items-center justify-center rounded-xl bg-primary text-white shadow-xs">
        <svg
          viewBox="0 0 40 40"
          className="size-7 fill-none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          {/* Storage door shutters */}
          <rect
            x="8"
            y="10"
            width="24"
            height="4"
            rx="1.5"
            fill="currentColor"
          />
          <rect
            x="8"
            y="17"
            width="24"
            height="4"
            rx="1.5"
            fill="currentColor"
          />
          <rect
            x="8"
            y="24"
            width="24"
            height="4"
            rx="1.5"
            fill="currentColor"
          />
          {/* Locker latch handle */}
          <rect x="17" y="24" width="6" height="4" rx="1" fill="#E04E39" />
        </svg>
      </div>

      {/* Typography */}
      <div className="flex flex-col leading-none">
        <div className="flex items-baseline">
          <span
            className={cn(
              'text-xl font-extrabold tracking-tight font-sans',
              isDark ? 'text-white' : 'text-slate-900',
            )}
          >
            Leieboder
          </span>
          <span className="text-xl font-extrabold tracking-tight text-primary">
            .no
          </span>
        </div>
        {showSubtitle && (
          <span
            className={cn(
              'text-[10px] font-bold uppercase tracking-wider mt-0.5',
              isDark ? 'text-slate-400' : 'text-slate-500',
            )}
          >
            Holmestrand
          </span>
        )}
      </div>
    </div>
  )
}
