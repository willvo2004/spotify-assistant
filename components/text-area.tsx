"use client";

import { PlaceholdersAndVanishInput } from "./ui/placeholders-and-vanish-input";
import { useEffect, useRef, useState } from "react";
import { fetchResponse, testSupaBase, fetchEmbed } from "../lib/data";
import { createClient } from "@/utils/supabase/client";
import { useUser } from "@/utils/hooks/useUser";

export function TextArea() {
  const { isAnonymous, user, isReady } = useUser();
  const [loading, setLoading] = useState(false);
  const isCreatingAnonUser = useRef<boolean>(false);
  const supabase = createClient();

  useEffect(() => {
    if (isReady && !user) {
      if (isCreatingAnonUser.current) return;

      isCreatingAnonUser.current = true;
      supabase.auth
        .signInAnonymously()
        .then((result) => {
          isCreatingAnonUser.current = false;
          console.log("did", result);
        })
        .catch((err) => {
          console.log("could not", err);
        });
    }
  }, [isReady, user, supabase.auth]);

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

  const handleAction = async (input: string) => {
    console.log("Action started. Input:", input, "loading", loading);
    setLoading(true);
    try {
      await fetchResponse(input);
      console.log("Action completed.");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log("Loading state changed:", loading);
  }, [loading]);

  return (
    <div className="h-fit sm:h-[16rem] flex flex-col justify-center items-center px-4 bottom-0 inset-x-0 absolute">
      <h2 className="mb-2 sm:mb-20 text-xl text-center sm:text-5xl dark:text-white text-black">
        {loading ? <p>Loading...</p> : <p>Ask me anything</p>}
      </h2>
      <PlaceholdersAndVanishInput
        placeholders={palceholders}
        onChange={handleChange}
        action={handleAction}
      />
    </div>
  );
}
