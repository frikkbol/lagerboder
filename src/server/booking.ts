import { createServerFn } from '@tanstack/react-start'
import { Resend } from 'resend'
import { z } from 'zod'
import { loadStorageUnits } from '#/server/storage-units'

const bookingRequestSchema = z.object({
  unitId: z.string().min(1, 'Ugyldig bod'),
  fullName: z.string().trim().min(2, 'Vennligst oppgi navnet ditt').max(120),
  phone: z.string().trim().min(6, 'Vennligst oppgi et gyldig mobilnummer').max(30),
  email: z.string().trim().email('Vennligst oppgi en gyldig e-postadresse').max(200),
  moveInDate: z
    .string()
    .regex(/^(\d{4}-\d{2}-\d{2})?$/, 'Ugyldig datoformat')
    .optional()
    .default(''),
  website: z.string().optional().default(''),
})

export type SubmitBookingInput = z.input<typeof bookingRequestSchema>

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function formatUnitSize(size: number): string {
  return size.toFixed(1).replace('.0', '').replace('.', ',')
}

export const submitBookingRequest = createServerFn({ method: 'POST' })
  .inputValidator((data: SubmitBookingInput) =>
    bookingRequestSchema.parse(data),
  )
  .handler(async ({ data }) => {
    // Honeypot check: silently accept bot submissions without sending email
    if (data.website.trim().length > 0) {
      return { ok: true as const }
    }

    const units = await loadStorageUnits()
    const unit = units.find((u) => u.id === data.unitId)
    if (!unit) {
      throw new Error('Fant ikke den valgte boden.')
    }

    const apiKey = process.env.RESEND_API_KEY
    const notifyRaw = process.env.BOOKING_NOTIFY_EMAIL
    const fromEmail =
      process.env.BOOKING_FROM_EMAIL || 'Lagerboder <onboarding@resend.dev>'

    if (!apiKey || !notifyRaw) {
      console.error(
        '[booking] Missing RESEND_API_KEY or BOOKING_NOTIFY_EMAIL environment variable.',
      )
      throw new Error(
        'Bestillingsskjemaet er ikke ferdig konfigurert ennå. Ta kontakt med oss på telefon eller e-post.',
      )
    }

    const notifyEmails = notifyRaw
      .split(',')
      .map((email) => email.trim())
      .filter(Boolean)

    const requestType =
      unit.status === 'available'
        ? 'Bestilling'
        : unit.status === 'soon'
          ? 'Reservasjon'
          : 'Venteliste'

    const sizeStr = formatUnitSize(unit.size)
    const moveInLabel = data.moveInDate || 'Ikke oppgitt'

    const subject = `[${requestType}] Bod ${unit.id} (${sizeStr} m²) – ${data.fullName}`

    const text = [
      `Ny forespørsel (${requestType})`,
      '',
      `Kunde: ${data.fullName}`,
      `Telefon: ${data.phone}`,
      `E-post: ${data.email}`,
      `Ønsket startdato: ${moveInLabel}`,
      '',
      `Valgt bod: Bod ${unit.id} (${sizeStr} m²)`,
      `Adresse: ${unit.locationName}, Holmestrand`,
      `Månedspris: ${unit.price} kr / mnd`,
      `Status: ${unit.availableDate}`,
    ].join('\n')

    const html = `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #0f172a; max-width: 560px; margin: 0 auto; padding: 24px;">
        <h2 style="margin: 0 0 4px; font-size: 20px;">Ny forespørsel: ${escapeHtml(requestType)}</h2>
        <p style="margin: 0 0 20px; color: #475569; font-size: 14px;">
          Svar direkte på denne e-posten for å svare kunden.
        </p>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px; margin-bottom: 20px;">
          <tbody>
            <tr>
              <td style="padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; color: #64748b; width: 40%;">Navn</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; font-weight: 600;">${escapeHtml(data.fullName)}</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; color: #64748b;">Telefon</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">
                <a href="tel:${escapeHtml(data.phone)}" style="color: #0f172a; text-decoration: none;">${escapeHtml(data.phone)}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; color: #64748b;">E-post</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">
                <a href="mailto:${escapeHtml(data.email)}" style="color: #2563eb;">${escapeHtml(data.email)}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; color: #64748b;">Ønsket startdato</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${escapeHtml(moveInLabel)}</td>
            </tr>
          </tbody>
        </table>

        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tbody>
            <tr>
              <td style="padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; color: #64748b; width: 40%;">Valgt bod</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; font-weight: 600;">Bod ${escapeHtml(unit.id)} (${escapeHtml(sizeStr)} m²)</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; color: #64748b;">Adresse</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${escapeHtml(unit.locationName)}, Holmestrand</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; color: #64748b;">Månedspris</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0; font-weight: 600;">${unit.price} kr / mnd</td>
            </tr>
            <tr>
              <td style="padding: 8px 12px; background: #f8fafc; border: 1px solid #e2e8f0; color: #64748b;">Status</td>
              <td style="padding: 8px 12px; border: 1px solid #e2e8f0;">${escapeHtml(unit.availableDate)}</td>
            </tr>
          </tbody>
        </table>
      </div>
    `

    const resend = new Resend(apiKey)
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: notifyEmails,
      replyTo: data.email,
      subject,
      text,
      html,
    })

    if (error) {
      console.error('[booking] Resend error:', error)
      throw new Error(
        'Kunne ikke sende forespørselen akkurat nå. Prøv igjen eller kontakt oss direkte.',
      )
    }

    return { ok: true as const }
  })
