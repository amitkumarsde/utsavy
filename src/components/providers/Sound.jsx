import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { SoundContext } from '../../context'
import { createTanpura } from '../../lib/tanpura'

// Shares the tanpura music on/off state with the whole app.
export default function Sound({ children }) {
  const engine = useRef(null)
  const [playing, setPlaying] = useState(false)

  const play = useCallback(async () => {
    engine.current ??= createTanpura()
    const ok = await engine.current.start()
    setPlaying(Boolean(ok))
  }, [])

  const stop = useCallback(() => {
    engine.current?.stop()
    setPlaying(false)
  }, [])

  const toggle = useCallback(() => (playing ? stop() : play()), [playing, play, stop])

  // Pause the music when the tab is hidden and resume when it comes back.
  useEffect(() => {
    if (!playing) return
    const onVisibility = () => (document.hidden ? engine.current?.stop() : engine.current?.start())
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [playing])

  const value = useMemo(() => ({ playing, toggle, play }), [playing, toggle, play])
  return <SoundContext.Provider value={value}>{children}</SoundContext.Provider>
}
