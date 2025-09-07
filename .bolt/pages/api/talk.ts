// File: pages/api/talk.ts
// A rule-based cultural-events responder (no external API keys).
// Returns { reply: string, language: "en" | "ur", event?: string, date?: string }
// Frontend can use `reply` and `language` to display and to do browser TTS (set utterance.lang accordingly).

import { NextApiRequest, NextApiResponse } from "next";

/**
 * Knowledge base: each event has:
 *  - description (English)
 *  - description_ur (Urdu)
 *  - date (human-friendly string; note many religious holidays vary by lunar calendar)
 *  - aliases: array of keywords (english/urdu) that may appear in user queries
 */
const KB: Record<
  string,
  {
    description: string;
    description_ur: string;
    date: string;
    aliases: string[];
  }
> = {
  eid: {
    description:
      "Eid al-Fitr is celebrated at the end of Ramadan with communal prayers, large shared meals, visiting family and friends, and giving to those in need. Eid al-Adha commemorates willingness to sacrifice and includes special prayers, sharing meat with family and the poor, and charitable acts.",
    description_ur:
      "عید الفطر رمضان کے اختتام پر منائی جاتی ہے — اجتماعی نمازیں، لذیذ کھانے، خاندان اور دوستوں سے ملاقات، اور مستحقین کی مدد۔ عید الاضحی قربانی کا دن ہے جس میں قربانی، نمازیں اور صدقہ شامل ہیں۔",
    date: "Dates change each year (Islamic lunar calendar).",
    aliases: ["eid", "eid al-fitr", "eid al adha", "عید", "عید الفطر", "عید الاضحی"],
  },

  ramadan: {
    description:
      "Ramadan is a month of fasting from dawn to sunset for Muslims, focusing on prayer, reflection, and charity.",
    description_ur:
      "رمضان روزہ رکھنے کا مہینہ ہے — سحر سے مغرب تک روزہ، زیادہ عبادت، اور صدقات کی حوصلہ افزائی۔",
    date: "Dates change each year (Islamic lunar calendar).",
    aliases: ["ramadan", "رمضان"],
  },

  muharram: {
    description:
      "Muharram is the first month of the Islamic calendar. For many Muslims, especially Shia communities, it is a time of mourning (especially on the 10th, Ashura) and remembrance.",
    description_ur:
      "محرم اسلامی سال کا پہلا مہینہ ہے۔ بعض مسلم عقائد میں خاص طور پر عاشورہ (دسویں محرم) ایک غم و یاد کا دن ہوتا ہے۔",
    date: "Dates change each year (Islamic lunar calendar).",
    aliases: ["muharram", "محرم", "ashura", "عاشورہ"],
  },

  basant: {
    description:
      "Basant is a spring festival traditionally celebrated with kite flying, music, and yellow clothing (in parts of South Asia, notably Lahore).",
    description_ur:
      "بسنت بہار کا تہوار ہے، خاص طور پر لاہور میں، جس میں پتنگ بازی، موسیقی، اور زرد رنگ کے کپڑے مقبول ہوتے ہیں۔",
    date: "Usually in February – date may vary regionally.",
    aliases: ["basant", "بسنت"],
  },

  holi: {
    description:
      "Holi is the Festival of Colors, celebrated by throwing colored powders and water, singing, dancing, and welcoming spring.",
    description_ur:
      "ہولی رنگوں کا تہوار ہے — لوگ رنگ پھینکتے ہیں، گاتے، ناچتے اور بہار کا استقبال کرتے ہیں۔",
    date: "Date changes each year (March, Hindu lunar calendar).",
    aliases: ["holi", "ہولی"],
  },

  diwali: {
    description:
      "Diwali, the Festival of Lights, involves lighting lamps and candles, sharing sweets, decorating homes, and fireworks to celebrate the victory of light over darkness.",
    description_ur:
      "دیاوالی یا دیپاؤلی روشنیوں کا تہوار ہے — گھر جلانے، مٹھائیاں بانٹنے، اور آتش بازی کے ساتھ منایا جاتا ہے۔",
    date: "Date changes each year (October–November, Hindu lunar calendar).",
    aliases: ["diwali", "divali", "دیوالی", "دیپاولی"],
  },

  christmas: {
    description:
      "Christmas celebrates the birth of Jesus Christ. Traditions include decorating trees, exchanging gifts, church services, and family meals on December 25th.",
    description_ur:
      "کرسمس یسوع مسیح کی ولادت کا تہوار ہے۔ 25 دسمبر کو کرسمس ٹری، تحائف، چرچ سروسز اور خاندانی کھانے عام ہیں۔",
    date: "December 25th every year.",
    aliases: ["christmas", "کرسمس"],
  },

  "chinese new year": {
    description:
      "Chinese New Year marks the start of the lunar new year with family reunions, feasts, red envelopes, lanterns, dragon dances and fireworks.",
    description_ur:
      "چینی نوی سال قمری کیلنڈر کے آغاز پر منایا جاتا ہے — خاندانی اجتماعات، میلوں، لال لِفافے، ڈریگن ڈانس اور آتش بازی شامل ہیں۔",
    date: "Date changes each year (January–February, lunar calendar).",
    aliases: ["chinese new year", "lunar new year", "چینی نیا سال"],
  },

  hanukkah: {
    description:
      "Hanukkah is the Jewish Festival of Lights lasting eight nights, celebrated with menorah lighting, games, and traditional foods.",
    description_ur:
      "حنوکا روشنیوں کا یہودی تہوار ہے جو آٹھ راتیں چلتا ہے — منو رہ جلانا، کھیل اور روایتی کھانوں کا اہتمام ہوتا ہے۔",
    date: "Date changes each year (Jewish lunar calendar, usually December).",
    aliases: ["hanukkah", "حنوکا", "hanukah"],
  },

  thanksgiving: {
    description:
      "Thanksgiving is a day for giving thanks, usually celebrated in the U.S. with a family meal often centered on turkey.",
    description_ur:
      "تھینکس گیونگ شکرگزاری کا دن ہے — خصوصاً امریکہ میں خاندانی کھانے اور ٹرکی کے اہتمام کے ساتھ منایا جاتا ہے۔",
    date: "Fourth Thursday of November (U.S.).",
    aliases: ["thanksgiving", "تھینکس گیونگ"],
  },

  easter: {
    description:
      "Easter celebrates the resurrection of Jesus Christ; traditions include church services, egg hunts, and family meals.",
    description_ur:
      "ایسٹر یسوع مسیح کی دوبارہ قیامت کا جشن ہے — چرچ سروسز، انڈے چھپانے کے کھیل اور خاندانی اجتماع عام ہیں۔",
    date: "Date changes each year (March–April).",
    aliases: ["easter", "عید الفصح"],
  },

  "valentine's day": {
    description:
      "Valentine’s Day on February 14th is a day to express love with cards, flowers and chocolates.",
    description_ur:
      "ویلنٹائن ڈے 14 فروری کو محبت کا اظہار کرنے کا دن ہے — کارڈز، پھول اور چاکلیٹس عام ہیں۔",
    date: "February 14th every year.",
    aliases: ["valentine's day", "valentine", "ویلنٹائن", "ویلنٹائن ڈے"],
  },

  "new year": {
    description:
      "New Year’s Day marks the start of the calendar year; people often celebrate with fireworks, gatherings and resolutions.",
    description_ur:
      "نیو ایئر ڈے سال کے آغاز کا دن ہے — لوگ آتشبازی، اجتماعات اور نئے ارادے کے ساتھ اسے مناتے ہیں۔",
    date: "January 1st every year.",
    aliases: ["new year", "new year’s", "نیا سال", "سال نو"],
  },

  // Pakistan-specific extras
  "independence day": {
    description:
      "Independence Day (Pakistan) is celebrated with flag hoisting, parades, patriotic songs, and cultural programs on August 14th.",
    description_ur:
      "یومِ آزادی (پاکستان) 14 اگست کو منایا جاتا ہے — پرچم کشائی، پریڈز، محافل اور ملکی جذبات کی نمائش عام ہے۔",
    date: "August 14th every year.",
    aliases: ["independence day", "14 august", "یوم آزادی", "آزادی کا دن"],
  },

  "pakistan day": {
    description:
      "Pakistan Day (March 23) commemorates the Lahore Resolution and includes parades and official ceremonies.",
    description_ur:
      "یومِ پاکستان 23 مارچ کو لاہور قرارداد کی یاد میں منایا جاتا ہے — فوجی پریڈز اور سرکاری تقریبیں ہوتی ہیں۔",
    date: "March 23rd every year.",
    aliases: ["pakistan day", "23 march", "یوم پاکستان"],
  },

  "labour day": {
    description:
      "Labour Day (May 1) honors workers and is observed with rallies, awareness events and speeches about workers' rights.",
    description_ur:
      "یومِ مزدور (1 مئی) مزدوروں کی خدمات کو سراہنے کے لیے منایا جاتا ہے — جلسے اور شعور بیدار کرنے کے پروگرام منعقد کیے جاتے ہیں۔",
    date: "May 1st every year.",
    aliases: ["labour day", "labor day", "1 may", "یوم مزدور"],
  },

  "defence day": {
    description:
      "Defence Day (September 6) honors Pakistan’s armed forces with tributes, parades and national programs.",
    description_ur:
      "یومِ دفاع (6 ستمبر) پر فوجی قوت اور قربانیوں کو خراجِ تحسین پیش کیا جاتا ہے — ریلیاں اور پروگرام منعقد ہوتے ہیں۔",
    date: "September 6th every year.",
    aliases: ["defence day", "defense day", "6 september", "یوم دفاع"],
  },

  "iqbal day": {
    description:
      "Iqbal Day (November 9) honors poet-philosopher Allama Iqbal with poetry readings, seminars and cultural events.",
    description_ur:
      "یومِ اقبال (9 نومبر) علامہ اقبال کی خدمات کو یاد کرتے ہوئے تقریبات، مشاعرے اور مباحثے منعقد کیے جاتے ہیں۔",
    date: "November 9th every year.",
    aliases: ["iqbal day", "9 november", "یوم اقبال"],
  },

  "quaid-e-azam day": {
    description:
      "Quaid-e-Azam Day (December 25) marks the birthday of Muhammad Ali Jinnah with ceremonies and tributes.",
    description_ur:
      "قائدِ اعظم ڈے (25 دسمبر) قائد اعظم محمد علی جناح کی سالگرہ کی مناسبت سے منایا جاتا ہے — تقریبات اور خراج تحسین ہوتے ہیں۔",
    date: "December 25th every year.",
    aliases: ["quaid-e-azam day", "25 december", "قائد اعظم", "قائدِ اعظم"],
  },

  "mela chiraghan": {
    description:
      "Mela Chiraghan (Festival of Lights) is a cultural celebration in parts of Pakistan, especially in Punjab, featuring music, fairs, and gatherings.",
    description_ur:
      "میلہ چراغاں (میلہ روشن) پنجاب کے کچھ حصوں میں موسیقی، میلے اور اجتماعات کے ساتھ منایا جاتا ہے۔",
    date: "Dates vary regionally.",
    aliases: ["mela chiraghan", "میلہ چراغاں"],
  },

  "shab-e-barat": {
    description:
      "Shab-e-Barat is observed by many Muslims with night prayers, visiting graves, and seeking forgiveness.",
    description_ur:
      "شبِ برات راتوں میں عبادت، قبرستان کا رخ اور مغفرت کی دعاؤں کے ساتھ منائی جاتی ہے۔",
    date: "Date changes each year (Islamic lunar calendar).",
    aliases: ["shab-e-barat", "شبِ برات", "شب برات"],
  },
};

// Utility: detect Urdu characters (basic heuristic)
const containsUrdu = (s: string) => /[\u0600-\u06FF]/.test(s);

// Utility: normalize user text for matching (lowercase, remove punctuation except spaces)
const normalize = (s: string) =>
  s
    .toLowerCase()
    .replace(/[\u2000-\u206F\u2E00-\u2E7F\\'!"#$%&()*+,\-./:;<=>?@\[\]^_`{|}~]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

// Helper: find event key by checking aliases
function findEventKey(message: string): string | null {
  const msg = normalize(message);
  for (const [key, obj] of Object.entries(KB)) {
    for (const alias of obj.aliases) {
      const a = normalize(alias);
      if (a && msg.includes(a)) return key;
    }
  }
  // as fallback, check single-word tokens for partial matches
  const tokens = msg.split(" ");
  for (const [key, obj] of Object.entries(KB)) {
    for (const alias of obj.aliases) {
      const a = normalize(alias);
      if (tokens.includes(a)) return key;
    }
  }
  return null;
}

// Helper: user asked for listing events?
function isAskingToList(message: string): boolean {
  const msg = normalize(message);
  const listPhrases = [
    "which events",
    "what events",
    "list events",
    "what festivals",
    "which festivals",
    "list festivals",
    "کون کون سی",
    "کون سے",
    "تقریبات کون سی",
    "کون سی تقریبات",
    "کونسے تہوار",
  ];
  return listPhrases.some((p) => msg.includes(normalize(p)));
}

// Helper: user asked for "when"
function isAskingWhen(message: string): boolean {
  const msg = normalize(message);
  const whenPhrases = ["when", "what date", "когда", "کب", "تاریخ"];
  return whenPhrases.some((p) => msg.includes(normalize(p)));
}

// API handler
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body ?? {};
  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "No message provided" });
  }

  // detect language preference: if Urdu script detected -> prefer Urdu replies
  const wantsUrdu = containsUrdu(message);

  // If user asks to list events
  if (isAskingToList(message)) {
    const eventList = Object.keys(KB)
      .map((k) => {
        // convert key to nicer display (capitalize words)
        return k
          .split(" ")
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(" ");
      })
      .join(", ");
    const reply = wantsUrdu
      ? `میں درج ذیل تقریبات کے بارے میں بتا سکتا ہوں: ${eventList}`
      : `I can tell you about the following events: ${eventList}`;
    return res.status(200).json({ reply, language: wantsUrdu ? "ur" : "en" });
  }

  // find event
  const key = findEventKey(message);

  if (!key) {
    // No event match
    const reply = wantsUrdu
      ? "معاف کریں، مجھے اس تقریب کے بارے میں معلومات نہیں ہیں۔ آپ عید، دیوالی، ہولی، یومِ آزادی وغیرہ کے بارے میں پوچھ سکتے ہیں۔"
      : "Sorry, I don't know about that event yet. Try asking about Eid, Diwali, Holi, Independence Day, etc.";
    return res.status(200).json({ reply, language: wantsUrdu ? "ur" : "en" });
  }

  const kbEntry = KB[key];
  // If user asked "when" -> include date
  const whenAsked = isAskingWhen(message);

  let replyText: string;
  if (wantsUrdu) {
    // Urdu responses: prefer description_ur and Urdu date (we included Urdu date strings in some entries)
    if (whenAsked) {
      replyText = `${key
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")} کی تاریخ: ${kbEntry.date}`;
    } else {
      // return the Urdu description if present; if not, fall back to English description
      replyText = (kbEntry as any).description_ur || kbEntry.description;
    }
  } else {
    if (whenAsked) {
      replyText = `${key
        .split(" ")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ")} is celebrated on ${kbEntry.date}`;
    } else {
      replyText = kbEntry.description;
    }
  }

  // Return reply plus language hint so frontend can speak with correct voice/lang
  return res.status(200).json({
    reply: replyText,
    language: wantsUrdu ? "ur" : "en",
    event: key,
    date: kbEntry.date,
  });
}
