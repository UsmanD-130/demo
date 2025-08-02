import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config();

const ConnectionDB = async () => {
    try{
        const connection = await mongoose.connect(process.env.MONGO_URI)

    }catch(error){
        console.log("Mongo DB Connection error : ", error)
        process.exit(1)
    }

}

export default ConnectionDB;