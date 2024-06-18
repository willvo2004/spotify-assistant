"use client";

import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { useState, useEffect, useRef } from "react";
import { fetchResponse, testSupaBase } from "../lib/data";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "@/utils/hooks/useUser";

export function TextArea() {
  const [content, setContent] = useState<{ user: string; ai: string }[]>([]);
  const supabase = createClient();
  const { isAnonymous, user, isReady } = useUser();
  const isCreatingAnonUser = useRef<boolean>(false);

  useEffect(() => {
    if (isReady && !user) {
      if (isCreatingAnonUser.current) return;

      isCreatingAnonUser.current = true;
      supabase.auth
        .signInAnonymously()
        .then((result) => {
          isCreatingAnonUser.current = false;
          console.log("did");
        })
        .catch((err) => {
          console.log("could not", err);
        });
    }
  }, [isReady, user, supabase.auth]);
  // how to get user id?
  const palceholders = [
    "What's trending right now?", // maybe don't ask this unless you wanna wait for 20 seconds
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
