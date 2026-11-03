// Shared app state: smooth scroll helpers, music and toast messages.
import { createContext, useContext } from 'react'

export const SmoothScrollContext = createContext({
  scrollTo: () => {},
  lock: () => {},
  unlock: () => {},
})
export const SoundContext = createContext({ playing: false, toggle: () => {}, play: () => {} })
export const ToastContext = createContext(() => {})

export const useSmoothScroll = () => useContext(SmoothScrollContext)
export const useSound = () => useContext(SoundContext)
export const useToast = () => useContext(ToastContext)
