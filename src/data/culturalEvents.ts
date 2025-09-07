import { Event } from '../types';

export const culturalEvents: Omit<Event, 'id' | 'category'>[] = [
  {
    name: 'Eid al-Fitr',
    date: new Date('2025-03-30'),
    history: 'Festival marking the end of Ramadan, the holy month of fasting',
    origin: 'Arabian Peninsula, 7th century',
    religion: 'Islam',
    culture: 'Muslim communities worldwide',
    celebrationDetails: 'Special prayers, family gatherings, gift giving, charitable donations (Zakat al-Fitr)',
    icon: '🕌',
    type: 'religious'
  },
  {
    name: 'Eid al-Adha',
    date: new Date('2025-06-08'),
    history: 'Commemorates the willingness of Ibrahim to sacrifice his son as an act of obedience to God',
    origin: 'Arabian Peninsula, 7th century',
    religion: 'Islam',
    culture: 'Muslim communities worldwide',
    celebrationDetails: 'Sacrificial offerings, prayers, charity to the poor, family feasts',
    icon: '🕌',
    type: 'religious'
  },
  {
    name: 'Christmas',
    date: new Date('2025-12-25'),
    history: 'Celebration of the birth of Jesus Christ',
    origin: 'Palestine/Israel, 1st century',
    religion: 'Christianity',
    culture: 'Christian communities worldwide',
    celebrationDetails: 'Church services, family gatherings, gift exchange, Christmas tree decoration',
    icon: '✝️',
    type: 'religious'
  },
  {
    name: 'Diwali',
    date: new Date('2025-10-20'),
    history: 'Festival of lights celebrating the victory of light over darkness',
    origin: 'Indian subcontinent, ancient times',
    religion: 'Hinduism',
    culture: 'Indian and Hindu communities',
    celebrationDetails: 'Lighting diyas, fireworks, sweets, rangoli patterns, family prayers',
    icon: '🕉️',
    type: 'religious'
  },
  {
    name: 'Holi',
    date: new Date('2025-03-17'),
    history: 'Festival of colors celebrating the victory of good over evil and arrival of spring',
    origin: 'India, ancient times',
    religion: 'Hinduism',
    culture: 'Indian communities worldwide',
    celebrationDetails: 'Throwing colored powders, water fights, music, dancing, festive foods',
    icon: '🌈',
    type: 'religious'
  },
  {
    name: 'Chinese New Year',
    date: new Date('2025-01-29'),
    history: 'Traditional Chinese lunisolar new year celebration',
    origin: 'China, over 4000 years ago',
    religion: 'Traditional Chinese beliefs',
    culture: 'Chinese communities worldwide',
    celebrationDetails: 'Dragon dances, red envelopes, family reunions, fireworks, special foods',
    icon: '🏮',
    type: 'cultural'
  },
  {
    name: 'Hanukkah',
    date: new Date('2025-12-14'),
    history: 'Festival of lights commemorating the rededication of the Second Temple',
    origin: 'Jerusalem, 2nd century BCE',
    religion: 'Judaism',
    culture: 'Jewish communities worldwide',
    celebrationDetails: 'Lighting the menorah, playing dreidel, eating latkes, gift giving',
    icon: '✡️',
    type: 'religious'
  },
  {
    name: 'Thanksgiving',
    date: new Date('2025-11-27'),
    history: 'Day to give thanks for the harvest and blessings of the past year',
    origin: 'United States, 1621',
    religion: 'Secular',
    culture: 'American communities',
    celebrationDetails: 'Family feasts, turkey meals, parades, expressing gratitude',
    icon: '🦃',
    type: 'cultural'
  },
  {
    name: 'Ramadan',
    date: new Date('2025-03-01'),
    history: 'Month of fasting from dawn to sunset, spiritual reflection, prayer and charity',
    origin: 'Arabian Peninsula, 7th century',
    religion: 'Islam',
    culture: 'Muslim communities worldwide',
    celebrationDetails: 'Daily fasting, evening meals (Iftar), prayers, increased charity',
    icon: '🌙',
    type: 'religious'
  },
  {
    name: 'Muharram',
    date: new Date('2025-07-08'),
    history: 'First month of the Islamic calendar, observed with mourning in Shia communities',
    origin: 'Arabian Peninsula, 7th century',
    religion: 'Islam',
    culture: 'Muslim communities',
    celebrationDetails: 'Processions, recitation of historical events, reflection and prayers',
    icon: '🕋',
    type: 'religious'
  },
  {
    name: 'Basant',
    date: new Date('2025-02-15'),
    history: 'Spring festival celebrated with kite flying and music, especially in Lahore',
    origin: 'Pakistan, historical tradition',
    religion: 'Secular',
    culture: 'Pakistani, Punjabi communities',
    celebrationDetails: 'Flying kites, wearing yellow, music and social gatherings',
    icon: '🎏',
    type: 'cultural'
  },
  {
    name: 'Valentine’s Day',
    date: new Date('2025-02-14'),
    history: 'Day to celebrate love and affection between partners',
    origin: 'Roman Empire, 3rd century',
    religion: 'Secular',
    culture: 'Global',
    celebrationDetails: 'Exchanging cards, flowers, chocolates, romantic gestures',
    icon: '❤️',
    type: 'cultural'
  },
  {
    name: 'New Year’s Day',
    date: new Date('2025-01-01'),
    history: 'Marks the start of the new calendar year',
    origin: 'Ancient civilizations, globally recognized',
    religion: 'Secular',
    culture: 'Global',
    celebrationDetails: 'Fireworks, parties, resolutions, gatherings to welcome the new year',
    icon: '🎉',
    type: 'cultural'
  },
  {
    name: 'Easter',
    date: new Date('2025-04-20'),
    history: 'Celebration of the resurrection of Jesus Christ',
    origin: 'Palestine/Israel, 1st century',
    religion: 'Christianity',
    culture: 'Christian communities worldwide',
    celebrationDetails: 'Church services, egg hunts, family meals, festive decorations',
    icon: '🥚',
    type: 'religious'
  },
  {
    name: 'Independence Day (USA)',
    date: new Date('2025-07-04'),
    history: 'Commemorates the adoption of the Declaration of Independence in 1776',
    origin: 'United States, 1776',
    religion: 'Secular',
    culture: 'American',
    celebrationDetails: 'Fireworks, parades, patriotic displays, barbecues',
    icon: '🇺🇸',
    type: 'cultural'
  },
  {
    name: 'Diwali (Sikh celebration)',
    date: new Date('2025-11-01'),
    history: 'Marks the release of Guru Hargobind Ji from prison, celebrated by Sikhs',
    origin: 'India, 17th century',
    religion: 'Sikhism',
    culture: 'Sikh communities',
    celebrationDetails: 'Lighting lamps, prayers, family gatherings, sweets',
    icon: '🛕',
    type: 'religious'
  },
  {
    name: 'Onam',
    date: new Date('2025-09-05'),
    history: 'Harvest festival of Kerala, celebrating King Mahabali’s annual visit',
    origin: 'India, ancient times',
    religion: 'Hinduism',
    culture: 'Malayali communities',
    celebrationDetails: 'Boat races, flower carpets, traditional dances, feasts',
    icon: '🌾',
    type: 'cultural'
  },
  {
    name: 'Guru Nanak Jayanti',
    date: new Date('2025-11-15'),
    history: 'Birth anniversary of Guru Nanak, founder of Sikhism',
    origin: 'India, 15th century',
    religion: 'Sikhism',
    culture: 'Sikh communities worldwide',
    celebrationDetails: 'Processions, singing hymns, langar meals, prayers at gurdwaras',
    icon: '🕊️',
    type: 'religious'
  },
  {
    name: 'Lunar New Year (Vietnam - Tet)',
    date: new Date('2025-01-29'),
    history: 'Vietnamese New Year celebration based on lunar calendar',
    origin: 'Vietnam, ancient times',
    religion: 'Secular/Traditional',
    culture: 'Vietnamese communities',
    celebrationDetails: 'Family reunions, ancestral worship, festive foods, lucky money envelopes',
    icon: '🎊',
    type: 'cultural'
  },
  {
    name: 'Shab-e-Barat',
    date: new Date('2025-02-21'),
    history: 'Night of forgiveness, prayers and remembrance for Muslims',
    origin: 'Arabian Peninsula, 7th century',
    religion: 'Islam',
    culture: 'Muslim communities',
    celebrationDetails: 'Night prayers, visiting graves, seeking forgiveness, charitable acts',
    icon: '🌙',
    type: 'religious'
  }
];
