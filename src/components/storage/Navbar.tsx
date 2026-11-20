import * as React from 'react'
import { Mail, Menu, X, ArrowRight } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { BrandLogo } from './BrandLogo'
import { cn } from '#/lib/utils'

export interface NavbarProps extends React.ComponentProps<'header'> {
  onReserveClick?: () => void
}

export function Navbar({ className, onReserveClick, ...props }: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { label: 'Velg bod', href: '#interactive-map' },
    // { label: 'Priser', href: '#priser' },
    { label: 'Spørsmål & svar', href: '#faq' },
    { label: 'Kontakt', href: '#kontakt' },
  ]

  const handleLinkClick = (href: string) => {
    setMobileMenuOpen(false)
    if (href === '#') {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    const target = document.querySelector(href)
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleActionClick = () => {
    setMobileMenuOpen(false)
    if (onReserveClick) {
      onReserveClick()
    } else {
      const target = document.querySelector('#interactive-map')
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' })
      }
    }
  }

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3'
          : 'bg-white/80 backdrop-blur-sm py-4',
        className,
      )}
      {...props}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault()
            handleLinkClick('#')
          }}
          className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg"
          aria-label="Leieboder.no Hjem"
        >
          <BrandLogo />
        </a>

        {/* Desktop Navigation Links */}
        <nav
          className="hidden lg:flex items-center gap-1 xl:gap-2"
          aria-label="Hovedmeny"
        >
          {navLinks.map((link) => (
            <button
              key={link.label}
              type="button"
              onClick={() => handleLinkClick(link.href)}
              className="px-3.5 py-1.5 text-sm font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
            >
              {link.label}
            </button>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-3">
          {/* Quick Email contact */}
          <a
            href="mailto:post@leieboder.no"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-primary transition-colors py-2 px-3 rounded-full hover:bg-slate-100"
            title="Send oss en e-post"
          >
            <Mail className="size-3.5 text-primary" />
            <span>plassholder@epost.no</span>
          </a>

          {/* Primary CTA */}
          <Button
            onClick={handleActionClick}
            size="sm"
            className="font-semibold rounded-full shadow-sm hover:shadow transition-all bg-primary hover:bg-[#c93d29] text-white"
          >
            <span>Lei bod nå</span>
            <ArrowRight className="size-3.5 ml-0.5" />
          </Button>

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden text-slate-700"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? 'Lukk meny' : 'Åpne meny'}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="size-5" />
            ) : (
              <Menu className="size-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
          <nav className="flex flex-col gap-1.5 mb-4">
            {navLinks.map((link) => (
              <button
                key={link.label}
                type="button"
                onClick={() => handleLinkClick(link.href)}
                className="text-left px-3.5 py-2.5 rounded-lg text-sm font-semibold text-slate-800 hover:bg-slate-100 transition-colors"
              >
                {link.label}
              </button>
            ))}
          </nav>

          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2.5">
            <a
              href="mailto:post@leieboder.no"
              className="flex items-center gap-2 text-sm font-semibold text-slate-700 py-2 px-3 rounded-lg bg-slate-50"
            >
              <Mail className="size-4 text-primary" />
              <span>Send e-post: plassholder@epost.no</span>
            </a>
            <Button
              onClick={handleActionClick}
              className="w-full font-semibold rounded-lg bg-primary hover:bg-[#c93d29] text-white"
            >
              Finn og reserver bod på kartet
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
