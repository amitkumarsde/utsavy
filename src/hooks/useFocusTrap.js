import { useEffect } from 'react'

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select, iframe, [tabindex]:not([tabindex="-1"])'

// While `active`, keeps keyboard focus (Tab / Shift+Tab) inside the given containers,
// moves focus into them, and puts it back where it was when they close.
// `containers` is a list of refs; focus starts on `initial` (a ref) or the first item.
export function useFocusTrap(active, containers, initial) {
  useEffect(() => {
    if (!active) return
    const previous = document.activeElement

    const items = () =>
      containers
        .flatMap((ref) => (ref.current ? [...ref.current.querySelectorAll(FOCUSABLE)] : []))
        .filter((el) => !el.closest('[inert]') && el.getClientRects().length > 0)

    const start = initial?.current ?? items()[0]
    start?.focus({ preventScroll: true })

    const onKey = (e) => {
      if (e.key !== 'Tab') return
      const list = items()
      if (!list.length) return
      e.preventDefault()
      const index = list.indexOf(document.activeElement)
      const next = index === -1 ? 0 : (index + (e.shiftKey ? -1 : 1) + list.length) % list.length
      list[next].focus()
    }

    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('keydown', onKey)
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus({ preventScroll: true })
    }
    // `containers` and `initial` are refs, so they never change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active])
}
