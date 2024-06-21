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
    <>
      {iframesList.length >= 1 ? (
        <ScrollArea className="h-[800px] w-1/2 rounded-md  absolute left-[600px]">
          {array.map((iframeSrc, index) => (
            <div key={index} className="p-4 pl-12">
              <iframe
                className="rounded-xl"
                key={index}
                src={iframeSrc}
                title={`iframe-${index}`}
                width="70%"
                height="352"
                loading="lazy"
              />
            </div>
          ))}
        </ScrollArea>
      ) : null}
    </>
  );
}
