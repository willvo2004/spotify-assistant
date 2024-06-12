"use server";

import OpenAI from "openai";
import axios from "axios";
import { encode } from "punycode";

export async function fetchResponse(prompt: string): Promise<void> {
  const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });
  const messages = [
    {
      role: "system",
      content: "you answer in short ordered lists. Always add artist name",
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
              description: "The list of songs to be searched",
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
    let formatedContent = splitContent
      .filter((s) => s.trim())
      .map((s) => s.trim());
    for (let i = 0; i < formatedContent.length; i++) {
      // find out how to remove nested quotations
      formatedContent[i] = formatedContent[i].replace(/"/g, "");
      console.log(formatedContent[i]);
    }
    const jsonFormatedContent = JSON.stringify(formatedContent);
    const encodedQuery = encodeURI(jsonFormatedContent);
    console.log(encodedQuery);
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
        tools: tools,
      });
      const responseMessage = response.choices[0].message;

      const toolCalls = responseMessage.tool_calls;
      if (responseMessage.tool_calls) {
        // JSON maybe be invalid, add check later
        const availableFunctions = {
          get_tracks: testEndpoint,
        };
        messages.push(responseMessage);
        for (const toolCall of toolCalls) {
          const functionName = toolCall.function.name;
          const functionToCall = availableFunctions[functionName];
          const functionArgs = jsonFormatedContent;
          const functionResponse = await functionToCall(functionArgs);
          if (functionResponse) {
            return;
          }
          messages.push({
            tool_call_id: toolCall.id,
            role: "tool",
            name: functionName,
            content: functionResponse,
          });
        }
        // const thirdResponse = await openai.chat.completions.create({
        //   model: "gpt-3.5-turbo",
        //   messages: messages,
        // });
      }
    } catch (error) {
      console.error("error occured --------- : ", error);
      console.log("messages -------- : ", messages);
    }
  }
}

export async function testEndpoint(query: string) {
  try {
    const response = await axios.get("http://127.0.0.1:5000/api/tracks", {
      params: {
        query: query,
      },
    });
    console.log(response.data);
  } catch (error) {
    console.error(error);
  }
}
