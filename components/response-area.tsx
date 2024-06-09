import { ScrollArea } from "@/components/ui/scroll-area";

export function ResponseArea({
  data,
}: {
  data: { user: string; ai: string }[];
}) {
  return (
    <ScrollArea className="h-[16rem] flex flex-col justify-end items-end px-4 bottom-0 inset-x-0 absolute">
      {data.map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-end w-full max-w-[80%] mb-2"
        >
          <p className="text-right text-sm dark:text-white text-black">
            {item.user}
          </p>
          <p className="text-right text-sm dark:text-white text-black">
            {item.ai}
          </p>
        </div>
      ))}
    </ScrollArea>
  );
}
