import React, { useState } from "react";

// Simple event database
const events: Record<
  string,
  { descriptionEn: string; descriptionUr: string; date: string }
> = {
  "eid al-fitr": {
    date: "Varies (end of Ramadan)",
    descriptionEn:
      "Eid al-Fitr marks the end of Ramadan, a month of fasting for Muslims. Families gather for prayers, feasts, and charity. It is a time of joy, gratitude, and community celebration.",
    descriptionUr:
      "عیدالفطر رمضان کے اختتام پر منائی جاتی ہے۔ مسلمان نماز، روزہ ختم کرنے کی خوشی، دعوتوں اور خیرات کے ساتھ مناتے ہیں۔ یہ خوشی، شکرگزاری اور اجتماعی جشن کا وقت ہے۔",
  },
  "eid al-adha": {
    date: "Varies (10th Dhul-Hijjah)",
    descriptionEn:
      "Eid al-Adha commemorates Prophet Ibrahim’s willingness to sacrifice his son for God. Muslims perform animal sacrifice, share meat with the needy, and gather for prayers.",
    descriptionUr:
      "عیدالاضحی حضرت ابراہیمؑ کی قربانی کی یاد میں منائی جاتی ہے۔ مسلمان جانور قربان کرتے ہیں، گوشت غریبوں میں بانٹتے ہیں اور نماز پڑھتے ہیں۔",
  },
  muharram: {
    date: "Varies (1st–10th Muharram)",
    descriptionEn:
      "Muharram, the first month of the Islamic calendar, holds special significance. The 10th day, Ashura, commemorates the martyrdom of Imam Hussain at Karbala. It is a time of mourning for many Muslims.",
    descriptionUr:
      "محرم اسلامی کیلنڈر کا پہلا مہینہ ہے۔ دس محرم کو امام حسینؑ کی کربلا میں شہادت کی یاد منائی جاتی ہے۔ یہ غم اور صبر کا وقت ہے۔",
  },
  ramadan: {
    date: "Varies (9th Islamic month)",
    descriptionEn:
      "Ramadan is a sacred month of fasting, prayer, and reflection for Muslims. From dawn to sunset, believers abstain from food and drink, focusing on spiritual growth and charity.",
    descriptionUr:
      "رمضان مسلمانوں کے لیے عبادت، روزہ اور دعا کا مقدس مہینہ ہے۔ صبح سے شام تک کھانے پینے سے پرہیز کیا جاتا ہے اور روحانی ترقی پر توجہ دی جاتی ہے۔",
  },
  diwali: {
    date: "Varies (October–November)",
    descriptionEn:
      "Diwali, the Hindu festival of lights, symbolizes the triumph of light over darkness and good over evil. Families decorate homes with lamps, exchange sweets, and celebrate with fireworks.",
    descriptionUr:
      "دیوالی روشنیوں کا ہندو تہوار ہے جو اندھیرے پر روشنی اور برائی پر اچھائی کی فتح کی علامت ہے۔ لوگ گھروں کو چراغوں سے سجاتے ہیں، مٹھائیاں بانٹتے ہیں اور آتشبازی کرتے ہیں۔",
  },
  holi: {
    date: "Varies (March)",
    descriptionEn:
      "Holi, the Hindu festival of colors, celebrates the arrival of spring and the victory of good over evil. People play with colors, dance, and share festive foods.",
    descriptionUr:
      "ہولی رنگوں کا ہندو تہوار ہے جو بہار کے آنے اور نیکی کی فتح کی خوشی مناتا ہے۔ لوگ ایک دوسرے پر رنگ ڈالتے ہیں، رقص کرتے ہیں اور خوشی بانٹتے ہیں۔",
  },
  christmas: {
    date: "December 25",
    descriptionEn:
      "Christmas celebrates the birth of Jesus Christ. Christians attend church services, exchange gifts, decorate trees, and enjoy festive meals with family and friends.",
    descriptionUr:
      "کرسمس حضرت عیسیٰ علیہ السلام کی ولادت کی خوشی میں منایا جاتا ہے۔ مسیحی چرچ میں عبادت کرتے ہیں، تحفے بانٹتے ہیں، درخت سجاتے ہیں اور دعوتیں کرتے ہیں۔",
  },
  easter: {
    date: "Varies (March–April, Sunday)",
    descriptionEn:
      "Easter celebrates the resurrection of Jesus Christ. Christians attend church, share meals, and enjoy traditions like Easter eggs and family gatherings.",
    descriptionUr:
      "ایسٹر حضرت عیسیٰ علیہ السلام کے دوبارہ زندہ ہونے کی یاد میں منایا جاتا ہے۔ مسیحی چرچ میں عبادت کرتے ہیں، کھانے بانٹتے ہیں اور انڈوں کی روایات مناتے ہیں۔",
  },
  vesak: {
    date: "Varies (April–May)",
    descriptionEn:
      "Vesak, or Buddha Day, celebrates the birth, enlightenment, and death of Gautama Buddha. Buddhists light lamps, meditate, and engage in acts of kindness.",
    descriptionUr:
      "ویساک بدھ مت کا دن ہے جو گوتم بدھ کی پیدائش، معرفت اور وفات کی یاد میں منایا جاتا ہے۔ بدھ مت کے ماننے والے چراغ جلاتے ہیں، عبادت کرتے ہیں اور نیکی کرتے ہیں۔",
  },
  hanukkah: {
    date: "Varies (December)",
    descriptionEn:
      "Hanukkah, the Jewish Festival of Lights, commemorates the miracle of the oil in the temple. Families light the menorah, exchange gifts, and enjoy traditional foods.",
    descriptionUr:
      "ہنوکا یہودیوں کا روشنیوں کا تہوار ہے جو مندر کے تیل کے معجزے کی یاد میں منایا جاتا ہے۔ لوگ مینورا جلاتے ہیں، تحفے بانٹتے ہیں اور روایتی کھانے کھاتے ہیں۔",
  },
  nowruz: {
    date: "March 21",
    descriptionEn:
      "Nowruz, the Persian New Year, marks the arrival of spring. Families prepare special meals, clean homes, and celebrate renewal with joy and unity.",
    descriptionUr:
      "نوروز فارسی نیا سال ہے جو بہار کے آغاز کی علامت ہے۔ لوگ گھروں کی صفائی کرتے ہیں، دعوتیں تیار کرتے ہیں اور خوشی و اتحاد سے جشن مناتے ہیں۔",
  },
  "independence day": {
    date: "August 14",
    descriptionEn:
      "Pakistan’s Independence Day is celebrated on August 14. People hoist flags, attend parades, and honor the sacrifices made for freedom in 1947.",
    descriptionUr:
      "پاکستان کا یوم آزادی 14 اگست کو منایا جاتا ہے۔ لوگ جھنڈے لہراتے ہیں، پریڈ دیکھتے ہیں اور 1947 کی قربانیوں کو یاد کرتے ہیں۔",
  },
  basant: {
    date: "Varies (February)",
    descriptionEn:
      "Basant is a cultural kite festival in Punjab, Pakistan. The skies fill with colorful kites as families enjoy picnics, music, and traditional foods.",
    descriptionUr:
      "بسنت پنجاب کا پتنگ بازی کا تہوار ہے۔ آسمان رنگین پتنگوں سے بھر جاتا ہے اور لوگ کھانے، موسیقی اور کھیلوں سے لطف اندوز ہوتے ہیں۔",
  },
  thanksgiving: {
    date: "4th Thursday of November",
    descriptionEn:
      "Thanksgiving is a U.S. holiday where families give thanks for blessings. People share meals, especially turkey, and celebrate unity and gratitude.",
    descriptionUr:
      "تھینکس گیونگ امریکہ میں منایا جاتا ہے۔ لوگ دعائیں شکر گزاری کے لیے کرتے ہیں، کھانے بانٹتے ہیں اور خاندان کے ساتھ وقت گزارتے ہیں۔",
  },
  "new year": {
    date: "January 1",
    descriptionEn:
      "New Year’s Day is celebrated worldwide with fireworks, family gatherings, and resolutions. It marks a fresh start and new opportunities for everyone.",
    descriptionUr:
      "نئے سال کا دن پوری دنیا میں آتشبازی، میل ملاقات اور وعدوں کے ساتھ منایا جاتا ہے۔ یہ نئی شروعات اور مواقع کی علامت ہے۔",
  },
  "chinese new year": {
    date: "Varies (January–February)",
    descriptionEn:
      "Chinese New Year marks the start of the lunar calendar. Families reunite, share feasts, and celebrate with dragon dances and red envelopes.",
    descriptionUr:
      "چینی نیا سال قمری کیلنڈر کا آغاز ہے۔ خاندان اکٹھے ہوتے ہیں، کھانے کھاتے ہیں اور ڈریگن ڈانس اور سرخ لفافوں کے ساتھ خوشی مناتے ہیں۔",
  },
  navratri: {
    date: "Varies (September–October)",
    descriptionEn:
      "Navratri is a nine-night Hindu festival dedicated to Goddess Durga. People fast, pray, and dance in celebration of divine feminine power.",
    descriptionUr:
      "نوراتری نو راتوں پر مشتمل ہندو تہوار ہے جو دیوی درگا کے نام پر منایا جاتا ہے۔ لوگ روزہ رکھتے ہیں، عبادت کرتے ہیں اور رقص کرتے ہیں۔",
  },
  "guru nanak jayanti": {
    date: "Varies (November)",
    descriptionEn:
      "Guru Nanak Jayanti celebrates the birth of Guru Nanak, the founder of Sikhism. Sikhs hold processions, sing hymns, and serve free meals (langar).",
    descriptionUr:
      "گرو نانک جینتی سکھ مذہب کے بانی گرو نانک کی پیدائش کی خوشی ہے۔ سکھ جلوس نکالتے ہیں، بھجن گاتے ہیں اور لنگر تقسیم کرتے ہیں۔",
  },
  "good friday": {
    date: "Varies (March–April, Friday)",
    descriptionEn:
      "Good Friday is a solemn Christian holiday commemorating the crucifixion of Jesus Christ. It is observed with prayers, fasting, and church services.",
    descriptionUr:
      "گڈ فرائیڈے مسیحی تہوار ہے جو حضرت عیسیٰ علیہ السلام کی مصلوبیت کی یاد میں منایا جاتا ہے۔ لوگ دعا کرتے ہیں، روزہ رکھتے ہیں اور چرچ میں عبادت کرتے ہیں۔",
  },
  halloween: {
    date: "October 31",
    descriptionEn:
      "Halloween is a cultural festival where children dress in costumes, go trick-or-treating, and enjoy spooky decorations. It originated from ancient Celtic traditions.",
    descriptionUr:
      "ہالووین ایک ثقافتی تہوار ہے جس میں بچے ملبوسات پہنتے ہیں، ٹرک یا ٹریٹ کرتے ہیں اور ڈراؤنی سجاوٹ کا لطف اٹھاتے ہیں۔ یہ قدیم کیلٹک روایات سے آیا ہے۔",
  },
};

export default function AvatarChat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [textInput, setTextInput] = useState("");
  const [loading, setLoading] = useState(false);

  const detectLanguage = (text: string) => {
    const urduRegex = /[ء-ی]/;
    return urduRegex.test(text) ? "ur" : "en";
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;

    const userLang = detectLanguage(textInput);
    setMessages((prev) => [...prev, { role: "user", content: textInput }]);
    setLoading(true);

    let reply = "Sorry, I don’t know this event.";
    const lower = textInput.toLowerCase();

    const foundKey = Object.keys(events).find((k) =>
      lower.includes(k.toLowerCase())
    );

    if (foundKey) {
      reply =
        userLang === "ur"
          ? `${events[foundKey].descriptionUr} تاریخ: ${events[foundKey].date}`
          : `${events[foundKey].descriptionEn} Date: ${events[foundKey].date}`;
    }

    setMessages((prev) => [...prev, { role: "bot", content: reply }]);

    // Voice output
    const utterance = new SpeechSynthesisUtterance(reply);
    utterance.lang = userLang === "ur" ? "ur-PK" : "en-US";
    speechSynthesis.speak(utterance);

    setLoading(false);
    setTextInput("");
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto p-4 bg-white rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">🎭 Vector – Cultural Guide</h2>

      <div className="w-full h-64 overflow-y-auto border rounded-xl p-2 bg-gray-50 mb-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`p-2 my-1 rounded-lg ${
              m.role === "user"
                ? "bg-blue-100 text-right"
                : "bg-green-100 text-left"
            }`}
          >
            {m.content}
          </div>
        ))}
        {loading && <div className="text-gray-500 p-2">⏳ Thinking...</div>}
      </div>

      <div className="flex w-full mb-3">
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Ask about any festival or event..."
          className="flex-grow border rounded-l-xl px-4 py-2 focus:outline-none"
          onKeyDown={(e) => e.key === "Enter" && handleTextSubmit()}
        />
        <button
          onClick={handleTextSubmit}
          className="px-4 py-2 bg-green-600 text-white rounded-r-xl hover:bg-green-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
