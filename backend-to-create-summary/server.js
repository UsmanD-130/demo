import express from "express";
import multer from "multer";
import fs from "fs";
import pdfParse from "pdf-parse";
import { extractCibilDetails, extractTextFromPDF } from "./services/cibilParser.js";
import cors from "cors"

const app = express();
app.use(cors())
const upload = multer({ dest: "uploads/" }); // stores files in /uploads


app.get("/", (req,res) => {
    res.send("Welcome")
})

app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;

    // Use the combined parser (pdf-parse + OCR fallback)
    const extractedText = await extractTextFromPDF(filePath);

    // Extract structured details
    const details = extractCibilDetails(extractedText);

    // Delete temp file after processing
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.json({ details, extractedText });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ error: "Failed to process document" });
  }
});


app.listen(8000,()=> {
    console.log("Server started at port 8000")
})
