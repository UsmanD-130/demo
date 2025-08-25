import express from "express";
import multer from "multer";
import fs from "fs";
import pdfParse from "pdf-parse";
import { extractCibilDetails } from "../services/cibilParser.js";
import { analyzeWithAI } from "../services/aiService.js";

const uploadRoutes = express.Router();
const upload = multer({ dest: "uploads/" });

// Upload + Prediction API
uploadRoutes.post("/predict", upload.single("file"), async (req, res) => {
  try {
    const filePath = req.file.path;

    // Extract text
    const dataBuffer = fs.readFileSync(filePath);
    const pdfData = await pdfParse(dataBuffer);
    const extractedText = pdfData.text;

    // Parse details
    const details = extractCibilDetails(extractedText);

    // Simple prediction (rule-based)
    let prediction = "Unknown";
    if (details.score) {
      const score = parseInt(details.score, 10);
      if (score < 650) prediction = "High Risk";
      else if (score < 750) prediction = "Medium Risk";
      else prediction = "Low Risk";
    }

    // AI insights (optional, comment if not needed)
    let aiAnalysis = null;
    try {
      aiAnalysis = await analyzeWithAI(extractedText);
    } catch (err) {
      console.warn("AI analysis skipped:", err.message);
    }

    // Clean up file
    fs.unlinkSync(filePath);

    res.json({ details, prediction, aiAnalysis });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to predict" });
  }
});

export default uploadRoutes;
