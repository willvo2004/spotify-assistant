"use server";

import OpenAI from "openai";
import axios from "axios";
import { createClient } from "@/utils/supabase/server";
import { cookies } from "next/headers";

type LinksJson = {
  spotify_url: string[];
};

type oembedResponse = {
  html: string;
  width: number;
  height: number;
  provider_name: string;
  iframe_url: string;
};

const cookieStore = cookies();
const supabase = createClient(cookieStore);

export async function fetchResponse(prompt: string): Promise<void> {
  const openai = new OpenAI({ apiKey: process.env.OPEN_AI_KEY });

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        content: "you answer in short ordered lists. Always add artist name",
      },
      { role: "user", content: prompt },
    ],
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
      await fetchTracks(jsonFormatedContent);
    } catch (error) {
      console.log("An error occured while crawling for tracks:", error);
    }
  }
}

export async function fetchTracks(query: string): Promise<void> {
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

    const { error } = await supabase
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

export async function fetchEmbed(request: LinksJson) {
  const { spotify_url } = request;
  let oembedUriList = [];

  for (const link of spotify_url) {
    try {
      const response = await axios.get("https://open.spotify.com/oembed?", {
        params: {
          url: link,
        },
      });
      const data = response.data as oembedResponse;
      oembedUriList.push(data.iframe_url);
    } catch (error) {
      console.log("Error returning oembed: ", error);
    }
  }
  return oembedUriList;
}

export async function testSupaBase() {
  console.log("Querying the database");
  let { data: test } = await supabase.from("UrlStore").select("*");

  const {
    data: { user },
  } = await supabase.auth.getUser();
  console.log(user);
  console.log(test);
}
