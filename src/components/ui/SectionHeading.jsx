import { motion } from 'framer-motion'
import RevealText from './RevealText'

const SIZES = {
  lg: 'text-[clamp(2.6rem,7vw,6.5rem)]',
  md: 'text-[clamp(2.4rem,5.2vw,5rem)]',
}

// Section title: small label line (number · name · Hindi name) above a big heading.
export default function SectionHeading({ index, label, deva, title, italic, align = 'left', size = 'lg', className = '', tone = 'text-gold' }) {
  const centered = align === 'center'
  return (
    <div className={`${centered ? 'text-center' : ''} ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className={`flex items-center gap-3 ${tone} ${centered ? 'justify-center' : ''}`}
      >
        <span className="eyebrow">{index}</span>
        <span className="h-px w-10 bg-current opacity-50" />
        <span className="eyebrow">{label}</span>
        {deva && <span className="font-deva text-sm opacity-80">· {deva}</span>}
      </motion.div>
      <h2 className={`mt-6 font-display ${SIZES[size]} leading-[0.95] font-normal tracking-[-0.02em]`}>
        <RevealText text={title} />
        {italic && (
          <>
            <br />
            <RevealText text={italic} delay={0.15} className="font-serif text-[1.08em] italic" />
          </>
        )}
      </h2>
    </div>
  )
}
