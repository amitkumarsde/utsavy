const VARIANTS = {
  gold: 'bg-gold text-ink border-gold before:bg-ivory',
  ghost: 'bg-transparent text-current border-current/35 before:bg-current/10',
  ink: 'bg-ink text-ivory border-ink before:bg-maroon',
}

// Round button with a colour fill on hover. Becomes a link when `href` is given.
export default function Button({ href, variant = 'gold', icon: Icon, children, className = '', ...props }) {
  const classes = `group relative isolate inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full border px-6 py-3.5 text-[0.8rem] font-semibold tracking-[0.14em] uppercase transition-[color,transform] duration-500 ease-luxe active:scale-[0.97] disabled:pointer-events-none disabled:opacity-60 before:absolute before:inset-0 before:-z-10 before:translate-y-[101%] before:rounded-[inherit] before:transition-transform before:duration-500 before:ease-luxe hover:before:translate-y-0 ${VARIANTS[variant]} ${className}`

  const content = (
    <>
      <span className="relative">{children}</span>
      {Icon && (
        <Icon size={16} strokeWidth={1.8} className="relative transition-transform duration-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      )}
    </>
  )

  if (href) {
    const external = /^https?:/.test(href)
    return (
      <a href={href} className={classes} {...(external ? { target: '_blank', rel: 'noreferrer' } : {})} {...props}>
        {content}
      </a>
    )
  }
  return (
    <button type="button" className={classes} {...props}>
      {content}
    </button>
  )
}
