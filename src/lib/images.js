// Builds Unsplash image links at the size we need.
const CDN = 'https://images.unsplash.com/'

export function img(id, width = 1200, quality = 72) {
  return `${CDN}${id}?auto=format&fit=crop&w=${width}&q=${quality}`
}

export function srcSet(id, widths = [480, 800, 1200, 1600]) {
  return widths.map((w) => `${img(id, w)} ${w}w`).join(', ')
}

// Hero photo sizes. index.html preloads the same set (see vite.config.js), so keep them in one place.
export const HERO_SIZES = '(min-width: 1024px) 30vw, 70vw'
export const HERO_WIDTHS = [600, 900, 1300, 1800]

// Link-preview image (1200 × 630) for WhatsApp, Facebook and others.
export const shareImage = (id) => `${CDN}${id}?auto=format&fit=crop&w=1200&h=630&q=75`
