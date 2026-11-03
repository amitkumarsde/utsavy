import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { couple, families, invitationText, wedding } from '../data/wedding'
import { ArchEdge, Divider, Lotus } from '../components/ui/Ornaments'

// Round date badge whose text ring turns as you scroll.
function DateSeal() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] })
  const rotate = useTransform(scrollYProgress, [0, 1], [-90, 200])
  const text = 'TWELVE DECEMBER ✦ TWO THOUSAND TWENTY SIX ✦ UDAIPUR ✦ '

  return (
    <div ref={ref} className="relative size-36 sm:size-44">
      <motion.svg style={{ rotate }} viewBox="0 0 200 200" className="absolute inset-0 h-full w-full text-maroon" aria-hidden="true">
        <defs>
          <path id="seal-circle" d="M100 100 m-78 0 a78 78 0 1 1 156 0 a78 78 0 1 1 -156 0" />
        </defs>
        <text fontSize="11" fontFamily="Manrope, sans-serif" fontWeight="600" fill="currentColor">
          {/* textLength makes the text fit the circle exactly, so it never overlaps */}
          <textPath href="#seal-circle" textLength="488" lengthAdjust="spacing">
            {text}
          </textPath>
        </text>
      </motion.svg>
      <div className="absolute inset-[22%] grid place-items-center rounded-full bg-maroon text-paper shadow-[inset_0_0_0_4px_rgba(239,228,208,0.15)]">
        <div className="text-center leading-none">
          <span className="block font-display text-3xl italic sm:text-4xl">12</span>
          <span className="eyebrow mt-1 block text-[0.55rem]! tracking-[0.25em]! opacity-80">Dec</span>
        </div>
      </div>
    </div>
  )
}

// The invitation letter: blessing line, invite text, both families and the date.
export default function Invitation() {
  return (
    <section id="invitation" data-theme="light" className="paper relative">
      <ArchEdge className="absolute bottom-full left-0" />
      <div className="mx-auto max-w-6xl px-6 pt-20 pb-28 sm:pt-28 sm:pb-36">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="flex flex-col items-center text-center text-maroon"
        >
          <p className="font-deva text-lg sm:text-xl">॥ श्री गणेशाय नमः ॥</p>
          <Lotus className="mt-5 text-gold-deep" size={56} />
          <p className="eyebrow mt-6 text-gold-deep">01 · The Invitation · निमंत्रण</p>
        </motion.div>

        <InvitationCopy />

        <Divider className="mx-auto mt-20 max-w-md text-gold-deep" />

        <div className="mt-16 grid items-center gap-12 md:grid-cols-[1fr_auto_1fr] md:gap-10">
          {families.map((family, i) => (
            <motion.div
              key={family.side}
              initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-10%' }}
              transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
              className={`text-center ${i === 0 ? 'md:order-1 md:text-right' : 'md:order-3 md:text-left'}`}
            >
              <p className="eyebrow text-gold-deep">{family.side}</p>
              {family.lines.map((line) => (
                <p key={line} className="mt-3 font-serif text-lg text-ink/60 italic">
                  {line}
                </p>
              ))}
              <p className="mt-2 font-display text-2xl leading-snug text-ink sm:text-3xl">{family.parents}</p>
              <p className="mt-3 text-sm tracking-wide text-ink/55">{family.city}</p>
            </motion.div>
          ))}
          <div className="flex flex-col items-center md:order-2">
            <span className="hidden h-16 w-px bg-gold-deep/50 md:block" />
            <span className="my-3 font-serif text-5xl text-sindoor italic">&</span>
            <span className="hidden h-16 w-px bg-gold-deep/50 md:block" />
          </div>
        </div>

        <div className="mt-24 flex flex-col items-center gap-10 sm:flex-row sm:justify-center sm:gap-16">
          <DateSeal />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center sm:text-left"
          >
            <p className="eyebrow text-gold-deep">request the honour of your presence</p>
            <p className="mt-4 font-display text-4xl leading-tight text-ink sm:text-5xl">
              {couple.bride.first}
              <span className="mx-3 font-serif text-sindoor italic">weds</span>
              {couple.groom.first}
            </p>
            <p className="mt-3 text-ink/60">
              {wedding.displayDate} · The Oberoi Udaivilas, {wedding.city}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

// Invite text where each word darkens as you scroll past it.
function InvitationCopy() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.55'] })
  const words = invitationText.split(' ')
  const accents = ['pheras', 'pichola,', 'moon.', 'one']

  return (
    <p
      ref={ref}
      className="mx-auto mt-12 max-w-5xl text-center font-display text-[clamp(1.55rem,3.5vw,3.2rem)] leading-[1.28] tracking-[-0.01em] text-ink"
    >
      <span className="sr-only">{invitationText}</span>
      {words.map((word, i) => (
        <Word key={i} progress={scrollYProgress} range={[i / words.length, (i + 1) / words.length]}>
          <span className={accents.includes(word.toLowerCase()) ? 'font-serif text-[1.1em] text-sindoor italic' : undefined}>{word}</span>
        </Word>
      ))}
    </p>
  )
}

function Word({ children, progress, range }) {
  const opacity = useTransform(progress, range, [0.12, 1])
  return (
    <>
      <motion.span aria-hidden="true" style={{ opacity }} className="inline-block">
        {children}
      </motion.span>{' '}
    </>
  )
}
