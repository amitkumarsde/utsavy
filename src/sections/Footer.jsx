import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUp, Copy, Phone } from 'lucide-react'
import { useRef } from 'react'
import { contacts, couple, wedding } from '../data/wedding'
import { copyText } from '../lib/storage'
import { Lotus, Sparkle } from '../components/ui/Ornaments'
import { useSmoothScroll, useToast } from '../context'

// Closing message, big names, help contacts and share links.
export default function Footer() {
  const ref = useRef(null)
  const { scrollTo } = useSmoothScroll()
  const toast = useToast()
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] })
  const nameY = useTransform(scrollYProgress, [0, 1], ['40%', '0%'])
  const spread = useTransform(scrollYProgress, [0, 1], ['-0.06em', '-0.03em'])

  const copyTag = async () => {
    await copyText(couple.hashtag)
    toast(`${couple.hashtag} copied — tag us in every photo!`)
  }

  return (
    <footer ref={ref} className="relative overflow-hidden bg-ink pt-28 pb-10">
      <div className="gold-rule absolute inset-x-0 top-0" />
      <div className="mx-auto max-w-6xl px-6 text-center">
        <Lotus size={60} className="mx-auto text-gold" />
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.1 }}
          className="mx-auto mt-8 max-w-3xl font-serif text-[clamp(1.8rem,4vw,3.4rem)] leading-tight text-ivory/90 italic"
        >
          Your presence is the only gift we seek. Come for the pheras, stay for the jalebis, leave with our love.
        </motion.p>
        <p className="eyebrow mt-8 text-gold">With love · the Rathore &amp; Malhotra families</p>
      </div>

      <motion.h2
        style={{ y: nameY, letterSpacing: spread }}
        className="shine mt-20 text-center font-display text-[15.5vw] leading-[0.9] whitespace-nowrap select-none"
        aria-label={`${couple.bride.first} and ${couple.groom.first}`}
      >
        {couple.bride.first}
        <span className="mx-[0.04em] font-serif italic">&amp;</span>
        {couple.groom.first}
      </motion.h2>

      <div className="mx-auto mt-16 grid max-w-6xl gap-10 border-t border-ivory/10 px-6 pt-12 md:grid-cols-3 md:items-start">
        <div>
          <p className="eyebrow text-ivory/40">Need help?</p>
          <ul className="mt-4 space-y-3">
            {contacts.map((c) => (
              <li key={c.name}>
                <a href={`tel:${c.phone.replace(/\s/g, '')}`} className="group inline-flex items-center gap-3 text-ivory/80 transition-colors hover:text-gold">
                  <Phone size={14} className="text-gold" />
                  <span>
                    {c.name} <span className="text-ivory/40">· {c.relation}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:text-center">
          <p className="eyebrow text-ivory/40">Share the joy</p>
          <button
            type="button"
            onClick={copyTag}
            className="mt-4 inline-flex items-center gap-3 rounded-full border border-gold/30 px-5 py-2.5 font-display text-lg text-gold transition-colors hover:bg-gold hover:text-ink"
          >
            {couple.hashtag} <Copy size={14} />
          </button>
        </div>

        <div className="md:text-right">
          <p className="eyebrow text-ivory/40">{wedding.shortDate}</p>
          <button
            type="button"
            onClick={() => scrollTo(0)}
            className="group mt-4 inline-flex items-center gap-3 text-ivory/80 transition-colors hover:text-gold"
          >
            Back to the beginning
            <span className="grid size-10 place-items-center rounded-full border border-ivory/20 transition-transform duration-500 group-hover:-translate-y-1">
              <ArrowUp size={16} />
            </span>
          </button>
        </div>
      </div>

      <div className="mx-auto mt-16 flex max-w-6xl flex-col items-center justify-between gap-3 px-6 text-xs text-ivory/40 sm:flex-row">
        <p className="flex items-center gap-2">
          Crafted with <Sparkle size={9} className="text-marigold" /> on{' '}
          <a href="https://www.utsavy.in/" target="_blank" rel="noreferrer" className="text-ivory/70 underline-offset-4 hover:text-gold hover:underline">
            Utsavy
          </a>
        </p>
        <p>
          Photographs via{' '}
          <a href="https://unsplash.com/" target="_blank" rel="noreferrer" className="underline-offset-4 hover:text-gold hover:underline">
            Unsplash
          </a>{' '}
          · © 2026 The Rathore &amp; Malhotra families
        </p>
      </div>
    </footer>
  )
}
