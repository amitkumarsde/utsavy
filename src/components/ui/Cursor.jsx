import { AnimatePresence, motion, useMotionValue, useSpring } from 'framer-motion'
import { useEffect, useState } from 'react'
import { useFinePointer } from '../../hooks/useMediaQuery'

const INTERACTIVE = 'a, button, [role="button"], label, select, [data-cursor]'

// Custom mouse cursor: a dot plus a ring that grows (and can show a word) over buttons and links.
// Only used on devices with a real mouse.
export default function Cursor() {
  const fine = useFinePointer()
  const x = useMotionValue(-100)
  const y = useMotionValue(-100)
  const rx = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 })
  const ry = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 })
  const [state, setState] = useState({ hover: false, label: '', hidden: true, dark: false })

  useEffect(() => {
    if (!fine) return
    document.documentElement.classList.add('has-cursor')

    const onMove = (e) => {
      x.set(e.clientX)
      y.set(e.clientY)
      const target = e.target instanceof Element ? e.target : null
      const hit = target?.closest(INTERACTIVE)
      const overText = target?.closest('input, textarea, iframe')
      const label = hit?.getAttribute('data-cursor') ?? ''
      const dark = Boolean(target?.closest('[data-theme="light"]'))
      setState((s) =>
        s.hover === Boolean(hit) && s.label === label && s.hidden === Boolean(overText) && s.dark === dark
          ? s
          : { hover: Boolean(hit), label, hidden: Boolean(overText), dark },
      )
    }
    // Hide it when the mouse leaves the window or the window loses focus.
    const onLeave = () => setState((s) => ({ ...s, hidden: true }))
    const root = document.documentElement

    window.addEventListener('pointermove', onMove, { passive: true })
    root.addEventListener('pointerleave', onLeave)
    window.addEventListener('blur', onLeave)
    return () => {
      root.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      root.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('blur', onLeave)
    }
  }, [fine, x, y])

  if (!fine) return null

  const ring = state.dark ? 'border-maroon/70' : 'border-gold/70'
  const dot = state.dark ? 'bg-maroon' : 'bg-gold'
  const size = state.label ? 84 : state.hover ? 54 : 34

  return (
    <div aria-hidden="true" className={`pointer-events-none fixed inset-0 z-200 transition-opacity duration-300 ${state.hidden ? 'opacity-0' : 'opacity-100'}`}>
      <motion.div style={{ x: rx, y: ry }} className="absolute top-0 left-0">
        <motion.div
          animate={{ width: size, height: size, backgroundColor: state.label ? 'rgba(214,179,112,0.92)' : 'rgba(214,179,112,0)' }}
          transition={{ type: 'spring', stiffness: 300, damping: 26 }}
          className={`grid -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border ${ring}`}
        >
          <AnimatePresence>
            {state.label && (
              <motion.span
                initial={{ opacity: 0, scale: 0.6 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.6 }}
                className="eyebrow text-[0.6rem]! tracking-[0.2em]! text-ink"
              >
                {state.label}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>
      <motion.div style={{ x, y }} className="absolute top-0 left-0">
        <div className={`size-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full ${dot}`} />
      </motion.div>
    </div>
  )
}
