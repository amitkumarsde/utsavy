// Small text helpers built from the wedding data, so components never hard-code names or dates.
import { couple, events, wedding } from '../data/wedding'

const WORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve']

// 5 → "five" (falls back to digits above twelve)
export const numberWord = (n) => WORDS[n] ?? String(n)

export const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1)

// Year of the wedding, e.g. 2026
export const weddingYear = new Date(wedding.date).getFullYear()

// 2026 → "MMXXVI"
export function toRoman(n) {
  const table = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
    [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ]
  let out = ''
  for (const [value, letters] of table) {
    while (n >= value) {
      out += letters
      n -= value
    }
  }
  return out
}

// Number of different days the events fall on
export const eventDays = new Set(events.map((e) => e.start.slice(0, 10))).size

// "Ishaani & Kabir"
export const coupleNames = `${couple.bride.first} & ${couple.groom.first}`

// "ishaani-kabir": used for saved data keys and file names
export const slug = `${couple.bride.first}-${couple.groom.first}`.toLowerCase()
