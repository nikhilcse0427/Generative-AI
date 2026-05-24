import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai"
import promptSync from "prompt-sync"

const api_key = process.env.GEMINI_API_KEY;
const googleAI = new GoogleGenAI({ apiKey: api_key });

const input = promptSync();

const context = [];

async function chatCompletion() {
  const response = await googleAI.models.generateContent({
    model: "gemini-2.5-flash",
    contents: context
  });

  const responseMessage = response.text

  context.push({
    role: "model",  
    parts: [{ text: responseMessage }]
  });

  console.log("\nAI:", responseMessage)
}

async function ai() {
  while (true) {
    const userInput = input("\nYou: ");

    if (userInput.toLowerCase() === "exit") {
      console.log("Exiting the chat...");
      break;
    }

    context.push({
      role: "user",
      parts: [{ text: userInput }]
    });

    await chatCompletion();
  }
}

ai();