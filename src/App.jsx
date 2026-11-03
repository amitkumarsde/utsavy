import { AnimatePresence, MotionConfig } from 'framer-motion'
import { lazy, Suspense, useCallback, useEffect, useState } from 'react'
import SmoothScroll from './components/providers/SmoothScroll'
import Sound from './components/providers/Sound'
import Toast from './components/providers/Toast'
import Nav from './components/layout/Nav'
import Cursor from './components/ui/Cursor'
import { SvgDefs } from './components/ui/Ornaments'
import { useSound } from './context'
import Gateway from './sections/Gateway'
import Hero from './sections/Hero'

// Sections below the hero load as a separate file to keep the first load small.
const loadChapters = () => import('./sections/Chapters')
const Chapters = lazy(loadChapters)

const OPENED_KEY = 'ishaani-kabir:opened'

// Add `?intro` to the URL to always see the opening doors.
function initialPhase() {
  try {
    const forceIntro = new URLSearchParams(window.location.search).has('intro')
    return !forceIntro && sessionStorage.getItem(OPENED_KEY) ? 'open' : 'gate'
  } catch {
    return 'gate'
  }
}

// The whole invitation page.
function Invite() {
  // Steps: 'gate' (doors closed) → 'opening' (doors swing) → 'open'.
  // Guests who already opened the doors in this tab skip straight in.
  const [phase, setPhase] = useState(initialPhase)
  const [burst, setBurst] = useState(0)
  const { play } = useSound()

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)
    loadChapters()
  }, [])

  const handleOpen = useCallback(
    (withMusic) => {
      if (withMusic) play()
      setPhase('opening')
      setTimeout(() => setBurst(Date.now()), 900)
    },
    [play],
  )

  const handleDone = useCallback(() => {
    setPhase('open')
    try {
      sessionStorage.setItem(OPENED_KEY, '1')
    } catch {
      // Not saved; the doors will just show again next time.
    }
  }, [])

  return (
    <div className="grain">
      <SvgDefs />
      <Cursor />
      <Nav visible={phase === 'open'} />

      <AnimatePresence>
        {phase !== 'open' && <Gateway key="gateway" onOpen={handleOpen} onDone={handleDone} />}
      </AnimatePresence>

      <main aria-hidden={phase === 'gate' ? true : undefined}>
        <Hero play={phase !== 'gate'} burst={burst} />
        <Suspense fallback={<div className="paper h-screen" />}>
          <Chapters />
        </Suspense>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll>
        <Sound>
          <Toast>
            <Invite />
          </Toast>
        </Sound>
      </SmoothScroll>
    </MotionConfig>
  )
}
