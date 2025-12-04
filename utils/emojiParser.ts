
import { emojiMap } from "./emojiMapping";

export interface ParsedItem {
  type: "emoji" | "text";
  src?: any;
  content?: string;
  key: number;
}

export function parseEmojiMessage(text: string): ParsedItem[] {
  const regex = /(:\w+:)/g;
  const parts = text.split(regex);

  return parts
    .map((part, index) => {
      if (emojiMap[part]) {
        return {
          type: "emoji" as const,
          src: emojiMap[part],
          key: index,
        };
      }
      if (part.trim()) {
        return {
          type: "text" as const,
          content: part,
          key: index,
        };
      }
      return null;
    })
    .filter((item): item is ParsedItem => item !== null);
}
