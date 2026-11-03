// Hand-made SVG shapes (arches, lotus, mandala...) that give the invite its Rajasthani look.

// Pointed palace-arch shape, drawn in a 0–1 box so it can stretch to any size.
const ARCH_PATH =
  'M0,1 V0.36 C0,0.17 0.2,0.105 0.36,0.062 C0.44,0.04 0.475,0.022 0.5,0 C0.525,0.022 0.56,0.04 0.64,0.062 C0.8,0.105 1,0.17 1,0.36 V1 Z'

const ARCH_PATH_100 = ARCH_PATH.replace(/-?\d*\.?\d+/g, (n) => String(+(Number(n) * 100).toFixed(2)))

// Arch clip shape used by the `.arch` CSS class. Render once per page.
export function SvgDefs() {
  return (
    <svg width="0" height="0" aria-hidden="true" className="absolute">
      <defs>
        <clipPath id="arch-ogee" clipPathUnits="objectBoundingBox">
          <path d={ARCH_PATH} />
        </clipPath>
      </defs>
    </svg>
  )
}

// Thin gold arch outline that stretches over any box.
export function ArchOutline({ className = '', strokeWidth = 1 }) {
  return (
    <svg
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`pointer-events-none absolute overflow-visible ${className}`}
    >
      <path
        d={ARCH_PATH_100}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  )
}

export function Sparkle({ className = '', size = 14 }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" className={className}>
      <path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" fill="currentColor" />
    </svg>
  )
}

export function Lotus({ className = '', size = 40 }) {
  return (
    <svg viewBox="0 0 64 40" width={size} height={(size * 40) / 64} aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.1">
      <path d="M32 36C26 28 26 14 32 3c6 11 6 25 0 33Z" />
      <path d="M31 36c-8-3-14-12-15-24 9 3 15 12 15 24Z" />
      <path d="M33 36c8-3 14-12 15-24-9 3-15 12-15 24Z" />
      <path d="M30 37C20 37 10 31 4 22c10-1 20 5 26 15Z" />
      <path d="M34 37c10 0 20-6 26-15-10-1-20 5-26 15Z" />
      <path d="M14 38h36" strokeLinecap="round" />
    </svg>
  )
}

export function Divider({ className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-linear-to-r from-transparent to-current opacity-60" />
      <Sparkle size={10} />
      <span className="size-1.5 rotate-45 border border-current" />
      <Sparkle size={10} />
      <span className="h-px flex-1 bg-linear-to-l from-transparent to-current opacity-60" />
    </div>
  )
}

// Mandala made of rings of repeated petals and dots.
export function Mandala({ className = '' }) {
  const ring = (count, radius, render) =>
    Array.from({ length: count }, (_, i) => (
      <g key={i} transform={`rotate(${(360 / count) * i} 200 200)`}>
        {render(radius)}
      </g>
    ))

  return (
    <svg viewBox="0 0 400 400" aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="0.7">
      <circle cx="200" cy="200" r="196" />
      <circle cx="200" cy="200" r="188" strokeDasharray="1 5" />
      {ring(48, 186, (r) => <path d={`M200 ${200 - r} q6 14 0 26 q-6 -12 0 -26Z`} />)}
      <circle cx="200" cy="200" r="156" />
      {ring(32, 154, (r) => <path d={`M200 ${200 - r} C214 ${220 - r} 214 ${236 - r} 200 ${250 - r} C186 ${236 - r} 186 ${220 - r} 200 ${200 - r}Z`} />)}
      {ring(32, 150, (r) => <circle cx="200" cy={200 - r + 58} r="1.6" fill="currentColor" />)}
      <circle cx="200" cy="200" r="100" />
      {ring(16, 98, (r) => <path d={`M200 ${200 - r} C226 ${230 - r} 222 ${262 - r} 200 ${280 - r} C178 ${262 - r} 174 ${230 - r} 200 ${200 - r}Z`} />)}
      {ring(16, 98, (r) => <path d={`M200 ${210 - r} C212 ${232 - r} 210 ${252 - r} 200 ${264 - r}`} />)}
      <circle cx="200" cy="200" r="22" />
      {ring(12, 22, (r) => <circle cx="200" cy={200 - r} r="4" />)}
      <circle cx="200" cy="200" r="6" fill="currentColor" />
    </svg>
  )
}

// Repeating lattice (jaali) pattern for the opening doors.
export function JaaliPattern({ id = 'jaali' }) {
  return (
    <pattern id={id} width="44" height="44" patternUnits="userSpaceOnUse">
      <path d="M22 2 L42 22 L22 42 L2 22 Z" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.7" />
      <circle cx="22" cy="22" r="5" fill="none" stroke="currentColor" strokeWidth="0.8" opacity="0.8" />
      <circle cx="22" cy="22" r="1.6" fill="currentColor" />
      <circle cx="0" cy="0" r="2.2" fill="currentColor" opacity="0.9" />
      <circle cx="44" cy="0" r="2.2" fill="currentColor" opacity="0.9" />
      <circle cx="0" cy="44" r="2.2" fill="currentColor" opacity="0.9" />
      <circle cx="44" cy="44" r="2.2" fill="currentColor" opacity="0.9" />
    </pattern>
  )
}

// Row of small arches that overlaps the section above, like a palace roofline.
export function ArchEdge({ className = '', color = 'var(--color-paper)' }) {
  const count = 14
  const w = 100 / count
  const d =
    `M0 40 ` +
    Array.from({ length: count }, (_, i) => {
      const x = i * w
      return `L${x} 40 L${x} 22 Q${x} 8 ${x + w / 2} 2 Q${x + w} 8 ${x + w} 22`
    }).join(' ') +
    ` L100 40 Z`
  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" aria-hidden="true" className={`block h-[3.2vw] min-h-6 w-full ${className}`}>
      <path d={d} fill={color} />
    </svg>
  )
}
