import paradigmJson from "./json/paradigm.json";

export default interface Paradigm {
  name: string;
  description: string;
}

export const paradigmData: Record<string, Paradigm> = {};

for (const [id, rawData] of Object.entries(paradigmJson)) {
  paradigmData[id] = rawData;
}
