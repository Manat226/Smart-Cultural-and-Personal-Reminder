// File: pages/api/talk.ts
import type { NextApiRequest, NextApiResponse } from "next";

// ===== Knowledge Base =====
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
      "Eid al-Fitr is celebrated at the end of Ramadan with communal prayers, shared meals, visiting family, and giving to the poor. Eid al-Adha commemorates willingness to sacrifice with special prayers and sharing meat.",
    description_ur:
      "عید الفطر رمضان کے اختتام پر منائی جاتی ہے — اجتماعی نمازیں، کھانے، ملاقاتیں اور صدقہ۔ عید الاضحی قربانی اور نمازوں کے ساتھ منائی جاتی ہے۔",
    date: "Dates change each year (Islamic lunar calendar).",
    aliases: ["eid", "eid al-fitr", "eid al adha", "عید", "عید الفطر", "عید الاضحی"],
  },
  ramadan: {
    description:
      "Ramadan is a month of fasting, prayer, reflection, and charity.",
    description_ur: "رمضان روزہ رکھنے، عبادت اور صدقہ دینے کا مہینہ ہے۔",
    date: "Dates change each year (Islamic lunar calendar).",
    aliases: ["ramadan", "رمضان"],
  },
  muharram: {
    description:
      "Muharram is the first month of the Islamic calendar, especially significant on the 10th (Ashura).",
    description_ur: "محرم اسلامی سال کا پہلا مہینہ ہے، عاشورہ خاص اہمیت رکھتا ہے۔",
    date: "Dates change each year (Islamic lunar calendar).",
    aliases: ["muharram", "محرم", "ashura", "عاشورہ"],
  },
  basant: {
    description:
      "Basant is a spring festival celebrated with kite flying and music, mainly in Lahore.",
    description_ur: "بسنت بہار کا تہوار ہے، لاہور میں پتنگ بازی اور موسیقی کے ساتھ منایا جاتا ہے۔",
    date: "Usually in February.",
    aliases: ["basant", "بسنت"],
  },
  holi: {
    description:
      "Holi is the Hindu festival of colors, with throwing of colors, singing, and dancing.",
    description_ur: "ہولی رنگوں کا تہوار ہے جس میں لوگ رنگ پھینکتے اور ناچتے گاتے ہیں۔",
    date: "Date changes each year (March).",
    aliases: ["holi", "ہولی"],
  },
  diwali: {
    description:
      "Diwali is the Festival of Lights, celebrated with lamps, sweets, and fireworks.",
    description_ur: "دیوالی روشنیوں کا تہوار ہے، دیا جلانے، مٹھائیاں اور آتشبازی شامل ہیں۔",
    date: "Date changes each year (Oct–Nov).",
    aliases: ["diwali", "دیوالی"],
  },
  christmas: {
    description:
      "Christmas celebrates the birth of Jesus on December 25th with trees, gifts, and meals.",
    description_ur: "کرسمس یسوع مسیح کی ولادت کا دن ہے، 25 دسمبر کو منایا جاتا ہے۔",
    date: "December 25th every year.",
    aliases: ["christmas", "کرسمس"],
  },
  "independence day": {
    description:
      "Pakistan’s Independence Day is celebrated on August 14 with parades, flags, and patriotic songs.",
    description_ur: "یوم آزادی پاکستان 14 اگست کو پریڈ، پرچم کشائی اور قومی نغموں کے ساتھ منایا جاتا ہے۔",
    date: "August 14 every year.",
    aliases: ["independence day", "14 august", "یوم آزادی"],
  },
  "pakistan day": {
    description:
      "Pakistan Day (March 23) marks the Lahore Resolution, celebrated with parades and ceremonies.",
    description_ur: "یوم پاکستان 23 مارچ کو قرارداد لاہور کی یاد میں منایا جاتا ہے۔",
    date: "March 23 every year.",
    aliases: ["pakistan day", "23 march", "یوم پاکستان"],
  },
  "defence day": {
    description:
      "Defence Day (September 6) honors Pakistan’s armed forces.",
    description_ur: "یوم دفاع (6 ستمبر) پاکستان کی فوج کو خراج تحسین پیش کرنے کا دن ہے۔",
    date: "September 6 every year.",
    aliases: ["defence day", "6 september", "یوم دفاع"],
  },
  "iqbal day": {
    description:
      "Iqbal Day (November 9) remembers Allama Iqbal with poetry and events.",
    description_ur: "یوم اقبال (9 نومبر) علامہ اقبال کو یاد کرنے کا دن ہے۔",
    date: "November 9 every year.",
    aliases: ["iqbal day", "9 november", "یوم اقبال"],
  },
  "quaid-e-azam day": {
    description:
      "Quaid-e-Azam Day (December 25) marks Jinnah’s birthday with tributes.",
    description_ur: "قائداعظم ڈے 25 دسمبر کو محمد علی جناح کی سالگرہ کے طور پر منایا جاتا ہے۔",
    date: "December 25 every year.",
    aliases: ["quaid-e-azam day", "25 december", "قائد اعظم"],
  },
  "shab-e-barat": {
    description:
      "Shab-e-Barat is observed with prayers, visiting graves, and seeking forgiveness.",
    description_ur: "شب برات عبادت، قبروں کی زیارت اور مغفرت کی دعاؤں کے ساتھ منائی جاتی ہے۔",
    date: "Date changes each year (Islamic lunar calendar).",
    aliases: ["shab-e-barat", "شب برات"],
  },
};

// ===== Utilities =====
const containsUrdu = (s: string) => /[\u0600-\u06FF]/.test(s);

const normalize = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9\u0600-\u06FF ]/g, " ").replace(/\s+/g, " ").trim();

function findEventKey(message: string): string | null {
  const msg = normalize(message);
  for (const [key, obj] of Object.entries(KB)) {
    for (const alias of obj.aliases) {
      if (msg.includes(normalize(alias))) return key;
    }
  }
  return null;
}

function isAskingToList(message: string): boolean {
  const msg = normalize(message);
  const listPhrases = ["which events", "what events", "list events", "کون کون سی", "کون سے"];
  return listPhrases.some((p) => msg.includes(normalize(p)));
}

function isAskingWhen(message: string): boolean {
  const msg = normalize(message);
  const whenPhrases = ["when", "what date", "کب", "تاریخ"];
  return whenPhrases.some((p) => msg.includes(normalize(p)));
}

// ===== API Handler =====
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { message } = req.body ?? {};
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "No message provided" });
    }

    const wantsUrdu = containsUrdu(message);

    // If asking for list
    if (isAskingToList(message)) {
      const events = Object.keys(KB)
        .map((k) => k.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()))
        .join(", ");
      const reply = wantsUrdu
        ? `میں ان تقریبات کے بارے میں بتا سکتا ہوں: ${events}`
        : `I can tell you about: ${events}`;
      return res.status(200).json({ reply, language: wantsUrdu ? "ur" : "en" });
    }

    // Check event
    const key = findEventKey(message);
    if (!key) {
      const reply = wantsUrdu
        ? "معاف کریں، مجھے اس تقریب کے بارے میں علم نہیں ہے۔ آپ عید، دیوالی، ہولی وغیرہ کے بارے میں پوچھ سکتے ہیں۔"
        : "Sorry, I don’t know about that event yet. Try asking about Eid, Diwali, Holi, Independence Day, etc.";
      return res.status(200).json({ reply, language: wantsUrdu ? "ur" : "en" });
    }

    const entry = KB[key];
    let reply: string;
    if (wantsUrdu) {
      reply = isAskingWhen(message) ? `${key} کی تاریخ: ${entry.date}` : entry.description_ur;
    } else {
      reply = isAskingWhen(message) ? `${key} is on ${entry.date}` : entry.description;
    }

    return res.status(200).json({
      reply,
      language: wantsUrdu ? "ur" : "en",
      event: key,
      date: entry.date,
    });
  } catch (err) {
    console.error("Talk API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
