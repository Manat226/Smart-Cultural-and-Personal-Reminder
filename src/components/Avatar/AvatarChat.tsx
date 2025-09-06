import React, { useState } from "react";

export default function AvatarChat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [textInput, setTextInput] = useState("");

  const handleTextSubmit = () => {
    if (!textInput.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: textInput }]);

    // Simple in-browser response logic
    let reply = "Sorry, I don't know the answer to that.";

    const lower = textInput.toLowerCase();
    if (lower.includes("hello") || lower.includes("hi")) {
      reply = "Hello! I'm your cultural assistant. How can I help you today?";
    } else if (lower.includes("tasks")) {
      reply = "You have 3 pending tasks today: Morning prayer at 6 AM, Team meeting at 10 AM, Shopping for festival preparations at 3 PM.";
    } else if (lower.includes("events") || lower.includes("holiday")) {
      reply = "The next major cultural event is Eid al-Fitr on March 30th. It's a time for celebration, family gatherings, and charitable giving.";
    }

    // Add bot reply
    setMessages((prev) => [...prev, { role: "vector", content: reply }]);

    // Browser TTS
    const utterance = new SpeechSynthesisUtterance(reply);
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
              m.role === "user" ? "bg-blue-100 text-right" : "bg-green-100 text-left"
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
          placeholder="Type your question..."
          className="flex-grow border rounded-l-xl px-4 py-2 focus:outline-none"
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
