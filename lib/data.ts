"use server";

import OpenAI from "openai";
import axios from "axios";

export async function fetchResponse(prompt: string): Promise<void> {
  const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });
  const messages = [
    {
      role: "system",
      content:
        "you answer in short ordered lists. Always add artist name to a song",
    },
    { role: "user", content: prompt },
  ];
  const tools = [
    {
      type: "function",
      function: {
        name: "get_tracks",
        description: "Search the web for a spotify track",
        parameters: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "The name of the song, e.g From the Start by Laufey",
            },
          },
          required: ["query"],
        },
      },
    },
  ];
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: messages, // ignore error
  });
  const content = completion.choices[0].message.content;

  if (content) {
    const splitContent = content.split(/\d+\.\s*|\-\s*/);
    const formatedContent = splitContent
      .filter((s) => s.trim())
      .map((s) => s.trim());
  }
}

export async function testEndpoint(query: string) {
  try {
    const response = await axios.get("http://127.0.0.1:5000/api/tracks", {
      params: {
        query: query,
        num_results: 10,
      },
    });
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}
