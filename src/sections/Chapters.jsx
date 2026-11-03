import Invitation from './Invitation'
import Couple from './Couple'
import Story from './Story'
import Countdown from './Countdown'
import Events from './Events'
import Gallery from './Gallery'
import Venue from './Venue'
import Rsvp from './Rsvp'
import Blessings from './Blessings'
import Footer from './Footer'

// Every section below the hero. Loaded as a separate file while the doors are still closed.
export default function Chapters() {
  return (
    <>
      <Invitation />
      <Couple />
      <Story />
      <Countdown />
      <Events />
      <Gallery />
      <Venue />
      <Rsvp />
      <Blessings />
      <Footer />
    </>
  )
}
