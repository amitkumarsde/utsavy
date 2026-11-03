import { AnimatePresence, LayoutGroup, motion } from 'framer-motion'
import { BedDouble, Copy, ExternalLink, Navigation, Plane, Ship, TrainFront } from 'lucide-react'
import { useState } from 'react'
import { travel, venues } from '../data/wedding'
import { mapsDirectionsUrl, mapsEmbedUrl, mapsSearchUrl } from '../lib/calendar'
import { copyText } from '../lib/storage'
import Button from '../components/ui/Button'
import SectionHeading from '../components/ui/SectionHeading'
import { ArchEdge } from '../components/ui/Ornaments'
import { useToast } from '../context'

const ICONS = { plane: Plane, train: TrainFront, hotel: BedDouble, ship: Ship }
const LIST = Object.values(venues)

// Venue details with a Google Map for each of the four places.
export default function Venue() {
  const [activeId, setActiveId] = useState('udaivilas')
  const [loaded, setLoaded] = useState({})
  const toast = useToast()
  const venue = venues[activeId]

  const copy = async () => {
    const ok = await copyText(`${venue.name}, ${venue.address}`)
    toast(ok ? 'Address copied — see you there!' : 'Could not copy, please select the text')
  }

  return (
    <section id="venue" data-theme="light" className="paper relative py-28 sm:py-36">
      <ArchEdge className="absolute bottom-full left-0" />
      <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-8 lg:grid-cols-[1fr_1.1fr] lg:gap-20">
        <div>
          <SectionHeading index="07" label="The Venue" deva="स्थान" title="Where the lake" italic="meets the palace" size="md" tone="text-gold-deep" className="text-ink" />

          <LayoutGroup id="venue-tabs">
            <div role="group" aria-label="Choose a venue" className="mt-12 flex flex-wrap gap-2">
              {LIST.map((v) => {
                const active = v.id === activeId
                return (
                  <button
                    key={v.id}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setActiveId(v.id)}
                    className={`relative rounded-full px-4 py-2.5 text-xs font-semibold tracking-[0.14em] uppercase transition-colors duration-300 ${active ? 'text-ivory' : 'text-ink/60 hover:text-ink'}`}
                  >
                    {active && <motion.span layoutId="venue-pill" className="absolute inset-0 rounded-full bg-maroon" transition={{ type: 'spring', stiffness: 380, damping: 32 }} />}
                    <span className="relative">{v.short}</span>
                  </button>
                )
              })}
            </div>
          </LayoutGroup>

          <div aria-live="polite" className="mt-10 min-h-55">
            <AnimatePresence mode="wait">
              <motion.div
                key={venue.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="eyebrow text-sindoor">{venue.note}</p>
                <h3 className="mt-3 font-display text-4xl leading-tight text-ink sm:text-5xl">{venue.name}</h3>
                <p className="mt-3 max-w-md text-ink/65">{venue.address}</p>
                <div className="mt-7 flex flex-wrap gap-3">
                  <Button href={mapsDirectionsUrl(venue.query)} variant="ink" icon={Navigation}>
                    Get directions
                  </Button>
                  <Button variant="ghost" icon={Copy} className="text-ink" onClick={copy}>
                    Copy address
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          <ul className="mt-12 grid gap-px overflow-hidden rounded-sm border border-ink/10 bg-ink/10 sm:grid-cols-2">
            {travel.map((t) => {
              const Icon = ICONS[t.icon]
              return (
                <li key={t.label} className="flex gap-4 bg-paper p-5">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-maroon/10 text-maroon">
                    <Icon size={18} strokeWidth={1.6} />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold text-ink">{t.label}</span>
                    <span className="mt-0.5 block text-sm text-ink/60">{t.detail}</span>
                  </span>
                </li>
              )
            })}
          </ul>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-10%' }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative lg:pt-6"
        >
          <div className="relative h-115 overflow-hidden rounded-t-[999px] border border-gold-deep/40 bg-paper p-2.5 sm:h-150 lg:h-full lg:min-h-160">
            <div className="relative h-full overflow-hidden rounded-t-[999px] bg-[#e6d8bd]">
              {/* Maps stay loaded after the first visit, so switching back is instant */}
              {LIST.map((v) =>
                v.id === activeId || loaded[v.id] ? (
                  <iframe
                    key={v.id}
                    title={`Map of ${v.name}`}
                    src={mapsEmbedUrl(v.query)}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    onLoad={() => setLoaded((l) => ({ ...l, [v.id]: true }))}
                    className="absolute inset-x-0 -top-30 h-[calc(100%+120px)] w-full border-0 transition-opacity duration-700 filter-[sepia(0.35)_saturate(0.85)_contrast(1.05)]"
                    style={{ opacity: v.id === activeId ? 1 : 0, pointerEvents: v.id === activeId ? 'auto' : 'none' }}
                  />
                ) : null,
              )}
              {!loaded[activeId] && (
                <div className="absolute inset-0 grid place-items-center">
                  <span className="eyebrow animate-pulse text-ink/40">Unfolding the map…</span>
                </div>
              )}
            </div>
          </div>
          <a
            href={mapsSearchUrl(venue.query)}
            target="_blank"
            rel="noreferrer"
            className="absolute bottom-6 left-1/2 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-ink px-5 py-3 text-xs font-semibold tracking-[0.16em] whitespace-nowrap text-ivory uppercase shadow-xl transition-colors hover:bg-maroon"
          >
            Open in Google Maps <ExternalLink size={14} />
          </a>
        </motion.div>
      </div>
    </section>
  )
}
