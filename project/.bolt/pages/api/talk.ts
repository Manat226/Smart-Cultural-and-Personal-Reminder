// /pages/api/talk.ts
import { NextApiRequest, NextApiResponse } from "next";
import * as sdk from "microsoft-cognitiveservices-speech-sdk";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Only POST allowed" });
  }

  // ⚠️ Replace with your Azure credentials
  const speechConfig = sdk.SpeechConfig.fromSubscription(
    process.env.AZURE_SPEECH_KEY || "2rI5i7uyLK9vUJ6Xb9i5gKD0qPYvIDFhHYPoMO9fjfX71MA62ENfJQQJ99BIACYeBjFXJ3w3AAAYACOGok0g",
    process.env.AZURE_REGION || "eastus"
  );
  speechConfig.speechSynthesisVoiceName = "en-US-JennyNeural";

  // 🎤 Case 1: User sent raw audio (speech → text → reply → speech)
  if (req.headers["content-type"] === "application/octet-stream") {
    const audioConfig = sdk.AudioConfig.fromWavFileInput(req.body as Buffer);
    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);

    recognizer.recognizeOnceAsync(async (result) => {
      recognizer.close();

      if (result.reason === sdk.ResultReason.RecognizedSpeech) {
        const userText = result.text;

        // 👉 Replace with LLM later
        const reply = `You said: ${userText}`;

        const synthesizer = new sdk.SpeechSynthesizer(speechConfig);
        synthesizer.speakTextAsync(
          reply,
          (speechResult) => {
            synthesizer.close();
            res.status(200).json({
              userText,
              reply,
              replyAudio: Buffer.from(speechResult.audioData).toString("base64"),
            });
          },
          (err) => {
            synthesizer.close();
            res.status(500).json({ message: "Speech synthesis failed", error: err });
          }
        );
      } else {
        res.status(500).json({ message: "Speech recognition failed" });
      }
    });

    return; // prevent fall-through
  }

  // ⌨️ Case 2: User sent text (text → reply → speech)
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Missing text input" });
  }

  // 👉 Replace with LLM later
  const reply = `You typed: ${text}`;

  const synthesizer = new sdk.SpeechSynthesizer(speechConfig);

  try {
    const result = await new Promise((resolve, reject) => {
      synthesizer.speakTextAsync(
        reply,
        (r) => {
          synthesizer.close();
          resolve(r);
        },
        (err) => {
          synthesizer.close();
          reject(err);
        }
      );
    });

    if ((result as any).audioData) {
      return res.status(200).json({
        userText: text,
        reply,
        replyAudio: Buffer.from((result as any).audioData).toString("base64"),
      });
    } else {
      return res.status(500).json({ message: "No audio generated" });
    }
  } catch (err) {
    return res.status(500).json({ message: "Error generating speech", error: err });
  }
}
