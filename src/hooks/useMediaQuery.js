import { useCallback, useSyncExternalStore } from 'react'
import { IN_FRAME } from '../lib/frame'

// True when the CSS media query matches; updates when the screen changes.
export function useMediaQuery(query) {
  const subscribe = useCallback(
    (onChange) => {
      const list = window.matchMedia(query)
      list.addEventListener('change', onChange)
      return () => list.removeEventListener('change', onChange)
    },
    [query],
  )
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(query).matches,
    () => false,
  )
}

export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)')
// Inside the phone frame the invite acts like a touch phone: no custom cursor or hover previews.
export const useFinePointer = () => {
  const fine = useMediaQuery('(pointer: fine)')
  return fine && !IN_FRAME
}
