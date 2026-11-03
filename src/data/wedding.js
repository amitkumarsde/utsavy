// All text, dates, places and photos of the invite live here.
// Change this file to make the invite for another couple.

export const couple = {
  bride: {
    first: 'Ishaani',
    full: 'Ishaani Rathore',
    city: 'Jaipur',
    role: 'The Bride',
    bio: 'A conservation architect who restores 300-year-old havelis by day and sketches jharokhas on restaurant napkins by night.',
    facts: ['Collects antique brass keys', 'Chai: kadak, two sugars', 'Will out-dance everyone at the sangeet'],
  },
  groom: {
    first: 'Kabir',
    full: 'Kabir Malhotra',
    city: 'New Delhi',
    role: 'The Groom',
    bio: 'A water conservationist bringing Rajasthan’s forgotten stepwells back to life — and the only person who has ever made Ishaani late.',
    facts: ['Knows 40 baoris by name', 'Coffee, black, no apologies', 'Has rehearsed the first dance in secret'],
  },
  hashtag: '#KabirFoundHisIsh',
  monogram: 'I&K',
}

export const wedding = {
  // Time of the pheras (7:12 PM, India time)
  date: '2026-12-12T19:12:00+05:30',
  displayDate: 'Saturday, 12 December 2026',
  shortDate: '12 · 12 · 2026',
  city: 'Udaipur, Rajasthan',
  rsvpBy: '15 November 2026',
}

export const families = [
  {
    side: 'Bride’s family',
    lines: ['Granddaughter of Late Thakur Bhawani Singh Rathore', 'Daughter of'],
    parents: 'Smt. Shalini & Shri Vikram Singh Rathore',
    city: 'Civil Lines, Jaipur',
  },
  {
    side: 'Groom’s family',
    lines: ['Grandson of Smt. Kamla & Shri Om Prakash Malhotra', 'Son of'],
    parents: 'Smt. Ritu & Shri Arjun Malhotra',
    city: 'Vasant Vihar, New Delhi',
  },
]

export const invitationText =
  'With joy in our hearts and the blessings of our elders, we invite you to witness two families become one — as Ishaani and Kabir take their seven pheras on the shores of Lake Pichola, beneath a December moon.'

// Unsplash photo ids
export const images = {
  hero: 'photo-1770665567859-129bbd144038',
  couple: 'photo-1722952934661-dde241aeb591',
  diyas: 'photo-1783255166190-bee5e9e1294d',
}

export const story = [
  {
    year: '2019',
    chapter: 'I',
    title: 'The Wrong Umbrella',
    place: 'Marine Drive, Mumbai',
    image: 'photo-1642233803470-00129cdeba8f',
    text: 'A July downpour, one bus stop, two identical black umbrellas. Kabir walked away with hers. Ishaani ducked into a café to dry off — and found him there, holding it out, apologising in three languages.',
    frame: 'arch',
  },
  {
    year: '2021',
    chapter: 'II',
    title: 'Letters Across the Desert',
    place: 'Jaisalmer, Rajasthan',
    image: 'photo-1709620220232-12ecd7ca33a8',
    text: 'She was restoring a 12th-century haveli; he was mapping the desert’s dry stepwells. Two hundred kilometres apart, they wrote actual letters. He still keeps every one, pressed between field notes.',
    frame: 'circle',
  },
  {
    year: '2025',
    chapter: 'III',
    title: 'The Question',
    place: 'Sam Sand Dunes, under the stars',
    image: 'photo-1586612438666-ffd0ae97ad36',
    text: 'A moonless night, a sky full of stars, and a ring hidden inside a box of old brass keys. She said yes before he finished the sentence. He insists he had a whole speech.',
    frame: 'tall',
  },
  {
    year: '2026',
    chapter: 'IV',
    title: 'Forever, by the Lake',
    place: 'Udaipur, the City of Lakes',
    image: 'photo-1744385307864-50c38bbda91b',
    text: 'Now, with both our families, by the lake where the palace seems to float, we begin our forever. It would not be complete without you.',
    frame: 'arch',
  },
]

export const venues = {
  udaivilas: {
    id: 'udaivilas',
    name: 'The Oberoi Udaivilas',
    short: 'Udaivilas',
    address: 'Haridasji Ki Magri, Mulla Talai, Udaipur, Rajasthan 313001',
    query: 'The Oberoi Udaivilas, Udaipur',
    note: 'Main venue · Haldi & Shubh Vivah',
  },
  leela: {
    id: 'leela',
    name: 'The Leela Palace Udaipur',
    short: 'The Leela',
    address: 'Lake Pichola, Udaipur, Rajasthan 313001',
    query: 'The Leela Palace Udaipur',
    note: 'Mehendi · guest rooms reserved',
  },
  jagmandir: {
    id: 'jagmandir',
    name: 'Jagmandir Island Palace',
    short: 'Jagmandir',
    address: 'Lake Pichola, Udaipur, Rajasthan 313001',
    query: 'Jagmandir Island Palace, Udaipur',
    note: 'Sangeet · boats from Rameshwar Ghat',
  },
  citypalace: {
    id: 'citypalace',
    name: 'Manek Chowk, City Palace',
    short: 'City Palace',
    address: 'City Palace Complex, Old City, Udaipur, Rajasthan 313001',
    query: 'Manek Chowk, City Palace, Udaipur',
    note: 'Reception',
  },
}

export const events = [
  {
    id: 'mehendi',
    name: 'Mehendi',
    deva: 'मेहंदी',
    day: 'Thursday',
    date: '10 Dec',
    time: '3:00 PM onwards',
    start: '2026-12-10T15:00:00+05:30',
    end: '2026-12-10T20:00:00+05:30',
    venue: 'leela',
    spot: 'The Courtyard',
    description: 'Henna, ghazals and far too much chai. The darker the mehendi, the deeper the love — or so every aunty will remind you.',
    dress: 'Garden greens & rani pink',
    swatches: ['#5E8C61', '#CF3A78', '#F2D3C4'],
    accent: '#5E8C61',
    image: 'photo-1505932794465-147d1f1b2c97',
  },
  {
    id: 'haldi',
    name: 'Haldi',
    deva: 'हल्दी',
    day: 'Friday',
    date: '11 Dec',
    time: '10:00 AM',
    start: '2026-12-11T10:00:00+05:30',
    end: '2026-12-11T13:00:00+05:30',
    venue: 'udaivilas',
    spot: 'Lakeside Lawns',
    description: 'Turmeric, marigolds and a splash fight that the elders will swear they did not start. Wear something you won’t miss.',
    dress: 'Marigold yellow, nothing precious',
    swatches: ['#F3C440', '#EFA02F', '#FFF4D6'],
    accent: '#E3A21A',
    image: 'photo-1681717166573-f71589207785',
  },
  {
    id: 'sangeet',
    name: 'Sangeet',
    deva: 'संगीत',
    day: 'Friday',
    date: '11 Dec',
    time: '7:30 PM',
    start: '2026-12-11T19:30:00+05:30',
    end: '2026-12-12T00:30:00+05:30',
    venue: 'jagmandir',
    spot: 'Island Pavilion · boats from 7:00 PM',
    description: 'Two families, one stage, months of secret rehearsals. The Rathores vs. the Malhotras — the dance-off nobody will ever let go.',
    dress: 'Midnight jewel tones & sparkle',
    swatches: ['#2C1B5C', '#0F4F52', '#D6B370'],
    accent: '#6B4FB8',
    image: 'photo-1587012521796-6359d3678f2a',
  },
  {
    id: 'vivah',
    name: 'Shubh Vivah',
    deva: 'शुभ विवाह',
    day: 'Saturday',
    date: '12 Dec',
    time: 'Baraat 4:30 PM · Pheras 7:12 PM',
    start: '2026-12-12T16:30:00+05:30',
    end: '2026-12-12T23:00:00+05:30',
    venue: 'udaivilas',
    spot: 'The Lake Terrace',
    description: 'The baraat arrives along the water; seven pheras around the sacred fire at the auspicious muhurat, and a lifetime begins.',
    dress: 'Ivory, gold & heirloom traditional',
    swatches: ['#F5ECDD', '#D6B370', '#C8382B'],
    accent: '#C8382B',
    image: 'photo-1722953544597-57a8ba8eed44',
  },
  {
    id: 'reception',
    name: 'Reception',
    deva: 'स्वागत समारोह',
    day: 'Sunday',
    date: '13 Dec',
    time: '8:00 PM',
    start: '2026-12-13T20:00:00+05:30',
    end: '2026-12-14T00:30:00+05:30',
    venue: 'citypalace',
    spot: 'Manek Chowk',
    description: 'Dinner under the palace lights, fireworks over the old city, and a first dance the groom has been practising in secret.',
    dress: 'Black tie — Indian or Western',
    swatches: ['#111111', '#D6B370', '#5C1222'],
    accent: '#A9843F',
    image: 'photo-1792119743479-cdf5eba03367',
  },
]

export const gallery = [
  { id: 'photo-1722952934708-749c22eb2e58', caption: 'Under a canopy of a thousand lights', ratio: '2/3' },
  { id: 'photo-1621801306185-8c0ccf9c8eb8', caption: 'Mehendi, the night before', ratio: '3/2' },
  { id: 'photo-1699764681875-dd04ce36b1c3', caption: 'Twelve thousand marigolds, counted twice', ratio: '1/1' },
  { id: 'photo-1695956353120-54ce5e91632b', caption: 'The City Palace at golden hour', ratio: '4/5' },
  { id: 'photo-1542042161784-26ab9e041e89', caption: 'The ring from a box of brass keys', ratio: '3/4' },
  { id: 'photo-1772127822562-a898d9f5733c', caption: 'Where the pheras will happen', ratio: '3/4' },
  { id: 'photo-1722953544597-57a8ba8eed44', caption: 'Families, finally in one frame', ratio: '2/3' },
  { id: 'photo-1605292356183-a77d0a9c9d1d', caption: 'A diya for every blessing', ratio: '4/5' },
  { id: 'photo-1783188223242-07c15cabbf18', caption: 'The trousseau, among the bougainvillea', ratio: '2/3' },
  { id: 'photo-1764640848891-9b23d3632ccf', caption: 'Her initials hidden in the henna', ratio: '1/1' },
  { id: 'photo-1792119743130-d3dd094ff2d2', caption: 'The palace, lit for the reception', ratio: '3/4' },
  { id: 'photo-1722952934661-dde241aeb591', caption: 'Ishaani & Kabir', ratio: '2/3' },
]

export const travel = [
  { icon: 'plane', label: 'Maharana Pratap Airport (UDR)', detail: '35 min drive · we’ll pick you up' },
  { icon: 'train', label: 'Udaipur City Railway Station', detail: '20 min drive' },
  { icon: 'hotel', label: 'Rooms held at The Leela & Udaivilas', detail: 'Quote “Rathore–Malhotra Wedding”' },
  { icon: 'ship', label: 'Boats to Jagmandir', detail: 'Every 15 min from Rameshwar Ghat' },
]

export const blessingsSeed = [
  { name: 'Dadi Sa', relation: 'Bride’s grandmother', text: 'Sada suhagan raho, meri laado. May your home always smell of ghee and laughter.' },
  { name: 'Bua Ji', relation: 'Groom’s aunt', text: 'Kabir, finally someone who can make you reach on time. Ishaani beta, welcome home.' },
  { name: 'Aarav & Tara', relation: 'College friends', text: 'From the umbrella to the mandap — we called it in 2019. Love you both.' },
  { name: 'Nani', relation: 'Groom’s grandmother', text: 'Ek doosre ka haath kabhi mat chhodna. Jeete raho, khush raho.' },
  { name: 'Meher', relation: 'Bride’s best friend', text: 'You promised me the front row at the sangeet. I am holding you to it.' },
  { name: 'Uncle Raghav', relation: 'Family friend', text: 'Two of the kindest people I know. May every year be better than this one.' },
]

export const contacts = [
  { name: 'Rohan Rathore', relation: 'Brother of the bride', phone: '+91 98765 43210' },
  { name: 'Nisha Malhotra', relation: 'Sister of the groom', phone: '+91 91234 56789' },
]

// Menu links; `image` is the photo shown when a link is hovered
export const navLinks = [
  { id: 'invitation', label: 'Invitation', deva: 'निमंत्रण', image: 'photo-1699764681875-dd04ce36b1c3' },
  { id: 'couple', label: 'The Couple', deva: 'जोड़ी', image: 'photo-1722952934661-dde241aeb591' },
  { id: 'story', label: 'Our Story', deva: 'कहानी', image: 'photo-1709620220232-12ecd7ca33a8' },
  { id: 'countdown', label: 'Countdown', deva: 'उलटी गिनती', image: 'photo-1605292356183-a77d0a9c9d1d' },
  { id: 'events', label: 'Celebrations', deva: 'उत्सव', image: 'photo-1681717166573-f71589207785' },
  { id: 'gallery', label: 'Gallery', deva: 'झलकियाँ', image: 'photo-1722952934708-749c22eb2e58' },
  { id: 'venue', label: 'Venue', deva: 'स्थान', image: 'photo-1744385307864-50c38bbda91b' },
  { id: 'rsvp', label: 'RSVP', deva: 'उत्तर', image: 'photo-1621801306185-8c0ccf9c8eb8' },
  { id: 'blessings', label: 'Blessings', deva: 'आशीर्वाद', image: 'photo-1783255166190-bee5e9e1294d' },
]
