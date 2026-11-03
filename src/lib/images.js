// Builds Unsplash image links at the size we need.
const CDN = 'https://images.unsplash.com/'

export function img(id, width = 1200, quality = 72) {
  return `${CDN}${id}?auto=format&fit=crop&w=${width}&q=${quality}`
}

export function srcSet(id, widths = [480, 800, 1200, 1600]) {
  return widths.map((w) => `${img(id, w)} ${w}w`).join(', ')
}
