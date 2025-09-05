import React, { useState } from "react";

const AvatarChat: React.FC = () => {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSpeak = async () => {
    if (!text.trim()) return;
    setLoading(true);

    try {
      const res = await fetch("/api/talk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (!res.ok) throw new Error("Failed to fetch audio");

      // Get audio as ArrayBuffer
      const arrayBuffer = await res.arrayBuffer();
      const audioBlob = new Blob([arrayBuffer], { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);

      // Play audio
      const audio = new Audio(audioUrl);
      audio.play();

    } catch (err) {
      console.error("Error speaking:", err);
    }

    setLoading(false);
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white">
      <h2 className="text-xl font-bold mb-2">🎙️ Avatar Chat</h2>
      <textarea
        className="w-full border p-2 rounded mb-2"
        placeholder="Type something for the Avatar to speak..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400"
        onClick={handleSpeak}
        disabled={loading}
      >
        {loading ? "Speaking..." : "Speak"}
      </button>
    </div>
  );
};

export default AvatarChat;
