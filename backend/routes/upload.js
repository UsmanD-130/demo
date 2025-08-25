import express from "express";
import multer from "multer";
import sendToPythonService from "../helpers/pythonBridge.js";

const fileUpload = express.Router()
const upload = multer({storage : multer.memoryStorage()})

fileUpload.post("/" , upload.single('pdf'), async(req,res) => {
    try {
        const pdfBuffer = req.file.buffer;
        const result = await sendToPythonService(pdfBuffer);
        res.json(result)
    } catch (error) {
        
    }
})


export default fileUpload;