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
    name: 'Pakistan Independence Day',
    date: new Date('2025-08-14'),
    history: 'Celebration of Pakistan\'s independence from British rule',
    origin: 'Pakistan, 1947',
    religion: 'Secular',
    culture: 'Pakistani',
    celebrationDetails: 'Flag hoisting, parades, cultural performances, national songs',
    icon: '🇵🇰',
    type: 'cultural'
  }
];