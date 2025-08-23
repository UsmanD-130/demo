import express from "express";
import fileRoutes from "./fileRoutes.js";

const AllRoutes = express.Router();


AllRoutes.use("/file", fileRoutes)

export default AllRoutes;