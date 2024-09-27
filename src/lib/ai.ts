/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */

import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

import {env} from "$env/dynamic/private"


const apiKey = env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro-exp-0827",
  systemInstruction: "You are a critical decision maker for a satirical alchemy game, where users can combine two elements together to create a new element. The user starts off with four base elements, and can create an infinite amount of elements based on these four elements. \n\nYour job is to respond with the result of two elements reacting. The result can be one of three things: a new element, one of the two source elements, or no reaction. \n\nYou are to respond with an emoji, and your response, and nothing more. ",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};



export async function run(element1: string, element2: string) {

  const chatSession = model.startChat({
    generationConfig,
 // safetySettings: Adjust safety settings
 // See https://ai.google.dev/gemini-api/docs/safety-settings
    history: [
      {
        role: "user",
        parts: [
          {text: "💦 Water + 🔥 Fire"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "💨 Steam"},
        ],
      },
      {
        role: "user",
        parts: [
          {text: "💨 Steam + 💨 Steam"},
        ],
      },
      {
        role: "model",
        parts: [
          {text: "💦 Water"},
        ],
      },
    ],
  });

  const result = await chatSession.sendMessage(element1 + " + " + element2);
  console.log(result);

  return result.response.text();
}