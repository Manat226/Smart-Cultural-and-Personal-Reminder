import OpenAI from "openai";

// Load OpenAI key from environment variables
const OPENAI_KEY = process.env.OPENAI_API_KEY;

// Function to get AI response from Gemini
export default async function handler(req, res) {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ error: "No message provided" });
        }

        const client = new OpenAI({ apiKey: OPENAI_KEY });

        const response = await client.chat.completions.create({
            model: "gemini-1.2",
            messages: [{ role: "user", content: message }],
        });

        const answer = response.choices[0].message.content;
        res.status(200).json({ reply: answer });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Failed to get AI response" });
    }
}

