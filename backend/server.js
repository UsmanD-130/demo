import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import morgan from "morgan"
import ConnectionDB from "./db.js";
import AllRoutes from "./routes/index.js";
import multer from "multer";

const PORT = process.env.PORT;

await ConnectionDB();


const app = express()
app.use(cors())
const upload = multer({ dest: "uploads/" }); // temp storage

dotenv.config()
app.use(express.json())
app.use(morgan("dev"))


app.get("/", (req,res) => {
    res.send("Welcome to server")
})



app.use("/api", AllRoutes)

app.listen(PORT, ()=> {
    console.log(`Server started at port : ${PORT}`)
})

