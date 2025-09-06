// pages/api/talk.ts

import { NextApiRequest, NextApiResponse } from "next";

// Knowledge base with description + date
const culturalEvents: Record<
  string,
  { description: string; date: string }
> = {
  eid: {
    description:
      "Eid al-Fitr is celebrated at the end of Ramadan. People gather for prayers, share meals, and give charity.",
    date: "تاریخ ہر سال بدلتی ہے (اسلامی قمری کیلنڈر کے مطابق).",
  },
  diwali: {
    description:
      "Diwali, the Festival of Lights, is celebrated with lamps, sweets, and fireworks.",
    date: "تاریخ ہر سال بدلتی ہے (اکتوبر–نومبر، ہندو قمری کیلنڈر).",
  },
  christmas: {
    description:
      "Christmas marks the birth of Jesus Christ. Families exchange gifts, decorate trees, and attend church.",
    date: "25 دسمبر ہر سال۔",
  },
  holi: {
    description:
      "Holi, the Festival of Colors, is celebrated with colored powders, music, and dancing.",
    date: "تاریخ ہر سال بدلتی ہے (مارچ، ہندو قمری کیلنڈر).",
  },
  "independence day": {
    description:
      "Pakistan’s Independence Day is celebrated with flag hoisting, parades, and patriotic songs.",
    date: "14 اگست ہر سال۔",
  },
  "pakistan day": {
    description:
      "Pakistan Day marks the Lahore Resolution of 1940 with military parades and cultural programs.",
    date: "23 مارچ ہر سال۔",
  },
  "defence day": {
    description:
      "Defence Day honors Pakistan’s armed forces with parades and tributes.",
    date: "6 ستمبر ہر سال۔",
  },
  "quaid-e-azam day": {
    description:
      "Quaid-e-Azam Day celebrates the birthday of Muhammad Ali Jinnah, Pakistan’s founder.",
    date: "25 دسمبر ہر سال۔",
  },
};

// Helper: detect event keyword in both English & Urdu
function findEvent(message: string): string | null {
  const normalized = message.toLowerCase();

  // Urdu mappings
  if (normalized.includes("عید")) return "eid";
  if (normalized.includes("دیوالي")) return "diwali";
  if (normalized.includes("کرسمس")) return "christmas";
  if (normalized.includes("ہولی")) return "holi";
  if (normalized.includes("یوم آزادی")) return "independence day";
  if (normalized.includes("یوم پاکستان")) return "pakistan day";
  if (normalized.includes("یوم دفاع")) return "defence day";
  if (normalized.includes("قائداعظم")) return "quaid-e-azam day";

  // English checks
  for (const event in culturalEvents) {
    if (normalized.includes(event)) {
      return event;
    }
  }
  return null;
}

// Helper: check if asking to list events (English + Urdu)
function isAskingForEvents(message: string): boolean {
  const normalized = message.toLowerCase();
  return (
    normalized.includes("list") ||
    normalized.includes("which events") ||
    normalized.includes("what events") ||
    normalized.includes("festivals") ||
    normalized.includes("تقریب") ||
    normalized.includes("کون سے") ||
    normalized.includes("کونسے") ||
    normalized.includes("کون کون سے")
  );
}

// API handler
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ error: "No message provided" });
  }

  let reply =
    "معاف کریں، میرے پاس اس تقریب کی معلومات نہیں ہیں۔ آپ عید، دیوالی، کرسمس، یوم آزادی وغیرہ کے بارے میں پوچھ سکتے ہیں۔";

  if (isAskingForEvents(message)) {
    reply =
      "یہ تقریبات ہیں جن کے بارے میں میں بتا سکتا ہوں:\n- " +
      Object.keys(culturalEvents)
        .map((e) => e.charAt(0).toUpperCase() + e.slice(1))
        .join("\n- ");
  } else {
    const event = findEvent(message);
    if (event) {
      const { description, date } = culturalEvents[event];
      if (
        message.toLowerCase().includes("when") ||
        message.includes("کب") ||
        message.includes("تاریخ")
      ) {
        reply = `${event.charAt(0).toUpperCase() + event.slice(1)} is celebrated on ${date}`;
      } else {
        reply = description;
      }
    }
  }

  return res.status(200).json({ reply });
}
