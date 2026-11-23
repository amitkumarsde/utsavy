import { AnimatePresence, motion } from 'framer-motion'
import { Smartphone, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'
import { useSmoothScroll, useSound } from '../../context'
import { useFocusTrap } from '../../hooks/useFocusTrap'
import { useIsDesktop } from '../../hooks/useMediaQuery'

const EASE = [0.22, 1, 0.36, 1]

// Standard iPhone (12–15) screen in CSS pixels, plus the bezel around it.
const SCREEN = { w: 390, h: 844 }
const BEZEL = 12
const PHONE = { w: SCREEN.w + BEZEL * 2, h: SCREEN.h + BEZEL * 2 }
// Room kept for the caption and close button around the phone.
const SPACE_Y = 120

// How much to shrink the phone so it fits the window. The screen inside always stays 390 × 844.
function fitScale() {
  return Math.min(1, (window.innerHeight - SPACE_Y) / PHONE.h, (window.innerWidth - 48) / PHONE.w)
}

// iPhone body: exact 390 × 844 screen, Dynamic Island and side buttons.
// Shrinking uses a transform, so the page inside still sees a full 390 × 844 screen.
function IPhone() {
  const [scale, setScale] = useState(fitScale)

  useEffect(() => {
    const onResize = () => setScale(fitScale())
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const button = 'absolute w-[3px] bg-[#2a2024]'

  return (
    <div className="relative" style={{ width: PHONE.w * scale, height: PHONE.h * scale }}>
      <div
        className="absolute top-0 left-0 origin-top-left rounded-[67px] bg-[#1a1316] shadow-[0_40px_120px_-20px_rgba(0,0,0,0.85),inset_0_0_0_2px_#3a2c31,inset_0_0_0_5px_#0b0809]"
        style={{ width: PHONE.w, height: PHONE.h, padding: BEZEL, transform: `scale(${scale})` }}
      >
        {/* side buttons: action, volume up, volume down (left) and power (right) */}
        <span className={`${button} -left-[3px] top-[120px] h-[32px] rounded-l-sm`} />
        <span className={`${button} -left-[3px] top-[180px] h-[62px] rounded-l-sm`} />
        <span className={`${button} -left-[3px] top-[256px] h-[62px] rounded-l-sm`} />
        <span className={`${button} -right-[3px] top-[210px] h-[100px] rounded-r-sm`} />

        <div className="relative h-full w-full overflow-hidden rounded-[55px] bg-ink">
          <iframe
            src={window.location.href}
            title="Invitation as seen on a phone"
            allow="autoplay; clipboard-write"
            className="block border-0"
            style={{ width: SCREEN.w, height: SCREEN.h }}
          />
          {/* Dynamic Island */}
          <span className="pointer-events-none absolute top-[11px] left-1/2 h-[37px] w-[126px] -translate-x-1/2 rounded-full bg-black" />
        </div>
      </div>
    </div>
  )
}

// On big screens: a phone tab on the right edge. Clicking it shows the invite
// as guests see it on a phone. The page loads itself in a phone-sized iframe,
// so every breakpoint and fixed element behaves exactly like a real phone.
export default function PhonePreview() {
  const desktop = useIsDesktop()
  const [open, setOpen] = useState(false)
  const tabRef = useRef(null)
  const closeRef = useRef(null)
  const dialogRef = useRef(null)
  const { lock, unlock } = useSmoothScroll()
  const { playing, toggle } = useSound()

  // Close it if the window becomes small (the page is already phone-sized then).
  const shown = open && desktop

  // Focus starts on Close, stays in the preview, and returns to the tab when it closes.
  useFocusTrap(shown, [dialogRef], closeRef)

  useEffect(() => {
    if (!shown) return
    lock()
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      unlock()
      window.removeEventListener('keydown', onKey)
    }
  }, [shown, lock, unlock])

  const openPreview = () => {
    // Pause the page's music so it does not play twice with the phone's.
    if (playing) toggle()
    setOpen(true)
  }

  if (!desktop) return null

  return (
    <>
      <button
        ref={tabRef}
        type="button"
        onClick={openPreview}
        aria-haspopup="dialog"
        data-cursor="Phone"
        className="group fixed top-1/2 right-0 z-110 flex -translate-y-1/2 flex-col items-center gap-3 rounded-l-2xl border border-r-0 border-gold/30 bg-ink/70 px-2.5 py-4 text-gold shadow-xl shadow-black/40 backdrop-blur-md transition-colors hover:bg-gold hover:text-ink"
      >
        <Smartphone size={18} strokeWidth={1.8} />
        <span className="eyebrow text-[0.6rem]! [writing-mode:vertical-rl]">Phone view</span>
      </button>

      <AnimatePresence>
        {shown && (
          <motion.div
            key="phone-preview"
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-label="Phone preview of the invitation"
            data-native-cursor
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-160 grid place-items-center bg-ink/85 p-6 backdrop-blur-md"
          >
            <button
              ref={closeRef}
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close phone preview"
              className="absolute top-6 right-6 grid size-12 place-items-center rounded-full border border-ivory/20 text-ivory transition-colors hover:bg-ivory hover:text-ink"
            >
              <X size={20} />
            </button>

            <motion.div
              initial={{ opacity: 0, y: 40, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 30, scale: 0.96 }}
              transition={{ duration: 0.5, ease: EASE }}
              onClick={(e) => e.stopPropagation()}
              className="flex flex-col items-center gap-4"
            >
              <IPhone />
              <p className="eyebrow text-ivory/50">
                iPhone 15 <span className="mx-2 text-gold">·</span> {SCREEN.w} × {SCREEN.h}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
