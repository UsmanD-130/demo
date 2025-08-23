import dotenv from "dotenv";
import Tesseract from "tesseract.js";
import fs from "fs"
import OpenAI from "openai";

dotenv.config();

export const generateSummary = async (req, res) => {
  const openAi = new OpenAI({
    apiKey: process.env.MY_TEST_API_KEY,
  });

  // Step 1 : OCR Extraction

  async function extractedText(filePath) {
    const result = await Tesseract.recognize(filePath, "eng");
    console.log(result.data.text, "result.data.text");
    return result.data.text;
  }

  // Step 2 : OpenAI Summarization

  async function summarizeCibilReport(extractedText) {
    const response = await openAi.chat.completions.create({
      model:"gpt-5",
      messages: [
        {
          role: "system",
          content:
            "You are a financial report analyzer. Extract the CIBIL score and classify the status.",
        },
        {
          role: "user",
          content: ` Document text:
          ${extractedText}

          Rules:
          - If score > 750 → "Good"
          - If score between 600 and 750 → "Risky"
          - If score < 600 → "Bad"

          Return only valid JSON with keys: cibil_score, status, remarks.
        `,
        },
      ],
      response_format: { type: "json" },
    });
    return JSON.parse(response.choices[0].message.content);
  }

  try {
    console.log(req.path,"req.body")
    const filePath = "C:/Users/Administrator/Downloads/cibil-report.webp";

    // 1. OCR
    const text = await extractedText(filePath);

    // 2. Analyze with OpenAI
    const summary = await summarizeCibilReport(text);

    res.json(summary);

    fs.unlinkSync(filePath);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to analyze document" });
  }
};
