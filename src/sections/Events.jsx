import { AnimatePresence, motion, useMotionValue, useSpring, useVelocity, useTransform } from 'framer-motion'
import { CalendarPlus, Clock, MapPin, Navigation, Plus, Shirt } from 'lucide-react'
import { useState } from 'react'
import { events, venues } from '../data/wedding'
import { googleCalendarUrl, mapsDirectionsUrl } from '../lib/calendar'
import { img } from '../lib/images'
import Picture from '../components/ui/Picture'
import SectionHeading from '../components/ui/SectionHeading'
import Button from '../components/ui/Button'
import { ArchEdge } from '../components/ui/Ornaments'
import { useFinePointer } from '../hooks/useMediaQuery'

const EASE = [0.22, 1, 0.36, 1]

// Opened panel: photo, description, time, place, dress code and action buttons.
function EventDetails({ event }) {
  const venue = venues[event.venue]
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      className="overflow-hidden"
    >
      <div className="grid gap-8 pt-2 pb-12 md:grid-cols-[minmax(220px,300px)_1fr] md:gap-14 md:pl-18">
        <div className="relative aspect-4/5 w-full max-w-75">
          <Picture id={event.image} alt={`${event.name} celebration`} sizes="300px" className="arch-round absolute inset-0" />
          <div className="arch-round absolute inset-0 ring-1 ring-ink/10 ring-inset" />
          <span
            className="absolute -top-3 -right-3 grid size-16 place-items-center rounded-full font-deva text-sm text-ivory shadow-lg"
            style={{ background: event.accent }}
          >
            {event.deva.split(' ')[0]}
          </span>
        </div>

        <div className="flex flex-col justify-center">
          <p className="max-w-xl font-serif text-2xl leading-snug text-ink/85 italic sm:text-3xl">“{event.description}”</p>

          <dl className="mt-8 grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="eyebrow flex items-center gap-2 text-ink/50">
                <Clock size={13} /> When
              </dt>
              <dd className="mt-2 font-display text-lg text-ink">
                {event.day}, {event.date} 2026
              </dd>
              <dd className="text-sm text-ink/65">{event.time}</dd>
            </div>
            <div>
              <dt className="eyebrow flex items-center gap-2 text-ink/50">
                <MapPin size={13} /> Where
              </dt>
              <dd className="mt-2 font-display text-lg text-ink">{venue.name}</dd>
              <dd className="text-sm text-ink/65">{event.spot}</dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="eyebrow flex items-center gap-2 text-ink/50">
                <Shirt size={13} /> Dress code
              </dt>
              <dd className="mt-3 flex flex-wrap items-center gap-4">
                <span className="flex -space-x-2">
                  {event.swatches.map((c) => (
                    <span key={c} className="size-8 rounded-full border-2 border-paper shadow-sm" style={{ background: c }} title={c} />
                  ))}
                </span>
                <span className="font-display text-lg text-ink">{event.dress}</span>
              </dd>
            </div>
          </dl>

          <div className="mt-9 flex flex-wrap gap-3">
            <Button href={mapsDirectionsUrl(venue.query)} variant="ink" icon={Navigation}>
              Directions
            </Button>
            <Button href={googleCalendarUrl(event)} variant="ghost" icon={CalendarPlus} className="text-ink">
              Add to calendar
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

// One event line; tap to open or close its details.
function EventRow({ event, index, open, onToggle }) {
  const venue = venues[event.venue]
  return (
    <li data-index={index} className="relative border-t border-ink/15 last:border-b">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        aria-controls={`event-${event.id}`}
        data-cursor={open ? 'Close' : 'Open'}
        className="group relative grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 py-7 text-left sm:gap-8 sm:py-9"
      >
        <span
          aria-hidden="true"
          className={`absolute inset-0 z-0 origin-bottom transition-transform duration-700 ease-luxe ${open ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'}`}
          style={{ background: `linear-gradient(90deg, ${event.accent}22, ${event.accent}0a 60%, transparent)` }}
        />
        <span className="relative w-10 font-sans text-xs font-semibold tracking-[0.2em] text-ink/40 sm:w-12">0{index + 1}</span>
        <span className="relative min-w-0">
          <span className="flex flex-wrap items-baseline gap-x-5 gap-y-1">
            <span
              className="font-display text-[clamp(2.3rem,7.5vw,6.2rem)] leading-[0.95] tracking-[-0.02em] text-ink transition-[letter-spacing,color] duration-700 ease-luxe group-hover:tracking-[0.005em]"
              style={open ? { color: event.accent } : undefined}
            >
              {event.name}
            </span>
            <span className="font-deva text-lg text-ink/45 sm:text-xl">{event.deva}</span>
          </span>
          <span className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-[0.8rem] text-ink/60 md:hidden">
            <span>
              {event.day.slice(0, 3)}, {event.date}
            </span>
            <span>{event.time}</span>
            <span>{venue.short}</span>
          </span>
        </span>
        <span className="relative flex items-center gap-8">
          <span className="hidden text-right md:block">
            <span className="block font-display text-xl text-ink">
              {event.day}, {event.date}
            </span>
            <span className="block text-sm text-ink/55">
              {event.time.split(' · ')[0]} · {venue.short}
            </span>
          </span>
          <motion.span
            animate={{ rotate: open ? 135 : 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className={`grid size-11 place-items-center rounded-full border transition-colors duration-500 ${open ? 'border-transparent text-ivory' : 'border-ink/20 text-ink group-hover:border-ink'}`}
            style={open ? { background: event.accent } : undefined}
          >
            <Plus size={18} />
          </motion.span>
        </span>
      </button>
      <div id={`event-${event.id}`}>
        <AnimatePresence initial={false}>{open && <EventDetails event={event} />}</AnimatePresence>
      </div>
    </li>
  )
}

// Photo that follows the mouse while hovering an event (mouse only).
function HoverPreview({ index, x, y }) {
  const sx = useSpring(x, { stiffness: 160, damping: 22, mass: 0.6 })
  const sy = useSpring(y, { stiffness: 160, damping: 22, mass: 0.6 })
  const velocity = useVelocity(sx)
  const rotate = useTransform(velocity, [-1500, 1500], [-14, 14], { clamp: true })

  return (
    <motion.div style={{ x: sx, y: sy, rotate }} className="pointer-events-none fixed top-0 left-0 z-40">
      <AnimatePresence>
        {index !== null && (
          <motion.div
            key="preview"
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="arch-round relative -mt-45 -ml-32.5 h-85 w-65 overflow-hidden shadow-2xl shadow-black/30"
          >
            {events.map((e, i) => (
              <img
                key={e.id}
                src={img(e.image, 520)}
                alt=""
                className="absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-500"
                style={{ opacity: i === index ? 1 : 0, transform: `scale(${i === index ? 1 : 1.15})` }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// All five wedding events as a big list, one colour per event.
export default function Events() {
  const [open, setOpen] = useState('vivah')
  const [hovered, setHovered] = useState(null)
  const fine = useFinePointer()
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const openIndex = events.findIndex((e) => e.id === open)
  const previewIndex = hovered !== null && hovered !== openIndex ? hovered : null

  return (
    <section id="events" data-theme="light" className="paper relative py-28 sm:py-36">
      <ArchEdge className="absolute bottom-full left-0" />
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading index="05" label="The Celebrations" deva="उत्सव" title="Four days," italic="five celebrations" tone="text-gold-deep" className="text-ink" />
          <p className="max-w-sm text-ink/60 lg:pb-4 lg:text-right">
            From the first stroke of henna to the last firework over the City Palace — tap any celebration for timings, venue and what to wear.
          </p>
        </div>

        <ul
          className="mt-16 sm:mt-24"
          onPointerMove={(e) => {
            x.set(e.clientX)
            y.set(e.clientY)
            // Find the hovered row from the mouse move itself, so it also works after scrolling.
            const row = e.target.closest?.('li[data-index]')
            setHovered(row ? Number(row.dataset.index) : null)
          }}
          onPointerLeave={() => setHovered(null)}
        >
          {events.map((event, i) => (
            <EventRow
              key={event.id}
              event={event}
              index={i}
              open={open === event.id}
              onToggle={() => setOpen(open === event.id ? null : event.id)}
            />
          ))}
        </ul>
      </div>
      {fine && <HoverPreview index={previewIndex} x={x} y={y} />}
    </section>
  )
}
