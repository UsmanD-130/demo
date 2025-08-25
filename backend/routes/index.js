import express from "express";
import fileRoutes from "./fileRoutes.js";
import fileUpload from "./upload.js";

const AllRoutes = express.Router();


AllRoutes.use("/file", fileRoutes)
AllRoutes.use("/upload", fileUpload)

export default AllRoutes;