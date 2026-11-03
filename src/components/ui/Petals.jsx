import { useEffect, useRef } from 'react'

const PALETTE = [
  ['#F3C440', '#E08A12'],
  ['#EFA02F', '#C2410C'],
  ['#F7D774', '#EFA02F'],
  ['#E86A5B', '#A3122A'],
  ['#F5ECDD', '#D6B370'],
]

function makePetal(width, height, fromTop) {
  const [light, dark] = PALETTE[Math.floor(Math.random() * PALETTE.length)]
  return {
    x: Math.random() * width,
    y: fromTop ? -20 - Math.random() * height * 0.3 : Math.random() * height,
    size: 5 + Math.random() * 9,
    speed: 0.35 + Math.random() * 0.8,
    drift: Math.random() * Math.PI * 2,
    sway: 0.4 + Math.random() * 1.1,
    rotation: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.04,
    flip: Math.random() * Math.PI * 2,
    once: false,
    light,
    dark,
  }
}

// Falling marigold petals drawn on a canvas. Pauses when off screen.
// Changing `burst` adds one quick extra shower (used when the doors open).
export default function Petals({ count = 34, className = '', burst = 0 }) {
  const canvasRef = useRef(null)
  const petals = useRef([])
  const size = useRef({ w: 0, h: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    let visible = true
    let running = false

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const { width, height } = canvas.getBoundingClientRect()
      const prev = size.current
      // Keep petals spread evenly when the screen size changes.
      for (const p of petals.current) {
        p.x = prev.w > 40 ? (p.x / prev.w) * width : Math.random() * width
        if (prev.h < 40) p.y = Math.random() * height
      }
      size.current = { w: width, h: height }
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (!petals.current.length) {
        const n = width < 640 ? Math.round(count * 0.55) : count
        petals.current = Array.from({ length: n }, () => makePetal(width, height, false))
      }
    }

    const draw = () => {
      const { w, h } = size.current
      ctx.clearRect(0, 0, w, h)
      for (const p of petals.current) {
        p.y += p.speed
        p.drift += 0.012
        p.x += Math.sin(p.drift) * p.sway * 0.6
        p.rotation += p.spin
        p.flip += 0.03
        // Normal petals restart at the top; burst petals are dropped.
        if (p.y > h + 30 && !p.once) Object.assign(p, makePetal(w, h, true))

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.scale(1, Math.abs(Math.cos(p.flip)) * 0.7 + 0.3)
        const g = ctx.createLinearGradient(-p.size, 0, p.size, 0)
        g.addColorStop(0, p.light)
        g.addColorStop(1, p.dark)
        ctx.fillStyle = g
        ctx.globalAlpha = 0.85
        ctx.beginPath()
        ctx.moveTo(0, -p.size)
        ctx.bezierCurveTo(p.size * 0.9, -p.size * 0.6, p.size * 0.7, p.size * 0.7, 0, p.size)
        ctx.bezierCurveTo(-p.size * 0.7, p.size * 0.7, -p.size * 0.9, -p.size * 0.6, 0, -p.size)
        ctx.fill()
        ctx.restore()
      }
      petals.current = petals.current.filter((p) => !(p.once && p.y > h + 30))
      frame = requestAnimationFrame(draw)
    }

    const play = () => {
      if (running || !visible) return
      running = true
      frame = requestAnimationFrame(draw)
    }
    const pause = () => {
      running = false
      cancelAnimationFrame(frame)
    }

    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) play()
      else pause()
    })
    io.observe(canvas)
    play()

    return () => {
      pause()
      ro.disconnect()
      io.disconnect()
    }
  }, [count])

  useEffect(() => {
    if (!burst) return
    const { w, h } = size.current
    const extra = Array.from({ length: w < 640 ? 24 : 48 }, () => ({ ...makePetal(w, h, true), once: true }))
    for (const p of extra) p.speed *= 2.2
    petals.current = [...petals.current, ...extra]
  }, [burst])

  return <canvas ref={canvasRef} aria-hidden="true" className={`pointer-events-none ${className}`} />
}
