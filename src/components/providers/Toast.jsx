import { AnimatePresence, motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useCallback, useRef, useState } from 'react'
import { ToastContext } from '../../context'

// Small pop-up message at the bottom of the screen. Call `useToast()('text')` to show one.
export default function Toast({ children }) {
  const [message, setMessage] = useState(null)
  const timer = useRef(null)

  const show = useCallback((text) => {
    clearTimeout(timer.current)
    setMessage({ text, key: Date.now() })
    timer.current = setTimeout(() => setMessage(null), 2600)
  }, [])

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-120 flex justify-center px-4">
        <AnimatePresence>
          {message && (
            <motion.div
              key={message.key}
              initial={{ y: 30, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
              className="flex items-center gap-3 rounded-full border border-gold/30 bg-ink/90 py-3 pr-5 pl-3 text-sm text-ivory shadow-2xl shadow-black/50 backdrop-blur-md"
            >
              <span className="grid size-6 place-items-center rounded-full bg-gold text-ink">
                <Check size={14} strokeWidth={2.5} />
              </span>
              {message.text}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}
