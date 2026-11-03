import { AnimatePresence, motion } from 'framer-motion'
import { Music2, VolumeX } from 'lucide-react'
import { useEffect, useState } from 'react'
import { couple, wedding } from '../data/wedding'
import { ArchOutline, JaaliPattern, Sparkle } from '../components/ui/Ornaments'
import Magnetic from '../components/ui/Magnetic'
import { useSmoothScroll } from '../context'

const DOOR_EASE = [0.7, 0, 0.18, 1]

// Marigold and mango-leaf garland (toran) hanging over the doors.
function Toran() {
  const strands = 19
  return (
    <svg viewBox="0 0 1000 150" preserveAspectRatio="xMidYMin slice" className="h-[16vh] min-h-22.5 w-full" aria-hidden="true">
      <defs>
        <radialGradient id="mg" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#FFD36B" />
          <stop offset="55%" stopColor="#EFA02F" />
          <stop offset="100%" stopColor="#B85A0B" />
        </radialGradient>
        <radialGradient id="mg2" cx="35%" cy="35%" r="70%">
          <stop offset="0%" stopColor="#FFE9A8" />
          <stop offset="60%" stopColor="#F3C440" />
          <stop offset="100%" stopColor="#C58A10" />
        </radialGradient>
      </defs>
      <rect x="0" y="0" width="1000" height="10" fill="#5C1222" />
      <path d="M0 10 H1000" stroke="#D6B370" strokeWidth="1.5" />
      {Array.from({ length: strands }, (_, i) => {
        const x = (1000 / strands) * (i + 0.5)
        const beads = 4 + ((i * 7) % 4)
        return (
          <g key={i}>
            <line x1={x} y1="10" x2={x} y2={14 + beads * 15} stroke="#7a5a1d" strokeWidth="0.8" />
            {Array.from({ length: beads }, (_, b) => (
              <circle key={b} cx={x} cy={20 + b * 15} r={7.2 - (b % 2) * 0.8} fill={b % 3 === 1 ? 'url(#mg2)' : 'url(#mg)'} />
            ))}
            <path
              d={`M${x} ${22 + beads * 15} q-6 10 0 22 q6 -12 0 -22Z`}
              fill="#4F7A3A"
              stroke="#2F4F22"
              strokeWidth="0.6"
            />
          </g>
        )
      })}
      {Array.from({ length: strands - 1 }, (_, i) => {
        const x = (1000 / strands) * (i + 1)
        return <path key={i} d={`M${x} 10 q-7 14 0 30 q7 -16 0 -30Z`} fill="#3F6B2F" opacity="0.9" />
      })}
    </svg>
  )
}

// One carved wooden door with a lattice panel and a brass handle.
function Door({ side }) {
  const left = side === 'left'
  return (
    <div
      className={`absolute top-0 h-full w-1/2 ${left ? 'left-0' : 'right-0'}`}
      style={{
        background: left
          ? 'linear-gradient(100deg, #1c060b 0%, #3b0c17 55%, #4a1020 100%)'
          : 'linear-gradient(260deg, #1c060b 0%, #3b0c17 55%, #4a1020 100%)',
        boxShadow: left ? 'inset -30px 0 60px rgba(0,0,0,0.45)' : 'inset 30px 0 60px rgba(0,0,0,0.45)',
      }}
    >
      <div className="absolute inset-[5%] border border-gold/25" />
      <div className="absolute inset-[7%] top-[16%] bottom-[10%]">
        <svg className="arch absolute inset-0 h-full w-full text-gold/45" aria-hidden="true">
          <defs>
            <JaaliPattern id={`jaali-${side}`} />
          </defs>
          <rect width="100%" height="100%" fill={`url(#jaali-${side})`} />
        </svg>
        <ArchOutline className="inset-0 h-full w-full text-gold/70" strokeWidth={1.4} />
        <ArchOutline className="-inset-3 h-[calc(100%+1.5rem)] w-[calc(100%+1.5rem)] text-gold/25" />
      </div>
      {/* brass handle */}
      <div className={`absolute top-[74%] flex flex-col items-center ${left ? 'right-[5%]' : 'left-[5%]'}`}>
        <div className="size-3 rounded-full bg-linear-to-br from-[#f6dfa4] to-gold-deep shadow-[0_0_12px_rgba(214,179,112,0.6)]" />
        <div className="-mt-0.5 h-10 w-7 rounded-full border-2 border-gold/80" />
      </div>
      {/* strip where the two doors meet */}
      <div className={`absolute top-0 h-full w-2 ${left ? 'right-0' : 'left-0'} bg-linear-to-b from-gold-deep/60 via-gold/80 to-gold-deep/60`} />
    </div>
  )
}

// Red wax seal with the couple's initials.
function WaxSeal() {
  return (
    <svg viewBox="0 0 160 160" className="size-28 drop-shadow-[0_12px_30px_rgba(0,0,0,0.6)] sm:size-32" aria-hidden="true">
      <defs>
        <radialGradient id="wax" cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#E0533F" />
          <stop offset="55%" stopColor="#A61E1E" />
          <stop offset="100%" stopColor="#5E0B10" />
        </radialGradient>
      </defs>
      <path
        d="M80 6c10 0 14 7 23 9s17-2 23 5 3 15 8 22 13 10 13 19-7 13-8 22 5 16-1 24-15 6-22 11-9 14-19 16-15-6-24-6-15 8-24 4-8-12-15-17-17-5-21-13 3-15 1-24-11-13-9-22 11-11 14-19-1-16 6-22 15-1 23-6 11-12 21-12Z"
        fill="url(#wax)"
      />
      <circle cx="80" cy="80" r="50" fill="none" stroke="#5E0B10" strokeWidth="2" opacity="0.6" />
      <circle cx="80" cy="80" r="44" fill="none" stroke="#F0B49A" strokeWidth="0.8" opacity="0.4" strokeDasharray="2 4" />
      <text
        x="80"
        y="92"
        textAnchor="middle"
        fontFamily="'Bodoni Moda', serif"
        fontStyle="italic"
        fontSize="38"
        fill="#5E0B10"
        style={{ filter: 'drop-shadow(0 1px 0 rgba(255,200,180,0.35))' }}
      >
        {couple.monogram}
      </text>
    </svg>
  )
}

// Opening screen: closed palace doors that swing open when the guest taps a button.
// `onOpen` runs on tap, `onDone` after the doors finish opening.
export default function Gateway({ onOpen, onDone }) {
  const [opening, setOpening] = useState(false)
  const { lock, unlock } = useSmoothScroll()

  useEffect(() => {
    lock()
    return unlock
  }, [lock, unlock])

  const enter = (withMusic) => {
    if (opening) return
    setOpening(true)
    onOpen(withMusic)
  }

  return (
    <motion.div
      role="dialog"
      aria-modal="true"
      aria-label="Wedding invitation — open the doors"
      className="fixed inset-0 z-100 overflow-hidden"
      style={{ perspective: '2200px' }}
      animate={opening ? { opacity: 0 } : { opacity: 1 }}
      transition={{ delay: opening ? 2.1 : 0, duration: 0.6 }}
      onAnimationComplete={() => opening && onDone()}
    >
      {/* light spilling through the gap */}
      <motion.div
        className="absolute inset-y-0 left-1/2 w-[40vw] -translate-x-1/2 bg-[radial-gradient(closest-side,rgba(255,214,140,0.85),rgba(239,160,47,0.25)_45%,transparent)]"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={opening ? { scaleX: [0, 0.2, 3], opacity: [0, 1, 0] } : {}}
        transition={{ duration: 2.2, times: [0, 0.35, 1], ease: 'easeOut' }}
      />

      <motion.div
        className="absolute inset-0 origin-left"
        style={{ transformStyle: 'preserve-3d' }}
        animate={opening ? { rotateY: -108 } : { rotateY: 0 }}
        transition={{ duration: 2, delay: 0.55, ease: DOOR_EASE }}
      >
        <Door side="left" />
      </motion.div>
      <motion.div
        className="absolute inset-0 origin-right"
        style={{ transformStyle: 'preserve-3d' }}
        animate={opening ? { rotateY: 108 } : { rotateY: 0 }}
        transition={{ duration: 2, delay: 0.55, ease: DOOR_EASE }}
      >
        <Door side="right" />
      </motion.div>

      <motion.div
        className="absolute inset-x-0 top-0 z-10"
        initial={{ y: '-100%' }}
        animate={opening ? { y: '-110%' } : { y: '0%' }}
        transition={opening ? { duration: 0.9, ease: [0.6, 0, 0.4, 1] } : { duration: 1.4, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <Toran />
      </motion.div>

      <AnimatePresence>
        {!opening && (
          <motion.div
            key="seal"
            className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center"
            exit={{ opacity: 0, scale: 1.08, filter: 'blur(6px)' }}
            transition={{ duration: 0.55 }}
          >
            <div className="absolute top-1/2 left-1/2 -z-10 size-[min(110vw,760px)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(closest-side,rgba(20,4,8,0.94),rgba(20,4,8,0.7)_55%,transparent)]" />
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 1 }}
              className="font-deva text-lg text-gold"
            >
              ॥ शुभ विवाह ॥
            </motion.p>
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="eyebrow mt-3 text-ivory/70"
            >
              You are cordially invited
            </motion.p>

            <motion.div
              initial={{ scale: 0.6, opacity: 0, rotate: -25 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              transition={{ delay: 1, type: 'spring', stiffness: 120, damping: 14 }}
              className="my-7"
            >
              <WaxSeal />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 1 }}
              className="font-display text-5xl text-ivory sm:text-6xl lg:text-7xl"
            >
              {couple.bride.first} <span className="font-serif text-marigold italic">&</span> {couple.groom.first}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.4, duration: 1 }}
              className="mt-3 flex items-center gap-3 text-sm tracking-[0.2em] text-ivory/70"
            >
              <Sparkle size={8} className="text-gold" /> {wedding.shortDate} <Sparkle size={8} className="text-gold" /> UDAIPUR
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 1 }}
              className="mt-10 flex flex-col items-center gap-4"
            >
              <Magnetic>
                <button
                  type="button"
                  onClick={() => enter(true)}
                  className="group relative flex items-center gap-3 overflow-hidden rounded-full bg-gold px-8 py-4 text-[0.78rem] font-bold tracking-[0.2em] text-ink uppercase shadow-[0_0_40px_rgba(214,179,112,0.35)] transition-transform active:scale-95"
                >
                  <span className="absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/50 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
                  <Music2 size={16} />
                  Open the doors
                </button>
              </Magnetic>
              <button
                type="button"
                onClick={() => enter(false)}
                className="flex items-center gap-2 text-xs tracking-[0.18em] text-ivory/60 uppercase underline-offset-4 transition-colors hover:text-ivory hover:underline"
              >
                <VolumeX size={13} /> Enter without music
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
