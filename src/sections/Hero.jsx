import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { couple, images, wedding } from '../data/wedding'
import { ArchOutline, Sparkle } from '../components/ui/Ornaments'
import Petals from '../components/ui/Petals'
import Picture from '../components/ui/Picture'
import RevealText from '../components/ui/RevealText'
import { useSmoothScroll } from '../context'

const EASE = [0.22, 1, 0.36, 1]

// First screen: the couple's names around an arched window onto Lake Pichola.
// `play` starts the intro animation, `burst` drops a shower of petals.
export default function Hero({ play, burst }) {
  const ref = useRef(null)
  const { scrollTo } = useSmoothScroll()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })

  // On scroll the arch grows, the names move apart and everything fades.
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.35])
  const archScale = useTransform(scrollYProgress, [0, 1], [1, 1.14])
  const archY = useTransform(scrollYProgress, [0, 1], ['0%', '10%'])
  const brideX = useTransform(scrollYProgress, [0, 1], ['0%', '-22%'])
  const groomX = useTransform(scrollYProgress, [0, 1], ['0%', '22%'])
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0])

  // Layers follow the mouse a little for a sense of depth (mouse only).
  const px = useMotionValue(0)
  const py = useMotionValue(0)
  const sx = useSpring(px, { stiffness: 60, damping: 20 })
  const sy = useSpring(py, { stiffness: 60, damping: 20 })
  const archPX = useTransform(sx, (v) => v * -14)
  const archPY = useTransform(sy, (v) => v * -10)
  const namePX = useTransform(sx, (v) => v * 22)
  const namePY = useTransform(sy, (v) => v * 14)

  const onPointerMove = (e) => {
    if (e.pointerType !== 'mouse') return
    px.set(e.clientX / window.innerWidth - 0.5)
    py.set(e.clientY / window.innerHeight - 0.5)
  }

  return (
    <section
      ref={ref}
      id="top"
      onPointerMove={onPointerMove}
      className="relative h-svh min-h-155 overflow-hidden bg-ink"
    >
      <div className="absolute inset-0 bg-[radial-gradient(70%_55%_at_50%_62%,rgba(92,18,34,0.7),transparent_72%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(40%_30%_at_50%_100%,rgba(239,160,47,0.18),transparent)]" />

      {/* Arched window with the lake photo */}
      <motion.div
        style={{ x: archPX, y: archPY }}
        className="absolute top-[17svh] left-1/2 z-10 h-[58svh] w-[68vw] -translate-x-1/2 sm:w-[46vw] lg:top-[12svh] lg:h-[74svh] lg:w-[min(30vw,460px)]"
      >
        <motion.div style={{ scale: archScale, y: archY, opacity: fade }} className="absolute inset-0">
        <motion.div
          initial={{ clipPath: 'inset(100% 0% 0% 0%)' }}
          animate={play ? { clipPath: 'inset(0% 0% 0% 0%)' } : {}}
          transition={{ duration: 1.8, delay: 0.9, ease: EASE }}
          className="absolute inset-0"
        >
          <Picture
            id={images.hero}
            alt="Lake Pichola and the Lake Palace in Udaipur at dusk"
            priority
            sizes="(min-width: 1024px) 30vw, 70vw"
            widths={[600, 900, 1300, 1800]}
            className="arch absolute inset-0"
            imgClassName="object-[62%_center]"
            imgStyle={{ scale: imageScale }}
          />
          <div className="arch absolute inset-0 bg-linear-to-t from-ink/80 via-ink/5 to-ink/20" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={play ? { opacity: 1 } : {}}
          transition={{ duration: 1.6, delay: 1.6 }}
        >
          <ArchOutline className="-inset-3 h-[calc(100%+1.5rem)] w-[calc(100%+1.5rem)] text-gold/60" />
          <ArchOutline className="-inset-7 h-[calc(100%+3.5rem)] w-[calc(100%+3.5rem)] text-gold/20" />
          <Sparkle size={18} className="absolute -top-12 left-1/2 -translate-x-1/2 text-gold" />
        </motion.div>
        </motion.div>
      </motion.div>

      <Petals className="absolute inset-0 z-20 h-full w-full" burst={burst} />

      {/* Names (the visible letters are decorative; the h1 is for screen readers) */}
      <h1 className="sr-only">
        {couple.bride.first} and {couple.groom.first} are getting married
      </h1>
      <motion.div aria-hidden="true" style={{ x: namePX, y: namePY, opacity: fade }} className="pointer-events-none absolute inset-0 z-30">
        <motion.p
          style={{ x: brideX }}
          className="absolute top-[9svh] left-[5vw] font-display text-[19vw] leading-none font-normal tracking-[-0.03em] text-ivory sm:text-[14vw] lg:top-[22svh] lg:left-[6vw] lg:text-[12.5vw]"
        >
          <RevealText text={couple.bride.first} mode="chars" play={play} delay={1.1} stagger={0.05} duration={1.3} />
        </motion.p>
        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: -20 }}
          animate={play ? { opacity: 1, scale: 1, rotate: 0 } : {}}
          transition={{ delay: 1.9, duration: 1.4, ease: EASE }}
          className="absolute top-[44svh] left-1/2 -translate-x-1/2 font-serif text-[22vw] leading-none text-marigold italic drop-shadow-[0_6px_30px_rgba(0,0,0,0.6)] sm:text-[14vw] lg:top-[38svh] lg:text-[9vw]"
        >
          &amp;
        </motion.div>
        <motion.p
          style={{ x: groomX }}
          className="absolute right-[5vw] bottom-[17svh] font-display text-[19vw] leading-none font-normal tracking-[-0.03em] text-ivory italic sm:text-[14vw] lg:right-[6vw] lg:bottom-[14svh] lg:text-[12.5vw]"
        >
          <RevealText text={couple.groom.first} mode="chars" play={play} delay={1.45} stagger={0.05} duration={1.3} />
        </motion.p>
      </motion.div>

            <motion.p
        initial={{ opacity: 0 }}
        animate={play ? { opacity: 1 } : {}}
        transition={{ delay: 2.4, duration: 1 }}
        className="eyebrow absolute top-1/2 left-6 z-30 hidden -translate-y-1/2 rotate-180 text-ivory/50 [writing-mode:vertical-rl] lg:block"
      >
        The wedding of · MMXXVI
      </motion.p>

      {/* Date, scroll hint and place along the bottom */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={play ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 2.3, duration: 1.1, ease: EASE }}
        style={{ opacity: fade }}
        className="absolute inset-x-0 bottom-[max(3.2vw,1.5rem)] z-30 flex items-end justify-between gap-4 px-5 pb-5 sm:px-10"
      >
        <div className="text-left">
          <p className="eyebrow text-gold">Save the date</p>
          <p className="mt-1.5 font-display text-sm text-ivory/90 sm:text-base">{wedding.displayDate}</p>
        </div>
        <button
          type="button"
          onClick={() => scrollTo('invitation')}
          data-cursor="Scroll"
          className="group hidden flex-col items-center gap-2 text-ivory/60 transition-colors hover:text-ivory sm:flex"
        >
          <span className="eyebrow text-[0.6rem]!">Unfold the invitation</span>
          <span className="relative h-12 w-px overflow-hidden bg-ivory/15">
            <motion.span
              className="absolute inset-x-0 top-0 h-1/2 bg-gold"
              animate={{ y: ['-100%', '200%'] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
            />
          </span>
        </button>
        <div className="text-right">
          <p className="eyebrow text-gold">Udaipur</p>
          <p className="mt-1.5 font-display text-sm text-ivory/90 sm:text-base">Rajasthan, India</p>
        </div>
      </motion.div>
    </section>
  )
}
