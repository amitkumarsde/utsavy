// Builds calendar files and Google Calendar / Google Maps links for the events.
import { couple, venues } from '../data/wedding'

const toUtcStamp = (iso) =>
  new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')

const escapeIcs = (text) => text.replace(/\\/g, '\\\\').replace(/([,;])/g, '\\$1').replace(/\n/g, '\\n')

function describe(event) {
  const venue = venues[event.venue]
  return {
    title: `${event.name} · ${couple.bride.first} & ${couple.groom.first}`,
    location: `${event.spot}, ${venue.name}, ${venue.address}`,
    details: `${event.description}\nDress code: ${event.dress}\n${couple.hashtag}`,
  }
}

// Link that opens Google Calendar with the event already filled in.
export function googleCalendarUrl(event) {
  const { title, location, details } = describe(event)
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${toUtcStamp(event.start)}/${toUtcStamp(event.end)}`,
    details,
    location,
    ctz: 'Asia/Kolkata',
  })
  return `https://calendar.google.com/calendar/render?${params.toString()}`
}

function buildIcs(eventList) {
  const now = toUtcStamp(new Date().toISOString())
  const body = eventList.flatMap((event) => {
    const { title, location, details } = describe(event)
    return [
      'BEGIN:VEVENT',
      `UID:${event.id}-2026@ishaani-weds-kabir`,
      `DTSTAMP:${now}`,
      `DTSTART:${toUtcStamp(event.start)}`,
      `DTEND:${toUtcStamp(event.end)}`,
      `SUMMARY:${escapeIcs(title)}`,
      `LOCATION:${escapeIcs(location)}`,
      `DESCRIPTION:${escapeIcs(details)}`,
      'END:VEVENT',
    ]
  })
  return ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Utsavy//Wedding Invite//EN', 'CALSCALE:GREGORIAN', ...body, 'END:VCALENDAR'].join('\r\n')
}

// Downloads a .ics file that Apple Calendar, Outlook and others can import.
export function downloadIcs(eventList, filename = 'ishaani-kabir-wedding.ics') {
  const blob = new Blob([buildIcs(eventList)], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

export const mapsSearchUrl = (query) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`

export const mapsDirectionsUrl = (query) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`

export const mapsEmbedUrl = (query) =>
  `https://maps.google.com/maps?q=${encodeURIComponent(query)}&z=15&output=embed`
