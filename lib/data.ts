"use server";

import OpenAI from "openai";
import axios from "axios";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

const cookieStore = cookies();
const supabase = createClient(cookieStore);

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
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: messages,
        tools: tools,
      });
      const responseMessage = response.choices[0].message;

      // Begin the tool call. Do I need more functions?
      const toolCalls = responseMessage.tool_calls;
      if (responseMessage.tool_calls) {
        const availableFunctions = {
          get_tracks: fetchTracks,
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
      }
    } catch (error) {
      console.error("error occured --------- : ", error);
      console.log("messages -------- : ", messages);
    }
  }
}

export async function fetchTracks(query: string) {
  try {
    const response = await axios.get("http://127.0.0.1:5000/api/tracks", {
      params: {
        query: query,
      },
    });
    console.log(response.data);

    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { data, error } = await supabase
      .from("UrlStore")
      .insert([{ spotify_links: response.data, user: user?.id }])
      .select();

    if (error) {
      console.log(error);
    }
  } catch (error) {
    console.error(error);
  }
}

export async function testSupaBase() {
  console.log("Querying the database");
  let { data: test } = await supabase.from("UrlStore").select("*");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("UrlStore")
    .insert([{ user: user?.id }])
    .select();
  console.log(data, error, user);
  console.log(test);
}
