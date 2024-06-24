"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useState, useEffect } from "react";

export function DisplayIframes({ iframes }: { iframes: string[] | undefined }) {
  const [iframesList, setIframesList] = useState<string[]>([]);

  useEffect(() => {
    if (iframes) {
      setIframesList((prevIframesList) => [...prevIframesList, ...iframes]);
    }
  }, [iframes]);
  const set = new Set(iframesList);
  const array = Array.from(set);
  return (
    <div className="flex min-h-[100px] h-[740px] overflow-clip justify-center relative">
      {iframesList.length >= 1 ? (
        <ScrollArea className="h-full md:h-full sm:h-[650px] pb-2 w-full md:w-1/2 rounded-md">
          {array.map((iframeSrc, index) => (
            <div key={index} className="p-4 pl-2 md:pl-12">
              <iframe
                className="rounded-2xl"
                key={index}
                src={iframeSrc}
                title={`iframe-${index}`}
                width="100%"
                height="352" // Adjust height for better mobile experience
                loading="lazy"
              />
            </div>
          ))}
        </ScrollArea>
      ) : null}
    </div>
  );
}
