// Sending RSVPs to the family.
//
// With a server: set VITE_RSVP_ENDPOINT (for example in a `.env` file or in Vercel's
// environment variables) to a URL that accepts a JSON POST. Every reply is sent there.
//
// Without a server: the reply is saved in the guest's browser and the guest is asked to
// send it to the family on WhatsApp (to `wedding.rsvpWhatsApp`), so no reply is lost.
import { couple, events, wedding } from '../data/wedding'

const ENDPOINT = import.meta.env.VITE_RSVP_ENDPOINT

export const hasServer = Boolean(ENDPOINT)

// True once the RSVP deadline has passed.
export const rsvpClosed = () => Date.now() > new Date(wedding.rsvpDeadline).getTime()

// Sends the reply to the server. Throws if it could not be delivered.
export async function sendRsvp(form) {
  if (!ENDPOINT) return
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...form, sentAt: new Date().toISOString() }),
  })
  if (!res.ok) throw new Error(`RSVP was not accepted (${res.status})`)
}

// Full reply as a message for the family.
export function rsvpMessage(data) {
  const names = `${couple.bride.first} & ${couple.groom.first}`
  if (data.attending !== 'yes') {
    return [
      `RSVP for ${names}'s wedding`,
      `Name: ${data.name}`,
      `Phone: ${data.phone}`,
      'Reply: Regretfully declines',
      data.message && `Note: ${data.message}`,
    ]
      .filter(Boolean)
      .join('\n')
  }
  const chosen = events.filter((e) => data.events.includes(e.id)).map((e) => e.name)
  return [
    `RSVP for ${names}'s wedding`,
    `Name: ${data.name}`,
    `Phone: ${data.phone}`,
    'Reply: Joyfully accepts',
    `Guests: ${data.guests}`,
    `Celebrations: ${chosen.join(', ')}`,
    `Meal: ${data.meal}`,
    `Airport pickup: ${data.pickup ? 'Yes' : 'No'}`,
    data.message && `Note: ${data.message}`,
  ]
    .filter(Boolean)
    .join('\n')
}

// WhatsApp link that opens a chat with `phone` and the text already typed.
export const whatsAppLink = (phone, text) => `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`
