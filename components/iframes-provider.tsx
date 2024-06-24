"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/utils/supabase/client"; // Ensure this client-side Supabase instance
import { fetchEmbed } from "@/lib/data";
import { DisplayIframes } from "@/components/display-iframes";

export function RealTimeIframes() {
  const [iFrameList, setIFrameList] = useState<string[]>([]);

  useEffect(() => {
    const supabase = createClient(); // Initialize client-side Supabase instance

    const channel = supabase
      .channel("links")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "UrlStore" },
        async (payload) => {
          const spotifyOpenList = payload.new.spotify_links;
          const newIFrameList = await fetchEmbed(spotifyOpenList);
          setIFrameList((prevList) => [...prevList, ...newIFrameList]);
          console.log(newIFrameList);
        },
      )
      .subscribe();

    // Cleanup function to unsubscribe from the channel when the component unmounts
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return <DisplayIframes iframes={iFrameList} />;
}
