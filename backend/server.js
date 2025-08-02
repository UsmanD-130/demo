import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import morgan from "morgan"
import ConnectionDB from "./db.js";

const PORT = process.env.PORT;

await ConnectionDB();


const app = express()
dotenv.config()
app.use(express.json())
app.use(cors())
app.use(morgan("dev"))


app.get("/", (req,res) => {
    res.send("Welcome to server")
})

app.listen(PORT, ()=> {
    console.log(`Server started at port : ${PORT}`)
})

