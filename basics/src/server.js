import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";

const googleAI = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function ai() {
  try {
    const response = await googleAI.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [{
        role: "user",
        parts: [{ text: "Hello!" }],
      }],
    });

    console.log(response.text);
  } catch (error) {
    if (error.status === 429) {
      console.log("⚠️ Rate limit hit. Waiting 20 seconds...");
      setTimeout(ai, 20000);
    } else {
      console.error(error);
    }
  }
}

ai();