# Wedding Invitation Page

A one-page, animated wedding invitation website made for **[Utsavy](https://www.utsavy.in/)**.
The theme is *"Ek Raat, Udaipur Mein"* (One Night in Udaipur): palace doors, marigolds, diyas and gold on a dark night sky.

> To see how this page was planned and built, step by step, read **[DEVELOPMENT.md](DEVELOPMENT.md)**.

---

## Features

- **Opening doors** – Carved palace doors swing open in 3D. Guests can enter with or without music.
- **Hero** – The couple's names around an arched window onto Lake Pichola, with falling petals.
- **Invitation** – The invite text darkens word by word as you scroll, plus both family names.
- **The Couple** – Short intro of the bride and the groom around one portrait.
- **Our Story** – Four chapters that slide sideways on desktop, shown as a timeline on mobile.
- **Countdown** – Live days, hours, minutes and seconds until the wedding.
- **Events** – Mehendi, Haldi, Sangeet, Shubh Vivah and Reception with date, time, venue and dress code.
- **Calendar** – Add one event to Google Calendar, or download all events as an `.ics` file.
- **Gallery** – Photos in moving columns, with a full-screen viewer (swipe, arrows, keyboard).
- **Venue** – Google Map for each venue, plus directions, copy address and travel tips.
- **RSVP** – Form with checks for name and phone, guest count, events, meal choice and a thank-you card.
- **Blessings** – Light a diya and leave a blessing on a moving wall.
- **Music** – A tanpura drone made in the browser, with an on/off button. No audio files are used.
- **Works everywhere** – Built for phones and desktops, keyboard friendly, and calmer for people who turn on "reduce motion".

---

## Tech Stack

- **React 19** – UI
- **Vite** – dev server and build
- **Tailwind CSS v4** – styling
- **Framer Motion** – animations
- **Lenis** – smooth scrolling
- **Lucide** – icons
- **Unsplash** – photos (loaded from their image servers)
- **Google Fonts** – Bodoni Moda, Instrument Serif, Manrope, Tiro Devanagari Hindi

---

## Quick Start

You need **Node.js 20.19 or newer** (or 22.12+).

```bash
npm install
```

```bash
npm run dev
```

Then open **http://localhost:5173**.

- The opening doors show once per browser tab.
- Add `?intro` to the URL to see them again: `http://localhost:5173/?intro`

---

## Scripts

| Command           | What it does                                  |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Start the local dev server with live reload   |
| `npm run build`   | Make the production build in the `dist` folder |
| `npm run preview` | Run the production build locally              |
| `npm run lint`    | Check the code for mistakes with ESLint       |

---

## Project Structure

```
utsavy/
├── index.html              # Page shell, fonts, SEO and share tags
├── public/favicon.svg      # Site icon
├── vercel.json             # Vercel settings (caching for built files)
└── src/
    ├── main.jsx            # Starts React
    ├── App.jsx             # Page layout and the opening-doors flow
    ├── index.css           # Colours, fonts and shared styles
    ├── data/wedding.js     # ALL text, dates, venues and photos
    ├── sections/           # One file per page section (Hero, Events, RSVP...)
    ├── components/
    │   ├── layout/         # Top bar and full-screen menu
    │   ├── providers/      # Smooth scroll, music and pop-up messages
    │   └── ui/             # Small reusable parts (Button, Picture, Marquee...)
    ├── hooks/              # Countdown and screen-size helpers
    ├── context/            # Shared state used across components
    └── lib/                # Calendar, image links, storage and music helpers
```

---

## Make It Your Own

- Open `src/data/wedding.js`.
- Change names, families, dates, story, events, venues, photos and blessings.
- No component code needs to change.
- Colours and fonts live at the top of `src/index.css`.

---

## Good to Know

- **RSVPs, diyas and blessings are saved only in the guest's own browser.** There is no server yet. The RSVP send step in `src/sections/Rsvp.jsx` is the one place to connect a real API.
- Photos load from Unsplash, so an internet connection is needed.
- Music starts only after a tap, because browsers block sound that plays by itself.
- The couple, families and story are made up for this demo.

---

## Credits

- Photos from [Unsplash](https://unsplash.com/)
- Icons from [Lucide](https://lucide.dev/)
- Built for [Utsavy](https://www.utsavy.in/)

---