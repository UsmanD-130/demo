import express from "express";
import { generateSummary } from "../controllers/fileControllers.js";

const fileRoutes = express.Router()


fileRoutes.post("/generate-summary", generateSummary)


export default fileRoutes