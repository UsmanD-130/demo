import OpenAI from "openai";
import dotenv from "dotenv"

dotenv.config()

const openai = new OpenAI({
  apiKey: process.env.MY_TEST_API_KEY,
});

const response = openai.responses.create({
  model: "gpt-4o-mini",
  input: "write in short about usman",
  store: true,  
});

response.then((result) => console.log(result.output_text));