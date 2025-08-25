import pdfParse from 'pdf-parse';
import Tesseract from 'tesseract.js';
import { convertPDFToImage } from './convertPDFToImage.js';

export async function extractTextFromPDF(pdfBuffer) {
  const data = await pdfParse(pdfBuffer);
  const rawText = data.text.trim();

  if (rawText.length > 50) {
    return rawText;
  }

  // Fallback to OCR
  const imagePaths = await convertPDFToImage(pdfBuffer);
  let ocrText = '';

  for (const imagePath of imagePaths) {
    const result = await Tesseract.recognize(imagePath, 'eng');
    ocrText += result.data.text + '\n';
  }

  return ocrText.trim();
}
