import typingJson from "./json/typing.json";

export default interface Typing {
  name: string;
  description: string;
}

export const typingData: Record<string, Typing> = {};

for (const [id, rawData] of Object.entries(typingJson)) {
  typingData[id] = rawData;
}
