import { OpenAI } from "openai";
import dotenv from "dotenv";

dotenv.config();
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function analyzeWithAI(text) {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a financial risk analyst." },
      { role: "user", content: `Analyze this CIBIL report text and summarize risks:\n${text}` },
    ],
  });

  return response.choices[0].message.content;
}
