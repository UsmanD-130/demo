import pdf from "pdf-parse";
import fs from "fs";
import { createWorker } from "tesseract.js";
import { fromPath } from "pdf2pic";

// Extract text from PDF (if selectable text exists)
export async function extractTextFromPDF(filePath) {
    
  const dataBuffer = fs.readFileSync(filePath);
  const pdfData = await pdf(dataBuffer);

  if (pdfData.text && pdfData.text.trim().length > 50) {
    return pdfData.text; // text-based PDF
  }

  // If no text found → do OCR on images
  return await extractTextWithOCR(filePath);
}

// OCR fallback for scanned docs
async function extractTextWithOCR(filePath) {
  const worker = await createWorker("eng");
  const pdf2pic = fromPath(filePath, {
    density: 200,
    saveFilename: "page",
    savePath: "./uploads",
    format: "png",
    width: 1200,
    height: 1600,
  });

  const numPages = 1; // can detect dynamically with pdf-lib if needed
  let fullText = "";

  for (let i = 1; i <= numPages; i++) {
    const page = await pdf2pic(i);
    const {
      data: { text },
    } = await worker.recognize(page.path);
    fullText += text + "\n";
  }

  await worker.terminate();
  return fullText;
}

// Now parse the CIBIL details from extracted text
export function extractCibilDetails(text) {
  const scoreMatch = text.match(/CIBIL Score\s*:\s*(\d+)/i);
  const panMatch = text.match(/PAN\s*:\s*([A-Z0-9]+)/i);
  const nameMatch = text.match(/Name\s*:\s*([A-Za-z ]+)/i);

  return {
    score: scoreMatch ? scoreMatch[1] : null,
    pan: panMatch ? panMatch[1] : null,
    name: nameMatch ? nameMatch[1].trim() : null,
    rawText: text,
  };
}
