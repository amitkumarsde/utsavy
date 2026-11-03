import { animate, AnimatePresence, motion, useInView } from 'framer-motion'
import { Flame, Send } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { blessingsSeed, images } from '../data/wedding'
import { load, save } from '../lib/storage'
import Picture from '../components/ui/Picture'
import Marquee from '../components/ui/Marquee'
import RevealText from '../components/ui/RevealText'
import { useToast } from '../context'

const DIYA_KEY = 'ishaani-kabir:diya'
const BLESSINGS_KEY = 'ishaani-kabir:blessings'
const BASE_DIYAS = 1247

// Clay lamp drawn in SVG; the flame appears when `lit` is true.
function Diya({ lit }) {
  return (
    <svg viewBox="0 0 220 170" className="w-60 overflow-visible sm:w-75" aria-hidden="true">
      <defs>
        <linearGradient id="clay" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C2622A" />
          <stop offset="100%" stopColor="#5A200A" />
        </linearGradient>
        <linearGradient id="oil" x1="0" x2="1">
          <stop offset="0%" stopColor="#3a1405" />
          <stop offset="100%" stopColor="#8a4a12" />
        </linearGradient>
        <radialGradient id="flameGrad" cx="50%" cy="78%" r="70%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="25%" stopColor="#FFF1B8" />
          <stop offset="55%" stopColor="#F7B733" />
          <stop offset="100%" stopColor="#E0531F" stopOpacity="0.9" />
        </radialGradient>
        <radialGradient id="halo">
          <stop offset="0%" stopColor="#FFC768" stopOpacity="0.75" />
          <stop offset="45%" stopColor="#EFA02F" stopOpacity="0.22" />
          <stop offset="100%" stopColor="#EFA02F" stopOpacity="0" />
        </radialGradient>
      </defs>

      <motion.circle
        cx="190"
        cy="70"
        r="120"
        fill="url(#halo)"
        initial={false}
        animate={{ opacity: lit ? 1 : 0, scale: lit ? 1 : 0.4 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
        style={{ transformOrigin: '190px 70px' }}
      />

      {/* clay lamp */}
      <ellipse cx="100" cy="150" rx="46" ry="7" fill="#000" opacity="0.35" />
      <path d="M86 128 h28 l6 18 h-40 Z" fill="#6b2a0b" />
      <path d="M20 96 C 26 140, 150 146, 170 104 L 196 86 C 176 88, 156 90, 144 90 C 104 87, 60 86, 20 96 Z" fill="url(#clay)" />
      <path d="M20 96 C 58 82, 140 80, 196 86 C 156 96, 60 104, 20 96 Z" fill="url(#oil)" />
      {Array.from({ length: 9 }, (_, i) => (
        <circle key={i} cx={40 + i * 15} cy={114 + Math.sin((i / 8) * Math.PI) * 10} r="2.2" fill="#F3C440" opacity="0.8" />
      ))}
      <path d="M30 108 C 70 126, 130 126, 168 106" fill="none" stroke="#F3C440" strokeWidth="1" opacity="0.5" />

      {/* wick */}
      <path d="M186 86 q3 -6 0 -10" stroke="#2a1a10" strokeWidth="3" fill="none" strokeLinecap="round" />

      <AnimatePresence>
        {lit && (
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 140, damping: 10 }}
            style={{ transformOrigin: '187px 78px' }}
          >
            <g className="flame" style={{ transformOrigin: '187px 78px' }}>
              <path d="M187 78 C 200 66, 200 44, 187 18 C 174 44, 174 66, 187 78 Z" fill="url(#flameGrad)" />
              <path d="M187 76 C 192 68, 192 58, 187 46 C 182 58, 182 68, 187 76 Z" fill="#fff" opacity="0.85" />
            </g>
          </motion.g>
        )}
      </AnimatePresence>
    </svg>
  )
}

// Number that counts up when it first scrolls into view.
function Counter({ value }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const shown = useRef(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(shown.current, value, {
      duration: shown.current === 0 ? 2.2 : 0.6,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(v) {
        shown.current = v
        if (ref.current) ref.current.textContent = Math.round(v).toLocaleString('en-IN')
      },
    })
    return () => controls.stop()
  }, [inView, value])

  return <span ref={ref}>0</span>
}

// One blessing card on the moving wall.
function Note({ blessing }) {
  return (
    <figure className="mx-3 w-75 shrink-0 rounded-[3px] border border-gold/15 bg-ivory/4 p-6 backdrop-blur-sm sm:w-90">
      <span className="font-display text-4xl leading-none text-marigold">“</span>
      <blockquote className="-mt-2 font-serif text-xl leading-snug text-ivory/90 italic">{blessing.text}</blockquote>
      <figcaption className="mt-5 flex items-center gap-3">
        <span className="grid size-9 place-items-center rounded-full bg-maroon font-display text-sm text-gold">{blessing.name[0]}</span>
        <span>
          <span className="block text-sm font-semibold text-ivory">{blessing.name}</span>
          <span className="block text-xs text-ivory/50">{blessing.relation}</span>
        </span>
      </figcaption>
    </figure>
  )
}

// Light a diya and leave a blessing; both are saved in this browser.
export default function Blessings() {
  const [lit, setLit] = useState(() => load(DIYA_KEY, false) === true)
  const [mine, setMine] = useState(() => {
    const saved = load(BLESSINGS_KEY, [])
    return Array.isArray(saved) ? saved : []
  })
  const [name, setName] = useState('')
  const [text, setText] = useState('')
  const toast = useToast()

  const all = [...mine, ...blessingsSeed]
  const half = Math.ceil(all.length / 2)

  const light = () => {
    if (lit) return
    setLit(true)
    save(DIYA_KEY, true)
    toast('Your diya is lit — thank you for the blessing')
  }

  const submit = (e) => {
    e.preventDefault()
    if (name.trim().length < 2 || text.trim().length < 4) {
      toast('Add your name and a few words of blessing')
      return
    }
    const next = [{ name: name.trim(), relation: 'Blessed just now', text: text.trim() }, ...mine].slice(0, 12)
    setMine(next)
    save(BLESSINGS_KEY, next)
    setName('')
    setText('')
    toast('Your blessing has joined the wall')
  }

  return (
    <section id="blessings" className="relative overflow-hidden bg-ink py-28 sm:py-36">
      <Picture id={images.diyas} alt="" sizes="100vw" className="absolute inset-0 bg-transparent! opacity-30" />
      <div className="absolute inset-0 bg-linear-to-b from-ink via-ink/70 to-ink" />

      <div className="relative mx-auto max-w-5xl px-6 text-center">
        <p className="flex items-center justify-center gap-3 text-gold">
          <span className="eyebrow">09</span>
          <span className="h-px w-10 bg-current opacity-50" />
          <span className="eyebrow">Aashirwad</span>
          <span className="font-deva text-sm opacity-80">· आशीर्वाद</span>
        </p>
        <h2 className="mt-6 font-display text-[clamp(2.6rem,7vw,6.5rem)] leading-[0.95] tracking-[-0.02em] text-ivory">
          <RevealText text="Bless us," /> <RevealText text="light a diya" delay={0.1} className="font-serif text-marigold italic" />
        </h2>

        <div className="mt-12 flex flex-col items-center">
          <button
            type="button"
            onClick={light}
            aria-pressed={lit}
            data-cursor={lit ? undefined : 'Light'}
            className="group relative rounded-full p-4 transition-transform duration-500 hover:scale-[1.03] focus-visible:outline-gold"
          >
            <Diya lit={lit} />
            <span className="sr-only">{lit ? 'Your diya is lit' : 'Light a diya for the couple'}</span>
          </button>
          <p className="mt-2 font-display text-5xl text-ivory sm:text-6xl">
            <Counter value={BASE_DIYAS + (lit ? 1 : 0)} />
          </p>
          <p className="eyebrow mt-3 text-gold">diyas lit for Ishaani & Kabir</p>
          <AnimatePresence mode="wait">
            {lit ? (
              <motion.p key="lit" initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-6 font-serif text-xl text-ivory/80 italic">
                Yours is burning bright. Thank you.
              </motion.p>
            ) : (
              <motion.button
                key="unlit"
                type="button"
                onClick={light}
                exit={{ opacity: 0, y: -6 }}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-gold/40 px-5 py-2.5 text-xs font-semibold tracking-[0.18em] text-gold uppercase transition-colors hover:bg-gold hover:text-ink"
              >
                <Flame size={14} /> Light your diya
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="relative mt-24 space-y-6">
        <Marquee duration={70} repeat={3}>
          {all.slice(0, half).map((b, i) => (
            <Note key={`${b.name}-${i}`} blessing={b} />
          ))}
        </Marquee>
        <Marquee duration={80} repeat={3} reverse>
          {all.slice(half).map((b, i) => (
            <Note key={`${b.name}-${i}`} blessing={b} />
          ))}
        </Marquee>
      </div>

      <form onSubmit={submit} className="relative mx-auto mt-16 flex max-w-3xl flex-col gap-3 px-5 sm:flex-row sm:items-center sm:rounded-full sm:border sm:border-ivory/15 sm:bg-ink/60 sm:p-2 sm:backdrop-blur">
        <label className="sr-only" htmlFor="blessing-name">
          Your name
        </label>
        <input
          id="blessing-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          maxLength={40}
          className="rounded-full border border-ivory/15 bg-transparent px-5 py-3.5 text-ivory placeholder:text-ivory/35 focus:border-gold focus:outline-none sm:w-44 sm:border-0"
        />
        <span className="hidden h-8 w-px bg-ivory/15 sm:block" />
        <label className="sr-only" htmlFor="blessing-text">
          Your blessing
        </label>
        <input
          id="blessing-text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a blessing for the couple…"
          maxLength={160}
          className="flex-1 rounded-full border border-ivory/15 bg-transparent px-5 py-3.5 text-ivory placeholder:text-ivory/35 focus:border-gold focus:outline-none sm:border-0"
        />
        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-xs font-bold tracking-[0.18em] text-ink uppercase transition-colors hover:bg-ivory"
        >
          Bless <Send size={14} />
        </button>
      </form>
    </section>
  )
}
