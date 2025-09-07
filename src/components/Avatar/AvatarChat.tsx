import React, { useState } from "react";

export default function AvatarChat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>(
    []
  );
  const [textInput, setTextInput] = useState("");

  // Simple event knowledge base
  const events: Record<string, string> = {
    eid: "Eid is a joyful Muslim festival marked with prayers, charity, family gatherings, and delicious food. لوگ نئے کپڑے پہنتے ہیں اور گلے ملتے ہیں۔",
    muharram:
      "Muharram is the first month of the Islamic calendar. It is observed with respect and remembrance, especially the 10th of Muharram (Ashura). مسلمان روزہ رکھتے ہیں اور امام حسینؓ کی قربانی کو یاد کرتے ہیں۔",
    basant:
      "Basant is a cultural kite-flying festival celebrated in spring, especially in Lahore, Pakistan. لوگ پتنگ بازی کرتے ہیں اور خوشیاں مناتے ہیں۔",
    holi: "Holi is a Hindu festival of colors. People throw colored powders, dance, and celebrate the arrival of spring. لوگ خوشیاں مناتے ہیں اور ایک دوسرے پر رنگ ڈالتے ہیں۔",
    diwali:
      "Diwali is the Hindu festival of lights. Homes are decorated with lamps, families gather, and sweets are shared. لوگ دیے جلاتے ہیں اور خوشیاں مناتے ہیں۔",
    christmas:
      "Christmas is a Christian holiday celebrating the birth of Jesus. Families gather, decorate trees, and exchange gifts. لوگ کیک کاٹتے ہیں اور چرچ جاتے ہیں۔",
    "independence day":
      "Pakistan’s Independence Day is celebrated on 14th August. The national flag is hoisted, parades are held, and fireworks light the night sky. لوگ پاکستان زندہ باد کے نعرے لگاتے ہیں۔",
    "new year":
      "New Year is celebrated on 1st January with fireworks, gatherings, and resolutions for the year ahead. لوگ مبارکباد دیتے ہیں اور جشن مناتے ہیں۔",
  };

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: textInput }]);

    let reply = "Sorry, I don’t know the answer to that.";

    const lower = textInput.toLowerCase();

    // Greetings
    if (
      lower.includes("hello") ||
      lower.includes("hi") ||
      lower.includes("salam") ||
      lower.includes("السلام")
    ) {
      reply =
        "Hello! I'm your cultural assistant. آپ کس تہوار کے بارے میں جاننا چاہتے ہیں؟";
    }
    // List events
    else if (
      lower.includes("which events") ||
      lower.includes("what events") ||
      lower.includes("کون سے تہوار") ||
      lower.includes("کون سی تقریبات")
    ) {
      reply =
        "I can tell you about Eid, Muharram, Basant, Holi, Diwali, Christmas, Independence Day, and New Year. آپ کس کے بارے میں پوچھنا چاہتے ہیں؟";
    }
    // Match specific events
    else {
      for (const [event, desc] of Object.entries(events)) {
        if (lower.includes(event)) {
          reply = desc;
          break;
        }
      }
    }

    // Add bot reply
    setMessages((prev) => [...prev, { role: "vector", content: reply }]);

    // Speak reply
    const utterance = new SpeechSynthesisUtterance(reply);
    utterance.lang = /[ء-ے]/.test(reply) ? "ur-PK" : "en-US"; // Urdu/English auto
    speechSynthesis.speak(utterance);

    setTextInput("");
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xl mx-auto p-4 bg-white rounded-2xl shadow-lg">
      <h2 className="text-xl font-bold mb-4">🎭 Vector – Your Cultural Guide</h2>

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
      </div>

      <div className="flex w-full mb-3">
        <input
          type="text"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Ask about Eid, Holi, Independence Day... (English or Urdu)"
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
