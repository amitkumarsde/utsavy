# How I Built This Page

This file explains, step by step, how I planned and built the wedding invitation page for Utsavy, so anyone can follow the code easily.

---

## 1. The Idea

- I wanted the invite to feel like a real evening at a Udaipur palace, not a template.
- I named the theme **"Ek Raat, Udaipur Mein"** (One Night in Udaipur).
- The guest first sees closed palace doors, opens them, and then scrolls through the wedding like a story.
- I picked a dark night look with gold, marigold and sindoor red, and used ivory "paper" sections in between so the page has a rhythm of dark and light.

**Colours**

| Name     | Colour    | Used for                     |
| -------- | --------- | ---------------------------- |
| Ink      | `#0E0A0C` | Main dark background         |
| Wine     | `#2E0911` | Couple and RSVP sections     |
| Maroon   | `#5C1222` | Countdown, buttons           |
| Sindoor  | `#C8382B` | Highlights                   |
| Marigold | `#EFA02F` | Accent words, petals         |
| Gold     | `#D6B370` | Lines, labels, frames        |
| Paper    | `#EFE4D0` | Light sections               |

**Fonts**

- **Bodoni Moda** – big headings and names
- **Instrument Serif** (italic) – special words
- **Manrope** – small labels and normal text
- **Tiro Devanagari Hindi** – Hindi lines like "शुभ विवाह"

---

## 2. Tools I Used

- **React 19 + Vite** – to build the page and run it locally
- **Tailwind CSS v4** – for all styling
- **Framer Motion** – for animations and scroll effects
- **Lenis** – for smooth scrolling
- **Lucide** – for icons
- **Unsplash** – for photos
- **Google Maps embed** – for venue maps (no API key needed)
- **Web Audio API** – to create the tanpura music in the browser

---

## 3. Setting Up

I started from the Vite React template, then added the libraries:

```bash
npm create vite@latest utsavy -- --template react
```

```bash
npm install framer-motion lenis lucide-react
```

```bash
npm install -D tailwindcss @tailwindcss/vite
```

- I added the Tailwind plugin in `vite.config.js`.
- I added the fonts in `index.html`.
- I put my colours and fonts in the `@theme` block at the top of `src/index.css`, so I can use classes like `bg-ink` and `text-gold` everywhere.

To run it:

```bash
npm run dev
```

To make the final build:

```bash
npm run build
```

---

## 4. How I Organised the Code

```
src/
├── App.jsx             # Shows the doors first, then the page
├── data/wedding.js     # All text, dates, venues and photos
├── sections/           # One file for each part of the page
├── components/
│   ├── layout/         # Top bar and menu
│   ├── providers/      # Smooth scroll, music, pop-up messages
│   └── ui/             # Small reusable parts
├── hooks/              # Countdown and screen-size helpers
├── context/            # Shared state
└── lib/                # Calendar, images, storage, music helpers
```

- **All content lives in one file:** `src/data/wedding.js`. Names, families, story, events, venues, photos and blessings are all there. To make the invite for another couple, only this file needs to change.
- **One file per section**, so each part of the page is easy to find.
- **Small reusable parts** (Button, Picture, RevealText, Marquee, SectionHeading) so I did not repeat the same code.

---

## 5. How I Built Each Section

### Opening Doors (`Gateway.jsx`)
- Two door panels, each half the screen, with a lattice (jaali) pattern drawn in SVG.
- A marigold garland (toran) on top and a red wax seal with the couple's initials.
- On tap, both doors rotate open in 3D, light spills through the middle and petals fall.
- Guests can choose "Open the doors" (with music) or "Enter without music".
- I remember that the doors were opened (for that tab), so a reload goes straight to the page. Adding `?intro` to the URL shows them again.

### Hero (`Hero.jsx`)
- The names "Ishaani" and "Kabir" are very large and overlap a palace-arch window showing Lake Pichola.
- The arch shape is one SVG path that I reuse across the page with the `.arch` class.
- Letters slide up one by one, and petals fall on a canvas (`Petals.jsx`).
- When scrolling, the arch grows, the names move apart and everything fades out.

### Invitation (`Invitation.jsx`)
- Starts with "॥ श्री गणेशाय नमः ॥" and a lotus.
- The invite text starts light and each word turns dark as you scroll past it.
- Both families are shown on two sides, with a round date badge whose text ring turns on scroll.

### The Couple (`Couple.jsx`)
- One portrait inside an arch, with a slowly turning mandala behind it.
- The bride is on one side and the groom on the other, each with a short bio and fun facts.

### Our Story (`Story.jsx`)
- On desktop, the section stays fixed while four chapters slide sideways as you scroll down.
- A red-gold thread draws itself through all the chapters.
- On mobile, it changes to a simple vertical timeline, because sideways scrolling is hard on a phone.

### Countdown (`Countdown.jsx`)
- Shows days, hours, minutes and seconds until the pheras, updating every second (`useCountdown.js`).
- Each number rolls down when it changes.
- Buttons to add the wedding to Google Calendar or download all events as an `.ics` file (`lib/calendar.js`).

### Events (`Events.jsx`)
- Instead of cards, I made a big list of event names, each with its own colour.
- On desktop, a photo of the event follows the mouse while you hover a name.
- Tapping a name opens its details: description, time, venue, dress code colours, directions and add to calendar.

### Gallery (`Gallery.jsx`)
- Photos are placed in columns that move at different speeds while scrolling.
- A sliding banner with the names and date sits on top.
- Tapping a photo opens a full-screen viewer with arrows, swipe, keyboard keys and thumbnails.

### Venue (`Venue.jsx`)
- Buttons to switch between the four venues.
- Each venue shows its own Google Map inside an arch frame.
- Buttons for directions, copying the address and opening Google Maps, plus travel tips.

### RSVP (`Rsvp.jsx`)
- Choose "Joyfully accept" or "Regretfully decline".
- Fields for name and phone (with checks), number of guests, events, meal choice and airport pickup.
- After sending, a thank-you card shows with a WhatsApp share button.
- The answer is saved in the browser, so the guest sees it again when they come back.

### Blessings (`Blessings.jsx`)
- Guests can tap a clay diya to light it, and a counter goes up.
- Guests can write a blessing; it joins two moving rows of blessing cards.

### Closing (`Footer.jsx`)
- A short thank-you message, the couple's names in large shining gold, family contacts, the hashtag (tap to copy) and a back-to-top button.

### Top Bar and Menu (`Nav.jsx`)
- Logo, music on/off button, RSVP button and menu button.
- The bar hides when scrolling down and comes back when scrolling up.
- The menu opens full screen with all sections and a photo preview for each link.

---

## 6. Extra Touches

- **Smooth scrolling** with Lenis (`SmoothScroll.jsx`).
- **Custom cursor** on desktop that grows over buttons and shows small words like "View" or "Open" (`Cursor.jsx`).
- **Tanpura music** made with code, so there is no audio file (`lib/tanpura.js`).
- **Film grain** texture over the page for a printed, photographic feel.
- **Scroll progress line** at the very top of the screen.
- **Faster first load:** everything below the hero loads as a separate file (`Chapters.jsx`) while the doors are still closed.
- **Reduce motion:** if a guest has "reduce motion" turned on, smooth scrolling and heavy animations are turned off.

---

## 7. How I Used AI

I used AI only for two things:

**1. Finding resources**
- Searching Unsplash for Udaipur and Indian wedding photos.
- Checking how Framer Motion, Lenis, Tailwind v4 and the Web Audio API work.

**2. Complex tasks**
- The maths for the scroll effects, like the sideways story and the moving gallery columns.
- Creating the tanpura sound with code.
- Reviewing the full code to find bugs, unused code and accessibility problems.

The idea, theme, content, colours, layout and final checks were done by me. I read and tested every change before keeping it.

---

## 8. How I Tested It

- Checked the page on desktop (1440 px wide) and on a phone size (375 px wide).
- Clicked every button and link: doors, menu, events, gallery, venue maps, RSVP, diya and blessings.
- Ran the code checker and the final build:

```bash
npm run lint
```

```bash
npm run build
```

---

## 9. Putting It Live

The page is ready for Vercel. I push the code to GitHub, import the repo in Vercel and click **Deploy**. Or from the terminal:

---