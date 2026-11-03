import { motion, useScroll, useSpring, useTransform } from 'framer-motion'
import { ArrowRight, MapPin } from 'lucide-react'
import { useLayoutEffect, useRef, useState } from 'react'
import { story } from '../data/wedding'
import { ArchOutline } from '../components/ui/Ornaments'
import Picture from '../components/ui/Picture'
import RevealText from '../components/ui/RevealText'
import { useIsDesktop } from '../hooks/useMediaQuery'
import { useSmoothScroll } from '../context'

// Size and shape of the photo frame for each chapter (desktop).
const FRAME = {
  arch: { box: 'h-[62vh] w-[min(27vw,440px)]', shape: 'arch', outline: true },
  circle: { box: 'size-[min(34vw,52vh)] mt-[8vh]', shape: 'rounded-full', outline: false },
  tall: { box: 'h-[68vh] w-[min(23vw,360px)] -mt-[6vh]', shape: 'rounded-xs', outline: false },
}

function ChapterText({ item }) {
  return (
    <div className="max-w-sm">
      <p className="flex items-baseline gap-3">
        <span className="font-serif text-2xl text-marigold italic">Chapter {item.chapter}</span>
        <span className="eyebrow text-ivory/40">{item.year}</span>
      </p>
      <h3 className="mt-3 font-display text-4xl leading-[1.02] text-ivory xl:text-5xl">{item.title}</h3>
      <p className="mt-4 inline-flex items-center gap-2 text-xs tracking-[0.18em] text-gold uppercase">
        <MapPin size={13} /> {item.place}
      </p>
      <p className="mt-5 text-[0.95rem] leading-relaxed text-ivory/70">{item.text}</p>
    </div>
  )
}

// Desktop: the page scrolls down while the chapters slide sideways.
function HorizontalStory() {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)
  const [distance, setDistance] = useState(0)
  const { scrollTo } = useSmoothScroll()

  // How far the row must slide; the track is sized in vw, so it also resizes with the window.
  useLayoutEffect(() => {
    const measure = () => setDistance(trackRef.current.scrollWidth - window.innerWidth)
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(trackRef.current)
    return () => ro.disconnect()
  }, [])

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end end'] })
  const x = useTransform(scrollYProgress, [0, 1], [0, -distance])
  const thread = useSpring(scrollYProgress, { stiffness: 90, damping: 30 })
  const yearShift = useTransform(scrollYProgress, [0, 1], ['10%', '-30%'])

  return (
    <section id="story" ref={sectionRef} className="relative bg-ink" style={{ height: `calc(100vh + ${distance}px)` }}>
      <div className="sticky top-0 h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(50%_60%_at_20%_40%,rgba(92,18,34,0.35),transparent)]" />
        <motion.div ref={trackRef} style={{ x }} className="relative flex h-full w-max items-center">
          {/* Red-gold thread that draws itself through every chapter */}
          <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 1000 100" preserveAspectRatio="none" aria-hidden="true">
            <path
              d="M0 58 C 60 40, 120 76, 190 58 S 320 30, 400 55 S 540 82, 620 52 S 760 28, 840 56 S 950 70, 1000 50"
              fill="none"
              stroke="rgba(214,179,112,0.12)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
            <motion.path
              d="M0 58 C 60 40, 120 76, 190 58 S 320 30, 400 55 S 540 82, 620 52 S 760 28, 840 56 S 950 70, 1000 50"
              fill="none"
              stroke="url(#thread)"
              strokeWidth="2"
              vectorEffect="non-scaling-stroke"
              style={{ pathLength: thread }}
            />
            <defs>
              <linearGradient id="thread" x1="0" x2="1">
                <stop offset="0%" stopColor="#C8382B" />
                <stop offset="50%" stopColor="#EFA02F" />
                <stop offset="100%" stopColor="#D6B370" />
              </linearGradient>
            </defs>
          </svg>

          <div className="relative flex w-[62vw] shrink-0 flex-col justify-center pr-[6vw] pl-[8vw]">
            <p className="flex items-center gap-3 text-gold">
              <span className="eyebrow">03</span>
              <span className="h-px w-10 bg-current opacity-50" />
              <span className="eyebrow">Our Kahaani</span>
              <span className="font-deva text-sm opacity-80">· कहानी</span>
            </p>
            <h2 className="mt-6 font-display text-[clamp(3rem,6.4vw,7rem)] leading-[0.95] tracking-[-0.02em] text-ivory">
              <RevealText text="How a borrowed" />
              <br />
              <RevealText text="umbrella became" delay={0.1} />
              <br />
              <RevealText text="a lifetime" delay={0.2} className="font-serif text-marigold italic" />
            </h2>
            <p className="mt-10 flex items-center gap-3 text-sm text-ivory/50">
              Keep scrolling — the thread will lead you <ArrowRight size={16} className="text-gold" />
            </p>
          </div>

          {story.map((item, i) => {
            const frame = FRAME[item.frame]
            return (
              <article key={item.year} className="relative flex h-full shrink-0 items-center gap-[4vw] px-[5vw]">
                <motion.span
                  style={{ x: yearShift }}
                  aria-hidden="true"
                  className="text-outline pointer-events-none absolute top-[6vh] left-[2vw] font-display text-[22vw] leading-none text-gold/40 select-none"
                >
                  {item.year}
                </motion.span>
                <div className={`relative shrink-0 ${frame.box} ${i % 2 ? 'order-2' : ''}`}>
                  {item.frame === 'tall' && <div className="absolute -inset-3 translate-x-5 translate-y-5 border border-gold/30" />}
                  <Picture id={item.image} alt={item.place} sizes="34vw" className={`absolute inset-0 ${frame.shape}`} imgClassName="hover:scale-110" />
                  {frame.outline && <ArchOutline className="-inset-3 h-[calc(100%+1.5rem)] w-[calc(100%+1.5rem)] text-gold/50" />}
                  {item.frame === 'circle' && <div className="absolute -inset-4 rounded-full border border-dashed border-gold/30" />}
                </div>
                <div className={`relative ${i % 2 ? 'order-1' : ''} ${i % 2 ? 'self-end pb-[14vh]' : 'self-start pt-[22vh]'}`}>
                  <ChapterText item={item} />
                </div>
              </article>
            )
          })}

          <div className="relative flex w-[50vw] shrink-0 flex-col items-start justify-center px-[6vw]">
            <p className="font-serif text-3xl text-marigold italic">and now…</p>
            <p className="mt-4 max-w-xl font-display text-[clamp(2.4rem,4.4vw,4.6rem)] leading-[1.02] text-ivory">
              the next chapter is yours to witness.
            </p>
            <button
              type="button"
              onClick={() => scrollTo('countdown')}
              className="group mt-10 inline-flex items-center gap-3 border-b border-gold/40 pb-2 text-sm tracking-[0.2em] text-gold uppercase transition-colors hover:border-gold"
            >
              Count down with us
              <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </motion.div>

        {/* Progress bar from 2019 to 2026 */}
        <div className="absolute inset-x-[8vw] bottom-8 flex items-center gap-4">
          <span className="eyebrow text-ivory/40">2019</span>
          <div className="relative h-px flex-1 bg-ivory/10">
            <motion.div style={{ scaleX: scrollYProgress }} className="absolute inset-0 origin-left bg-gold" />
          </div>
          <span className="eyebrow text-ivory/40">2026</span>
        </div>
      </div>
    </section>
  )
}

// Mobile: a simple vertical timeline with the same thread down the side.
function VerticalStory() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.6', 'end 0.6'] })
  const line = useSpring(scrollYProgress, { stiffness: 90, damping: 30 })

  return (
    <section id="story" className="relative bg-ink px-6 py-28">
      <p className="flex items-center gap-3 text-gold">
        <span className="eyebrow">03</span>
        <span className="h-px w-10 bg-current opacity-50" />
        <span className="eyebrow">Our Kahaani</span>
        <span className="font-deva text-sm opacity-80">· कहानी</span>
      </p>
      <h2 className="mt-6 font-display text-[clamp(2.8rem,11vw,5rem)] leading-[0.95] tracking-[-0.02em] text-ivory">
        <RevealText text="How a borrowed umbrella became" />{' '}
        <RevealText text="a lifetime" delay={0.2} className="font-serif text-marigold italic" />
      </h2>

      <div ref={ref} className="relative mt-16 pl-8">
        <div className="absolute top-0 bottom-0 left-0 w-px bg-ivory/10" />
        <motion.div style={{ scaleY: line }} className="absolute top-0 bottom-0 left-0 w-0.5 origin-top bg-linear-to-b from-sindoor via-marigold to-gold" />
        <div className="space-y-20">
          {story.map((item) => (
            <motion.article
              key={item.year}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-15%' }}
              transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <span className="absolute top-2 left-[-2.3rem] size-3 rounded-full border-2 border-ink bg-marigold" />
              <span aria-hidden="true" className="text-outline block font-display text-7xl leading-none text-gold/30">
                {item.year}
              </span>
              <div className={`relative mt-5 w-full ${item.frame === 'circle' ? 'aspect-square max-w-xs' : 'aspect-4/5 max-w-md'}`}>
                <Picture
                  id={item.image}
                  alt={item.place}
                  sizes="90vw"
                  className={`absolute inset-0 ${item.frame === 'arch' ? 'arch' : item.frame === 'circle' ? 'rounded-full' : 'rounded-sm'}`}
                />
              </div>
              <div className="mt-7">
                <ChapterText item={item} />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}

// Our love story in four chapters.
export default function Story() {
  const desktop = useIsDesktop()
  return desktop ? <HorizontalStory /> : <VerticalStory />
}
