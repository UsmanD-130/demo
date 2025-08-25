console.log("index.jsc")

import express from "express";
import multer from "multer";
import mammoth from "mammoth";
import { OpenAI } from "openai";
import fs from "fs";
import PdfParse from "pdf-parse";

const app = express();
const upload = multer({ dest: "uploads/" });

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Upload route
app.post("/upload", upload.single("document"), async (req, res) => {
  try {
    let extractedText = "";
    let summary = "";
    const filePath = req.file.path;
    console.log(filePath,"filePath")

    // Case 1: PDF
    if (req.file.mimetype === "application/pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await PdfParse(dataBuffer);

      if (pdfData.text.trim().length > 50) {
        // ✅ Normal PDF with text
        extractedText = pdfData.text;

        const completion = await client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a summarizer." },
            {
              role: "user",
              content: `Summarize the following document:\n\n${extractedText}`,
            },
          ],
        });

        summary = completion.choices[0].message.content;
      } else {
        // ❌ Likely a scanned PDF → send to OpenAI Vision
        const fileBase64 = fs.readFileSync(filePath).toString("base64");

        const completion = await client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "user",
              content: [
                { type: "text", text: "Summarize the text from this scanned PDF:" },
                {
                  type: "image_url",
                  image_url: { url: `data:application/pdf;base64,${fileBase64}` },
                },
              ],
            },
          ],
        });

        summary = completion.choices[0].message.content;
        extractedText = "(Extracted via Vision Model)";
      }
    }

    // Case 2: Word Doc (docx)
    else if (
      req.file.mimetype ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      const data = await mammoth.extractRawText({ path: filePath });
      extractedText = data.value;

      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a summarizer." },
          {
            role: "user",
            content: `Summarize the following document:\n\n${extractedText}`,
          },
        ],
      });

      summary = completion.choices[0].message.content;
    }

    // Case 3: TXT
    else if (req.file.mimetype === "text/plain") {
      extractedText = fs.readFileSync(filePath, "utf-8");

      const completion = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are a summarizer." },
          {
            role: "user",
            content: `Summarize the following text file:\n\n${extractedText}`,
          },
        ],
      });

      summary = completion.choices[0].message.content;
    }

    else {
      return res.status(400).json({ error: "Unsupported file type" });
    }

    res.json({ text: extractedText, summary });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(5000, () => console.log("✅ Server running on port 5000"));
