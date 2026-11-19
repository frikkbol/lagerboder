import * as React from 'react'
import { Phone, Mail, MapPin, CheckCircle2 } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { Input } from '#/components/ui/input'
import { Label } from '#/components/ui/label'
import { Textarea } from '#/components/ui/textarea'
import { cn } from '#/lib/utils'

export interface ContactSectionProps extends React.ComponentProps<'section'> {}

export function ContactSection({ className, ...props }: ContactSectionProps) {
  const [submitted, setSubmitted] = React.useState(false)
  const [formData, setFormData] = React.useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section
      id="kontakt"
      className={cn('w-full py-16 md:py-20 scroll-mt-16', className)}
      {...props}
    >
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl p-7 sm:p-10 shadow-xs border border-slate-200/80 grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
          {/* Left Column: Contact info */}
          <div className="md:col-span-5 flex flex-col gap-6">
            <div>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Kontakt oss
              </h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Lurer du på hvilken størrelse du bør velge, eller har du andre
                spørsmål? Ring oss eller send en melding.
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                  <Phone className="size-4" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Telefon</span>
                  <a
                    href="tel:+4733000000"
                    className="text-base font-bold text-slate-900 hover:text-primary transition-colors"
                  >
                    33 00 00 00
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                  <Mail className="size-4" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">E-post</span>
                  <a
                    href="mailto:post@leieboder.no"
                    className="text-base font-bold text-slate-900 hover:text-primary transition-colors"
                  >
                    post@leieboder.no
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-800 shrink-0">
                  <MapPin className="size-4" />
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">
                    Adresser i Holmestrand
                  </span>
                  <span className="text-sm font-semibold text-slate-900 block">
                    Harestien 15 &amp; Beverstien 3
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="md:col-span-7 bg-slate-50 border border-slate-200/70 p-6 rounded-xl flex flex-col gap-4">
            {submitted ? (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-xl p-6 text-center space-y-3">
                <div className="mx-auto size-11 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                  <CheckCircle2 className="size-6" />
                </div>
                <h4 className="font-bold text-base">Takk for meldingen!</h4>
                <p className="text-sm text-emerald-800">
                  Vi tar kontakt med deg så snart som mulig.
                </p>
                <Button
                  onClick={() => setSubmitted(false)}
                  variant="outline"
                  size="sm"
                  className="mt-2 text-xs"
                >
                  Send en ny melding
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <Label
                    htmlFor="contact-name"
                    className="text-xs font-semibold text-slate-700 mb-1 block"
                  >
                    Navn
                  </Label>
                  <Input
                    id="contact-name"
                    required
                    placeholder="Ditt navn"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="bg-white h-10 text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <Label
                      htmlFor="contact-phone"
                      className="text-xs font-semibold text-slate-700 mb-1 block"
                    >
                      Telefon
                    </Label>
                    <Input
                      id="contact-phone"
                      type="tel"
                      required
                      placeholder="Mobilnummer"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="bg-white h-10 text-sm"
                    />
                  </div>
                  <div>
                    <Label
                      htmlFor="contact-email"
                      className="text-xs font-semibold text-slate-700 mb-1 block"
                    >
                      E-post
                    </Label>
                    <Input
                      id="contact-email"
                      type="email"
                      required
                      placeholder="Din e-post"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="bg-white h-10 text-sm"
                    />
                  </div>
                </div>

                <div>
                  <Label
                    htmlFor="contact-msg"
                    className="text-xs font-semibold text-slate-700 mb-1 block"
                  >
                    Melding
                  </Label>
                  <Textarea
                    id="contact-msg"
                    rows={4}
                    required
                    placeholder="Hva kan vi hjelpe deg med?"
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="bg-white text-sm"
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full font-bold bg-primary hover:bg-[#c93d29] text-white"
                >
                  Send melding
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
