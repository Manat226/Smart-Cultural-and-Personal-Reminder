import React, { useState } from "react";

export default function AvatarChat() {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [textInput, setTextInput] = useState(""); // ⌨️ New state for text input

  // 🎤 Record user voice
  const startRecording = async () => {
    setIsRecording(true);
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    mediaRecorder.ondataavailable = (event) => chunks.push(event.data);
    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(chunks, { type: "audio/wav" });
      const arrayBuffer = await audioBlob.arrayBuffer();

      try {
        // 🚀 Send to backend
        const res = await fetch("/api/vector/talk", {
          method: "POST",
          headers: { "Content-Type": "application/octet-stream" },
          body: arrayBuffer,
        });

        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }

        const data = await res.json();

        // Update chat
        setMessages((prev) => [...prev, { role: "user", content: data.userText }]);
        setMessages((prev) => [...prev, { role: "vector", content: data.reply }]);

        // Play reply audio
        if (data.replyAudio) {
          const audioUrl = `data:audio/mp3;base64,${data.replyAudio}`;
          const audioEl = new Audio(audioUrl);
          setAudio(audioEl);
          audioEl.play();
        }
      } catch (error) {
        console.error("Error processing voice input:", error);
        setMessages((prev) => [...prev, { role: "user", content: "Voice message" }]);
        setMessages((prev) => [...prev, { role: "vector", content: "Sorry, I'm currently unavailable. Please try again later." }]);
      }
    };

    mediaRecorder.start();
    setTimeout(() => {
      mediaRecorder.stop();
      setIsRecording(false);
    }, 5000); // record 5s max
  };

  // ⌨️ Handle text submit
  const handleTextSubmit = async () => {
    if (!textInput.trim()) return;

    // Update UI with user message
    setMessages((prev) => [...prev, { role: "user", content: textInput }]);

    try {
      // 🚀 Send to backend
      const res = await fetch("/api/vector/talk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textInput }),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();

      // Add bot reply
      setMessages((prev) => [...prev, { role: "vector", content: data.reply }]);

      // Play reply audio if exists
      if (data.replyAudio) {
        const audioUrl = `data:audio/mp3;base64,${data.replyAudio}`;
        const audioEl = new Audio(audioUrl);
        setAudio(audioEl);
        audioEl.play();
      }
    } catch (error) {
      console.error("Error processing text input:", error);
      setMessages((prev) => [...prev, { role: "vector", content: "Sorry, I'm currently unavailable. Please try again later." }]);
    }

    setTextInput(""); // clear input
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

      {/* ⌨️ Text input + send button */}
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

      {/* 🎤 Mic button */}
      <button
        onClick={startRecording}
        disabled={isRecording}
        className={`px-6 py-3 rounded-full text-white ${
          isRecording ? "bg-red-500 animate-pulse" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isRecording ? "🎙️ Listening..." : "🎤 Ask Vector"}
      </button>
    </div>
  );
}
