// Endless sliding row. Content is copied `repeat` times so short rows
// still fill wide screens, then the whole set is doubled for a seamless loop.
export default function Marquee({ children, duration = 40, reverse = false, repeat = 1, className = '' }) {
  const set = Array.from({ length: repeat }, (_, i) => (
    <div key={i} className="flex shrink-0 items-center">
      {children}
    </div>
  ))

  return (
    <div className={`marquee flex overflow-hidden ${className}`}>
      <div className={`marquee-track flex w-max shrink-0 ${reverse ? 'reverse' : ''}`} style={{ '--marquee-duration': `${duration}s` }}>
        <div className="flex shrink-0">{set}</div>
        <div className="flex shrink-0" aria-hidden="true">
          {set}
        </div>
      </div>
    </div>
  )
}
