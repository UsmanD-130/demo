import express from "express";
import multer from "multer";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import { OpenAI } from "openai";
import fs from "fs";
import path from "path";
import { spawn } from "child_process";

const app = express();
const upload = multer({ dest: "uploads/" });

const client = new OpenAI({
  apiKey: "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",
});


// Function to convert PDF → PNG using poppler-utils (pdftoppm must be installed)

async function pdfToImages(pdfPath) {
    
  return new Promise((resolve, reject) => {
    const outputDir = path.join("uploads", "converted");
    console.log(outputDir,"outputDir")
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    const outputBase = path.join(outputDir, "page");
    console.log(outputBase,"outputBase")
    // Fix path for Windows → forward slashes

    const normalizedPdfPath = path.resolve(pdfPath).replace(/\\/g, "/");
    
    const normalizedOutputBase = path.resolve(outputBase).replace(/\\/g, "/");
    
    console.log(normalizedPdfPath, normalizedOutputBase, "normalizedPdfPath , normalizedOutputBase");
    const pdftoppm = path.resolve("C:/poppler/Library/bin/pdftoppm.exe").replace(/\\/g, "/");
    if (!fs.existsSync(pdftoppm)) {
      return reject(new Error("pdftoppm.exe not found at: " + pdftoppm));
    }
    if (!fs.existsSync(normalizedPdfPath)) {
      return reject(new Error("PDF file not found at: " + normalizedPdfPath));
    }
    // Use double quotes for paths with spaces and ensure correct argument order for pdftoppm
    const process = spawn(pdftoppm, [
      "-png",
      normalizedPdfPath,
      normalizedOutputBase
    ]);

    console.log(process,"process")

    process.stdout.on("data", (data) => {
  console.log(`stdout: ${data}`);
});

process.stderr.on("data", (data) => {
  console.error(`stderr: ${data}`);
});

    process.on("close", (code) => {
        console.log(code,"code")
      if (code === 0) {
        const files = fs
          .readdirSync(outputDir)
          .filter((f) => f.endsWith(".png"))
          .map((f) => path.join(outputDir, f));
        resolve(files);
      } else {
        reject(new Error("PDF to image conversion failed"));
      }
    });
  });
}

// Upload route
app.post("/upload", upload.single("document"), async (req, res) => {
    try {
    let filePath = req.file.path;
    let extractedText = "";
    let summary = "";

    // Case 1: PDF
    if (req.file.mimetype === "application/pdf") {

    let newPath = filePath + ".pdf";
      fs.renameSync(filePath, newPath);
      filePath = newPath;

      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);

      if (pdfData.text.trim().length > 50) {
        // ✅ Normal PDF with text
        extractedText = pdfData.text;

        const completion = await client.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a summarizer." },
            {
              role: "user",
              content: `Summarize the following document:\n\n${extractedText}. I want only the credit score and no other content. Give in json format strictly`,
            },
          ],
        });

        summary = completion.choices[0].message.content;
      } else {
        // ❌ Scanned PDF → convert to images
        const images = await pdfToImages(filePath);
        console.log("images :", images)

        let visionResults = [];
        for (const imgPath of images) {
          const base64Img = fs.readFileSync(imgPath).toString("base64");

          const completion = await client.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "user",
                content: [
                  { type: "text", text: "Extract and summarize the text from this page:" },
                  { type: "image_url", image_url: { url: `data:image/png;base64,${base64Img}` } },
                ],
              },
            ],
          });

          visionResults.push(completion.choices[0].message.content);
        }

        console.log("visionResults :", visionResults)

        extractedText = visionResults.join("\n\n");
        summary = extractedText.length > 500
          ? (await client.chat.completions.create({
              model: "gpt-4o-mini",
              messages: [
                { role: "system", content: "You are a summarizer." },
                {
                  role: "user",
                  content: `Summarize this multi-page document:\n\n${extractedText}`,
                },
              ],
            })).choices[0].message.content
          : extractedText;
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

app.listen(5500, () => console.log("✅ Server running on port 5000"));
