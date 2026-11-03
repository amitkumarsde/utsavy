import { motion } from 'framer-motion'
import { useCallback, useState } from 'react'
import { img, srcSet } from '../../lib/images'

// Responsive photo that fades in once loaded.
// `imgStyle` can take motion values, so parents can move or zoom the image.
export default function Picture({
  id,
  alt,
  sizes = '100vw',
  widths,
  priority = false,
  className = '',
  imgClassName = '',
  imgStyle,
  style,
}) {
  const [loaded, setLoaded] = useState(false)

  // Cached images may finish before onLoad is attached, so check on mount too.
  const onRef = useCallback((node) => {
    if (node?.complete && node.naturalWidth > 0) setLoaded(true)
  }, [])

  const positioned = /(^|\s)(absolute|fixed|sticky)(\s|$)/.test(className)

  return (
    <div className={`${positioned ? '' : 'relative'} overflow-hidden bg-night ${className}`} style={style}>
      <motion.img
        ref={onRef}
        src={img(id, 1200)}
        srcSet={srcSet(id, widths)}
        sizes={sizes}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        draggable={false}
        onLoad={() => setLoaded(true)}
        style={imgStyle}
        className={`h-full w-full object-cover transition-[opacity,filter,scale] duration-1200 ease-out ${
          loaded ? 'opacity-100 blur-0' : 'opacity-0 blur-lg'
        } ${imgClassName}`}
      />
    </div>
  )
}
