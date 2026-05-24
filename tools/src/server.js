import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";

const api_key = process.env.GEMINI_API_KEY;
const googleAI = new GoogleGenAI({ apiKey: api_key });

const context = [
  {
    role: "user",
    parts: [{ text: "What is the current time in New York?" }]
  }
];

// Tool function
function getCurrentTime() {
  const now = new Date();
  return now.toLocaleTimeString("en-US", {
    timeZone: "America/New_York"
  });
}

async function callGeminiTools() {

  const response = await googleAI.models.generateContent({
    model: "gemini-2.0-flash",
    contents: context,
    tools: [
      {
        functionDeclarations: [
          {
            name: "getCurrentTime",
            description: "Get the current time in New York",
          },
        ],
      },
    ],
  });

  // Check if Gemini wants to call tool
  const functionCall =
    response?.candidates?.[0]?.content?.parts?.find(
      (p) => p.functionCall
    )?.functionCall;

  if (functionCall) {
    console.log("Gemini wants to call:", functionCall.name);

    if (functionCall.name === "getCurrentTime") {
      const currentTime = getCurrentTime();

      // Send tool response back
      const final = await googleAI.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [
          ...context,
          {
            role: "tool",
            parts: [
              {
                functionResponse: {
                  name: "getCurrentTime",
                  response: { time: currentTime },
                },
              },
            ],
          },
        ],
      });

      console.log("Final Answer:", final.text);
    }
  } else {
    console.log(response.text);
  }
}

callGeminiTools();