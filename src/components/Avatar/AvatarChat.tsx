import React, { useState } from "react";

export default function AvatarChat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [textInput, setTextInput] = useState("");

  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;

    // Add user message
    setMessages((prev) => [...prev, { role: "user", content: textInput }]);

    try {
      // Call Gemini backend
      const res = await fetch("/api/talk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: textInput }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, { role: "vector", content: data.reply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "vector", content: "Sorry, I'm currently unavailable." },
      ]);
    }

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
