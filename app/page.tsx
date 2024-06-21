import { ModeToggle } from "@/components/mode-button";
import { TextArea } from "@/components/text-area";
import { RealTimeIframes } from "@/components/iframes-provider";
import Image from "next/image";

export default function Home() {
  // will add mode toggle to the navbar when its done
  return (
    <>
      <ModeToggle />
      <RealTimeIframes />
      <TextArea />
    </>
  );
}
