import Lenis from 'lenis'
import { useEffect, useMemo, useRef } from 'react'
import { SmoothScrollContext } from '../../context'
import { useMediaQuery } from '../../hooks/useMediaQuery'

// Smooth page scrolling with Lenis, plus helpers to scroll to a section or freeze the page.
// Turns itself off for people who prefer reduced motion.
export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null)
  const locks = useRef(0)
  const reduced = useMediaQuery('(prefers-reduced-motion: reduce)')

  useEffect(() => {
    if (reduced) return
    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true, autoRaf: true })
    lenisRef.current = lenis
    if (locks.current > 0) lenis.stop()
    return () => {
      lenis.destroy()
      lenisRef.current = null
    }
  }, [reduced])

  const api = useMemo(
    () => ({
      scrollTo(target, options = {}) {
        const el = typeof target === 'string' ? document.getElementById(target) : target
        if (lenisRef.current) {
          lenisRef.current.scrollTo(el ?? target, { duration: 1.6, offset: 0, ...options })
        } else if (el?.scrollIntoView) {
          el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' })
        } else if (typeof target === 'number') {
          window.scrollTo({ top: target })
        }
      },
      lock() {
        locks.current += 1
        lenisRef.current?.stop()
        document.documentElement.style.overflow = 'hidden'
      },
      unlock() {
        locks.current = Math.max(0, locks.current - 1)
        if (locks.current === 0) {
          lenisRef.current?.start()
          document.documentElement.style.overflow = ''
        }
      },
    }),
    [reduced],
  )

  return <SmoothScrollContext.Provider value={api}>{children}</SmoothScrollContext.Provider>
}
