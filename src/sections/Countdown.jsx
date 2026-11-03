import { AnimatePresence, motion } from 'framer-motion'
import { CalendarPlus, Download } from 'lucide-react'
import { events, wedding } from '../data/wedding'
import { downloadIcs, googleCalendarUrl } from '../lib/calendar'
import { useCountdown } from '../hooks/useCountdown'
import { Mandala, Sparkle } from '../components/ui/Ornaments'
import Button from '../components/ui/Button'
import RevealText from '../components/ui/RevealText'
import { useToast } from '../context'

// One number that rolls down when it changes.
function Digit({ value }) {
  return (
    <span className="relative inline-block h-[1.02em] w-[0.64em] overflow-hidden align-top">
      <AnimatePresence initial={false} mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: '-105%', opacity: 0, filter: 'blur(6px)' }}
          animate={{ y: '0%', opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: '105%', opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 text-center"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}

function Unit({ value, label, deva, delay }) {
  const digits = String(value).padStart(2, '0').split('')
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center"
    >
      <div className="font-display text-[clamp(3.6rem,13vw,11rem)] leading-none tracking-[-0.04em] text-ivory">
        {digits.map((d, i) => (
          <Digit key={digits.length - i} value={d} />
        ))}
      </div>
      <div className="mt-4 flex flex-col items-center gap-1">
        <span className="eyebrow text-gold">{label}</span>
        <span className="font-deva text-sm text-ivory/45">{deva}</span>
      </div>
    </motion.div>
  )
}

// Live countdown to the pheras, with buttons to save the dates to a calendar.
export default function Countdown() {
  const time = useCountdown(wedding.date)
  const toast = useToast()
  const vivah = events.find((e) => e.id === 'vivah')

  return (
    <section id="countdown" className="relative overflow-hidden bg-maroon py-28 sm:py-40">
      <div className="absolute inset-0 bg-[radial-gradient(70%_70%_at_50%_50%,rgba(200,56,43,0.35),transparent_70%),linear-gradient(180deg,#2e0911_0%,transparent_30%,transparent_70%,#2e0911_100%)]" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 w-[150vmin] -translate-x-1/2 -translate-y-1/2">
        <Mandala className="spin-slow w-full text-gold/13" />
      </div>

      <div className="relative mx-auto max-w-6xl px-6 text-center">
        <p className="flex items-center justify-center gap-3 text-gold">
          <span className="eyebrow">04</span>
          <span className="h-px w-10 bg-current opacity-50" />
          <span className="eyebrow">Counting the moments</span>
          <span className="font-deva text-sm opacity-80">· उलटी गिनती</span>
        </p>
        <h2 className="mt-6 font-display text-[clamp(2.4rem,6vw,5.5rem)] leading-[0.98] text-ivory">
          <RevealText text="Until the" /> <RevealText text="seven pheras" delay={0.1} className="font-serif text-marigold italic" />
        </h2>

        {time.done ? (
          <p className="mt-16 font-serif text-5xl text-gold italic">We are married — thank you for every blessing.</p>
        ) : (
          <div className="mt-16 grid grid-cols-2 gap-y-12 sm:mt-20 sm:grid-cols-4">
            <Unit value={time.days} label="Days" deva="दिन" delay={0} />
            <Unit value={time.hours} label="Hours" deva="घंटे" delay={0.08} />
            <Unit value={time.minutes} label="Minutes" deva="मिनट" delay={0.16} />
            <Unit value={time.seconds} label="Seconds" deva="सेकंड" delay={0.24} />
          </div>
        )}

        <div className="mx-auto mt-16 flex max-w-xl items-center gap-4 text-ivory/70">
          <span className="h-px flex-1 bg-linear-to-r from-transparent to-gold/60" />
          <Sparkle size={12} className="text-gold" />
          <span className="h-px flex-1 bg-linear-to-l from-transparent to-gold/60" />
        </div>
        <p className="mt-6 font-serif text-xl text-ivory/85 italic sm:text-2xl">
          Shubh muhurat · {wedding.displayDate} · 7:12 PM IST
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Button href={googleCalendarUrl(vivah)} icon={CalendarPlus} variant="gold">
            Google Calendar
          </Button>
          <Button
            variant="ghost"
            icon={Download}
            className="text-ivory"
            onClick={() => {
              downloadIcs(events)
              toast('All five celebrations saved to your calendar')
            }}
          >
            Apple / Outlook (.ics)
          </Button>
        </div>
      </div>
    </section>
  )
}
