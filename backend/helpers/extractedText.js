  // Step 1 : OCR Extraction

import OpenAI from "openai";
import Tesseract from "tesseract.js";

    const openAi = new OpenAI({
      apiKey: process.env.MY_TEST_API_KEY,
    });

  export async function extractedText(filePath) {
    const result = await Tesseract.recognize(filePath, "eng");
    console.log(result.data.text, "result.data.text");
    return result.data.text;
  }