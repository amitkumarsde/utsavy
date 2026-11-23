import { useEffect, useState } from 'react'

function remaining(target) {
  const diff = Math.max(0, target - Date.now())
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor((diff / 3_600_000) % 24),
    minutes: Math.floor((diff / 60_000) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    done: diff === 0,
  }
}

// Days, hours, minutes and seconds left until `iso`; updates every second while `active`.
export function useCountdown(iso, active = true) {
  const target = new Date(iso).getTime()
  const [time, setTime] = useState(() => remaining(target))

  useEffect(() => {
    if (!active) return
    const tick = () => setTime(remaining(target))
    // Catch up straight away after being paused, then every second.
    const first = setTimeout(tick, 0)
    const id = setInterval(tick, 1000)
    return () => {
      clearTimeout(first)
      clearInterval(id)
    }
  }, [target, active])

  return time
}
