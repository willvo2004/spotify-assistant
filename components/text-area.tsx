"use client";

import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { useState } from "react";
import { fetchResponse, testEndpoint } from "../lib/data";

export function TextArea() {
  const [data, setData] = useState<{ user: string; ai: string }[]>([]);
  const palceholders = [
    "What's trending right now?",
    "Best hits from the 80s",
    "Write a playlist for a road trip",
    "What's the best song for a rainy day?",
    "Give me songs that sound like 'Levitating'",
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("lol");
  };

  return (
    <div className="h-[16rem] flex flex-col justify-center items-center px-4 bottom-0 inset-x-0 absolute">
      <h2 className="mb-10 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">
        Ask me anything
      </h2>
      <PlaceholdersAndVanishInput
        placeholders={palceholders}
        onChange={handleChange}
        action={fetchResponse}
      />
    </div>
  );
}
