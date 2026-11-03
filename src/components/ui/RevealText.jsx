import { motion } from 'framer-motion'

const EASE = [0.22, 1, 0.36, 1]

// Headline whose words (or letters) slide up into view.
// Pass `play` to start it yourself, otherwise it starts when scrolled into view.
export default function RevealText({
  text,
  as = 'span',
  mode = 'words',
  className = '',
  delay = 0,
  stagger,
  duration = 1.1,
  play,
}) {
  const Tag = motion[as]
  const words = text.split(' ')
  const step = stagger ?? (mode === 'chars' ? 0.035 : 0.08)
  let index = 0

  const trigger =
    play === undefined
      ? { initial: 'hidden', whileInView: 'show', viewport: { once: true, margin: '0px 0px -12% 0px' } }
      : { initial: 'hidden', animate: play ? 'show' : 'hidden' }

  const piece = (content, key) => {
    const i = index++
    return (
      <span key={key} className="inline-block overflow-hidden pb-[0.12em] mb-[-0.12em] align-bottom">
        <motion.span
          className="inline-block will-change-transform"
          variants={{
            hidden: { y: '110%', rotate: 4 },
            show: { y: '0%', rotate: 0, transition: { duration, ease: EASE, delay: delay + i * step } },
          }}
        >
          {content}
        </motion.span>
      </span>
    )
  }

  return (
    <Tag className={className} {...trigger}>
      {/* Screen readers read this plain copy instead of the split pieces */}
      <span className="sr-only">{text}</span>
      {words.map((word, w) => (
        <span key={w} aria-hidden="true" className="inline-block whitespace-nowrap">
          {mode === 'chars' ? [...word].map((ch, c) => piece(ch, c)) : piece(word, 0)}
          {w < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </Tag>
  )
}
