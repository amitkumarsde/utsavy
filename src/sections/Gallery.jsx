import { AnimatePresence, motion, useScroll, useTransform } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { couple, gallery, wedding } from '../data/wedding'
import { img } from '../lib/images'
import Picture from '../components/ui/Picture'
import SectionHeading from '../components/ui/SectionHeading'
import Marquee from '../components/ui/Marquee'
import { Sparkle } from '../components/ui/Ornaments'
import { useMediaQuery } from '../hooks/useMediaQuery'
import { useSmoothScroll } from '../context'

const EASE = [0.22, 1, 0.36, 1]
// How far each column moves while scrolling, so columns drift at different speeds.
const OFFSETS_WIDE = [
  [60, -120],
  [-40, 140],
  [120, -60],
]
const OFFSETS_NARROW = [
  [30, -50],
  [-20, 60],
]
const MARQUEE_WORDS = [couple.bride.first, couple.groom.first, wedding.shortDate, 'Udaipur', 'शुभ विवाह']

// Full-screen photo viewer: arrows, keyboard, swipe and thumbnails.
function Lightbox({ index, onClose, onStep }) {
  const item = gallery[index]
  const [direction, setDirection] = useState(0)

  const step = useCallback(
    (dir) => {
      setDirection(dir)
      onStep(dir)
    },
    [onStep],
  )

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose, step])

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label={item.caption}
      data-lenis-prevent
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-150 flex flex-col bg-ink/95 backdrop-blur-xl"
      onClick={onClose}
    >
      <div className="flex items-center justify-between px-5 py-5 sm:px-8" onClick={(e) => e.stopPropagation()}>
        <span className="font-display text-lg text-ivory/80">
          {String(index + 1).padStart(2, '0')} <span className="text-ivory/30">/ {String(gallery.length).padStart(2, '0')}</span>
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="grid size-12 place-items-center rounded-full border border-ivory/20 text-ivory transition-colors hover:bg-ivory hover:text-ink"
        >
          <X size={20} />
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center overflow-hidden px-4 sm:px-24">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.img
            key={item.id}
            src={img(item.id, 1800, 80)}
            alt={item.caption}
            custom={direction}
            variants={{
              enter: (d) => ({ x: d >= 0 ? 120 : -120, opacity: 0, scale: 0.96 }),
              center: { x: 0, opacity: 1, scale: 1 },
              exit: (d) => ({ x: d >= 0 ? -120 : 120, opacity: 0, scale: 0.96 }),
            }}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.55, ease: EASE }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.6}
            onDragEnd={(_, info) => {
              if (info.offset.x < -70) step(1)
              else if (info.offset.x > 70) step(-1)
            }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[72vh] max-w-full cursor-grab touch-pan-y rounded-sm object-contain shadow-2xl shadow-black/60 active:cursor-grabbing"
            draggable={false}
          />
        </AnimatePresence>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            step(-1)
          }}
          aria-label="Previous photo"
          className="absolute left-3 grid size-12 place-items-center rounded-full border border-ivory/20 bg-ink/40 text-ivory backdrop-blur transition-colors hover:bg-ivory hover:text-ink sm:left-8"
        >
          <ChevronLeft size={22} />
        </button>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            step(1)
          }}
          aria-label="Next photo"
          className="absolute right-3 grid size-12 place-items-center rounded-full border border-ivory/20 bg-ink/40 text-ivory backdrop-blur transition-colors hover:bg-ivory hover:text-ink sm:right-8"
        >
          <ChevronRight size={22} />
        </button>
      </div>

      <div className="px-6 pt-5 pb-8 text-center" onClick={(e) => e.stopPropagation()}>
        <AnimatePresence mode="wait">
          <motion.p
            key={item.caption}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="font-serif text-2xl text-ivory italic"
          >
            {item.caption}
          </motion.p>
        </AnimatePresence>
        <div className="no-scrollbar mx-auto mt-5 flex max-w-3xl gap-2 overflow-x-auto px-2">
          {gallery.map((g, i) => (
            <button
              key={g.id}
              type="button"
              aria-label={`Show photo ${i + 1}`}
              onClick={() => step(i - index)}
              className={`h-14 w-11 shrink-0 overflow-hidden rounded-sm transition-all duration-300 ${i === index ? 'opacity-100 ring-1 ring-gold ring-offset-2 ring-offset-ink' : 'opacity-35 hover:opacity-80'}`}
            >
              <img src={img(g.id, 120, 50)} alt="" className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

// One column of photos that moves at its own speed.
function Column({ items, offset, progress, onOpen }) {
  const y = useTransform(progress, [0, 1], offset)
  return (
    <motion.div style={{ y }} className="flex flex-col gap-4 sm:gap-6">
      {items.map(({ item, index }, i) => (
        <motion.button
          key={item.id}
          type="button"
          onClick={() => onOpen(index)}
          data-cursor="View"
          initial={{ opacity: 0, y: 60 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-5%' }}
          transition={{ duration: 1.1, ease: EASE }}
          className="group relative block w-full overflow-hidden text-left"
          aria-label={`Open photo: ${item.caption}`}
        >
          <Picture
            id={item.id}
            alt={item.caption}
            sizes="(min-width: 1024px) 31vw, 48vw"
            widths={[400, 700, 1000]}
            className={i === 0 ? 'arch-round' : 'rounded-[3px]'}
            style={{ aspectRatio: item.ratio }}
            imgClassName="group-hover:scale-[1.07]"
          />
          <span className="pointer-events-none absolute inset-0 bg-linear-to-t from-ink/80 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          <span className="pointer-events-none absolute inset-x-4 bottom-4 translate-y-3 font-serif text-lg leading-tight text-ivory italic opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:text-xl">
            {item.caption}
          </span>
        </motion.button>
      ))}
    </motion.div>
  )
}

// Photo gallery in moving columns, with a sliding name banner on top.
export default function Gallery() {
  const ref = useRef(null)
  const [active, setActive] = useState(null)
  const wide = useMediaQuery('(min-width: 1024px)')
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })

  const offsets = wide ? OFFSETS_WIDE : OFFSETS_NARROW
  const columns = offsets.map(() => [])
  gallery.forEach((item, index) => columns[index % columns.length].push({ item, index }))

  const step = useCallback((dir) => setActive((i) => (i + dir + gallery.length) % gallery.length), [])
  const close = useCallback(() => setActive(null), [])

  // Freeze page scroll while the viewer is open.
  const { lock, unlock } = useSmoothScroll()
  const lightboxOpen = active !== null
  useEffect(() => {
    if (!lightboxOpen) return
    lock()
    return unlock
  }, [lightboxOpen, lock, unlock])

  return (
    <section id="gallery" className="relative overflow-hidden bg-ink pt-16 pb-28 sm:pb-40">
      <Marquee duration={36} repeat={2} className="border-y border-gold/15 py-5 sm:py-7">
        {MARQUEE_WORDS.map((word) => (
          <span key={word} className="flex items-center">
            <span className={`px-6 font-display text-5xl whitespace-nowrap sm:px-10 sm:text-7xl ${word === 'शुभ विवाह' ? 'font-deva text-marigold' : 'text-outline text-gold'}`}>{word}</span>
            <Sparkle size={20} className="text-marigold" />
          </span>
        ))}
      </Marquee>

      <div className="mx-auto mt-24 max-w-7xl px-4 sm:mt-32 sm:px-8">
        <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
          <SectionHeading index="06" label="Frames" deva="झलकियाँ" title="Little frames" italic="of a big love" className="text-ivory" />
          <p className="max-w-xs text-ivory/55 lg:pb-4">Tap any photograph to step inside. Swipe, or use your arrow keys, to wander through.</p>
        </div>

        <div ref={ref} className="mt-16 grid grid-cols-2 gap-4 sm:mt-24 sm:gap-6 lg:grid-cols-3">
          {columns.map((items, i) => (
            <Column key={i} items={items} offset={offsets[i]} progress={scrollYProgress} onOpen={setActive} />
          ))}
        </div>
      </div>

      <AnimatePresence>{active !== null && <Lightbox index={active} onClose={close} onStep={step} />}</AnimatePresence>
    </section>
  )
}
