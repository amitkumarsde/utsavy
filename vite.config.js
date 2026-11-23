import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import { images, meta } from './src/data/wedding.js'
import { HERO_SIZES, HERO_WIDTHS, shareImage, srcSet } from './src/lib/images.js'

// Fills the {{...}} placeholders in index.html (title, link-preview text, hero preload)
// from src/data/wedding.js, so the couple's details live in one file only.
function inviteHtml() {
  const values = {
    ...meta,
    shareImage: shareImage(images.couple),
    heroSrcSet: srcSet(images.hero, HERO_WIDTHS),
    heroSizes: HERO_SIZES,
  }
  const escape = (text) => String(text).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  return {
    name: 'invite-html',
    transformIndexHtml(html) {
      return html.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        if (!(key in values)) throw new Error(`index.html: no value for ${match}`)
        return escape(values[key])
      })
    },
  }
}

// Vite setup: React, the Tailwind CSS plugin and the index.html filler.
export default defineConfig({
  plugins: [react(), tailwindcss(), inviteHtml()],
})
