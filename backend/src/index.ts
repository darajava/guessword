import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { OpenAIClient } from "./openai";
import OpenAI from "openai";
dotenv.config();

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/", (_, res) => {
  res.send("Hello world");
});

app.get("/word", async (_, res) => {
  const words = [
    "chef",
    "fault",
    "pilot",
    "bench",
    "brick",
    "cable",
    "storm",
    "shelf",
    "toast",
    "wallet",
    "ladder",
    "screen",
    "crowd",
    "fence",
    "pocket",
    "butter",
    "elbow",
    "ankle",
    "blanket",
    "hammer",
    "bottle",
    "carpet",
    "folder",
    "drawer",
    "jacket",
    "window",
    "pillow",
    "tunnel",
    "mirror",
    "ticket",
    "basket",
    "tomato",
    "cousin",
    "castle",
    "spoon",
    "puzzle",
    "garage",
    "onion",
    "button",
    "prison",
    "circle",
    "remote",
    "pepper",
    "magnet",
    "kettle",
    "rubber",
    "pencil",
    "rocket",
    "candle",
    "singer",
    "doctor",
    "engine",
    "police",
    "wallet",
    "dentist",
    "camera",
    "bucket",
    "ladder",
    "farmer",
    "planet",
    "island",
    "forest",
    "desert",
    "fabric",
    "sunset",
    "thunder",
    "shadow",
    "market",
    "sponge",
    "pillow",
    "wallet",
    "ticket",
    "hammer",
    "circle",
    "engine",
    "garage",
    "pepper",
    "prison",
    "singer",
    "bucket",
    "cousin",
    "dentist",
    "drawer",
    "elbow",
    "pocket",
    "rocket",
    "button",
    "castle",
    "kettle",
    "sponge",
    "sunset",
    "thunder",
    "farmer",
    "carpet",
    "jacket",
    "mirror",
    "puzzle",
    "doctor",
    "forest",
    "blanket",
  ];

  const word = words[Math.floor(Math.random() * words.length)];
  res.send({ word });
});

app.post("/guess", async (req, res) => {
  const guess = req.body.guess;
  const answer = req.body.answer;
  const wordsGuessed = JSON.parse(req.body.wordsGuessed);
  const prompt = `the word is "${answer}"

the guess is "${guess}"

your job is to say one of "cold", "warm", "hot", "very hot". depending on how close the guess is.

if the word is inappropiate, say "WTF", but only if it's a bad word. it if makes no sense, still try to apply one of "cold", "warm", "hot", "very hot".

if the word is exactly "${answer}", say "correct".

return in json format:

{
  response: "",
  isGuessAValidEnglishWord: true/false
}`;

  console.log(prompt);

  const response = await OpenAIClient.complete({
    prompt,
  });

  res.send({
    response: response.response,
    isGuessAValidEnglishWord: response.isGuessAValidEnglishWord,
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
