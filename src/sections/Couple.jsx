import { motion, useScroll, useTransform } from 'framer-motion'
import { MapPin } from 'lucide-react'
import { useRef } from 'react'
import { couple, images } from '../data/wedding'
import { ArchOutline, Mandala, Sparkle } from '../components/ui/Ornaments'
import Picture from '../components/ui/Picture'
import SectionHeading from '../components/ui/SectionHeading'

// Name, short bio and fun facts for the bride or the groom.
function Person({ person, align }) {
  const right = align === 'right'
  const [first, ...rest] = person.full.split(' ')
  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-15%' }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      className={`relative ${right ? 'lg:text-right' : ''}`}
    >
      <p className={`flex items-center gap-3 text-gold ${right ? 'lg:justify-end' : ''}`}>
        <span className="eyebrow">{person.role}</span>
        <span className="h-px w-8 bg-gold/50" />
      </p>
      <h3 className="mt-4 font-display text-6xl leading-[0.9] text-ivory sm:text-7xl xl:text-8xl">
        {first}
        <span className="mt-1 block font-serif text-[0.55em] text-gold italic">{rest.join(' ')}</span>
      </h3>
      <p className={`mt-6 max-w-sm text-[0.95rem] leading-relaxed text-ivory/70 ${right ? 'lg:ml-auto' : ''}`}>{person.bio}</p>
      <ul className={`mt-6 space-y-2.5 ${right ? 'lg:ml-auto' : ''}`}>
        {person.facts.map((fact) => (
          <li key={fact} className={`flex items-center gap-3 text-sm text-ivory/80 ${right ? 'lg:flex-row-reverse' : ''}`}>
            <Sparkle size={9} className="shrink-0 text-marigold" />
            {fact}
          </li>
        ))}
      </ul>
      <p className="mt-7 inline-flex items-center gap-2 rounded-full border border-ivory/15 px-4 py-2 text-xs tracking-[0.16em] text-ivory/70 uppercase">
        <MapPin size={13} className="text-gold" /> {person.city}
      </p>
    </motion.article>
  )
}

// Bride and groom on either side of one arched portrait.
export default function Couple() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const imgY = useTransform(scrollYProgress, [0, 1], ['-8%', '8%'])
  const frameY = useTransform(scrollYProgress, [0, 1], [80, -80])
  const mandalaRotate = useTransform(scrollYProgress, [0, 1], [0, 90])

  return (
    <section id="couple" ref={ref} className="relative overflow-hidden bg-wine py-28 sm:py-36">
      <div className="absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_45%,rgba(200,56,43,0.18),transparent_70%)]" />
      <SectionHeading
        index="02"
        label="The Couple"
        deva="जोड़ी"
        title="Two souls,"
        italic="one story"
        align="center"
        className="relative px-6 text-ivory"
      />

      <div className="relative mx-auto mt-20 grid max-w-7xl items-center gap-16 px-6 lg:mt-28 lg:grid-cols-[1fr_minmax(300px,420px)_1fr] lg:gap-14">
        <div className="order-2 lg:order-1">
          <Person person={couple.bride} align="right" />
        </div>

        <motion.div style={{ y: frameY }} className="relative order-1 mx-auto w-[min(78vw,420px)] lg:order-2">
          <motion.div style={{ rotate: mandalaRotate }} className="absolute top-1/2 left-1/2 z-0 w-[170%] -translate-x-1/2 -translate-y-1/2">
            <Mandala className="w-full text-gold/15" />
          </motion.div>
          <div className="relative aspect-2/3">
            <Picture
              id={images.couple}
              alt="Ishaani in a red lehenga and Kabir in an ivory sherwani under a canopy of lights"
              sizes="(min-width: 1024px) 420px, 78vw"
              className="arch absolute inset-0"
              imgStyle={{ y: imgY, scale: 1.18 }}
            />
            <ArchOutline className="-inset-3 h-[calc(100%+1.5rem)] w-[calc(100%+1.5rem)] text-gold/60" />
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-full border border-gold/40 bg-wine px-5 py-2 font-serif text-lg whitespace-nowrap text-gold italic">
              est. 2019 · Mumbai
            </div>
          </div>
        </motion.div>

        <div className="order-3">
          <Person person={couple.groom} align="left" />
        </div>
      </div>
    </section>
  )
}
