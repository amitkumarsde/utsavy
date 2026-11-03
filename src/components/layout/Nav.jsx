import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { couple, navLinks, wedding } from '../../data/wedding'
import { img } from '../../lib/images'
import { useSmoothScroll, useSound } from '../../context'
import { Sparkle } from '../ui/Ornaments'

const EASE = [0.22, 1, 0.36, 1]

// Four small bars that dance while the music plays.
function SoundBars({ playing }) {
  return (
    <span className="flex h-3.5 items-end gap-0.75" aria-hidden="true">
      {[0.5, 1, 0.7, 0.9].map((h, i) => (
        <motion.span
          key={i}
          className="w-0.5 rounded-full bg-current"
          animate={playing ? { height: ['30%', '100%', '45%', '80%', '30%'] } : { height: `${h * 30}%` }}
          transition={playing ? { duration: 1.1 + i * 0.15, repeat: Infinity, ease: 'easeInOut' } : { duration: 0.4 }}
        />
      ))}
    </span>
  )
}

// Full-screen menu with a photo preview of the hovered link (desktop).
function Menu({ onClose, onNavigate }) {
  const [hovered, setHovered] = useState(navLinks[0])

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return (
    <motion.div
      id="site-menu"
      data-lenis-prevent
      initial={{ clipPath: 'circle(0% at 100% 0%)' }}
      animate={{ clipPath: 'circle(150% at 100% 0%)' }}
      exit={{ clipPath: 'circle(0% at 100% 0%)' }}
      transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      className="fixed inset-0 z-80 overflow-y-auto bg-wine"
    >
      <div className="absolute inset-0 bg-[radial-gradient(60%_60%_at_80%_20%,rgba(200,56,43,0.3),transparent)]" />
      <div className="relative mx-auto grid min-h-full max-w-7xl gap-10 px-6 pt-28 pb-12 lg:grid-cols-[1.3fr_1fr] lg:items-center lg:px-10">
        <nav aria-label="Sections">
          <ul>
            {navLinks.map((link, i) => (
              <motion.li
                key={link.id}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 + i * 0.05, duration: 0.8, ease: EASE }}
              >
                <button
                  type="button"
                  onClick={() => onNavigate(link.id)}
                  onPointerEnter={() => setHovered(link)}
                  onFocus={() => setHovered(link)}
                  className="group flex w-full items-baseline gap-4 border-b border-ivory/10 py-2.5 text-left sm:gap-6 sm:py-3"
                >
                  <span className="w-6 text-xs font-semibold tracking-[0.2em] text-gold/60">0{i + 1}</span>
                  <span className="font-display text-[clamp(2rem,5.4vw,4rem)] leading-[1.05] text-ivory transition-[transform,color] duration-500 ease-luxe group-hover:translate-x-3 group-hover:text-marigold group-hover:italic">
                    {link.label}
                  </span>
                  <span className="ml-auto font-deva text-base text-ivory/35 transition-opacity duration-500 sm:text-lg lg:opacity-0 lg:group-hover:opacity-100">
                    {link.deva}
                  </span>
                </button>
              </motion.li>
            ))}
          </ul>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-10 flex flex-wrap items-center justify-between gap-5 lg:hidden"
          >
            <p className="font-serif text-lg text-gold italic">
              {wedding.shortDate} · Udaipur
            </p>
            <button
              type="button"
              onClick={() => onNavigate('rsvp')}
              className="rounded-full bg-gold px-6 py-3 text-[0.7rem] font-bold tracking-[0.2em] text-ink uppercase"
            >
              RSVP by {wedding.rsvpBy.replace(' 2026', '')}
            </button>
          </motion.div>
        </nav>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 1, ease: EASE }}
          className="relative hidden aspect-3/4 w-full max-w-md justify-self-end lg:block"
        >
          <div className="arch absolute inset-0 overflow-hidden bg-night">
            <AnimatePresence initial={false}>
              <motion.img
                key={hovered.id}
                src={img(hovered.image, 900)}
                alt=""
                initial={{ opacity: 0, scale: 1.12 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: EASE }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>
          </div>
          <p className="absolute -bottom-10 left-0 w-full text-center font-serif text-xl text-gold italic">
            {couple.bride.first} &amp; {couple.groom.first} · {wedding.shortDate}
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}

// Top bar (logo, music, RSVP, menu) that hides on scroll down and returns on scroll up.
export default function Nav({ visible }) {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const { scrollY, scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
  const { scrollTo, lock, unlock } = useSmoothScroll()
  const { playing, toggle } = useSound()

  // Freeze the page only while the menu is open, so a chosen
  // section can be scrolled to while the menu is still closing.
  useEffect(() => {
    if (!open) return
    lock()
    return unlock
  }, [open, lock, unlock])

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0
    setHidden((h) => (y > 300 && y > prev + 4 ? true : y < prev - 4 ? false : h))
  })

  const close = useCallback(() => setOpen(false), [])

  const go = (id) => {
    setOpen(false)
    // Wait a moment for the scroll freeze to lift before scrolling.
    setTimeout(() => scrollTo(id), 60)
  }

  const chip = 'rounded-full border border-ivory/10 bg-ink/55 backdrop-blur-md'

  return (
    <>
      <motion.div style={{ scaleX: progress }} className="fixed inset-x-0 top-0 z-95 h-0.5 origin-left bg-linear-to-r from-sindoor via-marigold to-gold" />

      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={visible ? { y: hidden && !open ? -100 : 0, opacity: 1 } : { y: -100, opacity: 0 }}
        transition={{ duration: 0.7, ease: EASE }}
        className="fixed inset-x-0 top-0 z-90 flex items-center justify-between px-4 pt-4 sm:px-8 sm:pt-6"
      >
        <button
          type="button"
          onClick={() => (open ? go('top') : scrollTo(0))}
          aria-label="Back to top"
          className={`${chip} flex h-12 items-center gap-2 px-5 font-display text-lg text-ivory italic`}
        >
          {couple.bride.first[0]}
          <Sparkle size={9} className="text-marigold" />
          {couple.groom.first[0]}
        </button>

        <p className={`${chip} eyebrow hidden h-12 items-center px-5 text-ivory/70 lg:flex`}>
          {wedding.shortDate} <span className="mx-3 text-gold">·</span> Udaipur
        </p>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? 'Pause tanpura music' : 'Play tanpura music'}
            aria-pressed={playing}
            className={`${chip} grid size-12 place-items-center text-gold transition-colors hover:text-ivory`}
          >
            <SoundBars playing={playing} />
          </button>
          <button
            type="button"
            onClick={() => go('rsvp')}
            className="hidden h-12 items-center rounded-full bg-gold px-6 text-[0.7rem] font-bold tracking-[0.2em] text-ink uppercase transition-colors hover:bg-ivory sm:flex"
          >
            RSVP
          </button>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-expanded={open}
            aria-controls="site-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className={`${chip} flex h-12 items-center gap-3 px-5 text-ivory`}
          >
            <span className="eyebrow hidden sm:inline">{open ? 'Close' : 'Menu'}</span>
            <span className="relative block h-3 w-5">
              <motion.span animate={open ? { rotate: 45, y: 5 } : { rotate: 0, y: 0 }} className="absolute top-0 left-0 h-px w-full bg-current" />
              <motion.span animate={open ? { rotate: -45, y: -6 } : { rotate: 0, y: 0 }} className="absolute bottom-0 left-0 h-px w-full bg-current" />
            </span>
          </button>
        </div>
      </motion.header>

      <AnimatePresence>{open && <Menu onClose={close} onNavigate={go} />}</AnimatePresence>
    </>
  )
}
