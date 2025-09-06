import { NextResponse } from "next/server";

// Cultural events knowledge base
const events: Record<string, string> = {
  eid: "Eid is an Islamic festival celebrated twice a year. Eid-ul-Fitr comes after Ramadan and is celebrated with prayers, food, and family gatherings. Eid-ul-Adha is about sacrifice, prayers, and sharing with the needy.",
  ramadan: "Ramadan is the holy month of fasting for Muslims. People fast from dawn to sunset, pray, give charity, and focus on self-discipline.",
  diwali: "Diwali is the Hindu festival of lights, symbolizing the victory of light over darkness. People decorate their homes with lamps, exchange sweets, and celebrate with fireworks.",
  holi: "Holi is a Hindu spring festival of colors. People throw colored powders, sing, dance, and celebrate the arrival of spring.",
  christmas: "Christmas is a Christian holiday celebrating the birth of Jesus, with traditions like gifts, decorations, and prayers on December 25th.",
  newyear: "New Year is celebrated worldwide on January 1st with fireworks, parties, and resolutions to welcome the coming year.",
  independence: "Independence Day in Pakistan is on 14th August. It is celebrated with flag hoisting, parades, cultural programs, and patriotic songs.",
  pakistan: "Pakistan Day is celebrated on 23rd March to commemorate the Lahore Resolution and the adoption of Pakistan’s first constitution.",
  quaid: "Quaid-e-Azam Day is celebrated on 25th December to honor the birthday of Muhammad Ali Jinnah, the founder of Pakistan.",
  basant: "Basant is a spring festival celebrated with kite flying, music, and traditional food, especially in Lahore."
};

export async function POST(req: Request) {
  const { message } = await req.json();
  const lowerMsg = message.toLowerCase();

  let reply = "Sorry, I don't know the answer to that.";

  // keyword matching
  for (const key in events) {
    if (lowerMsg.includes(key)) {
      reply = events[key];
      break;
    }
  }

  // list of all events
  if (lowerMsg.includes("which events")) {
    reply =
      "I can tell you about Eid, Ramadan, Diwali, Holi, Christmas, New Year, Independence Day, Pakistan Day, Quaid-e-Azam Day, and Basant. Which one do you want to know about?";
  }

  return NextResponse.json({ reply });
}
