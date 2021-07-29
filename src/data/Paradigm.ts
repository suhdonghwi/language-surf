import paradigmJson from "./json/paradigm.json";

export default interface Paradigm {
  name: string;
  description: string;
  derived: number[];
}

export const paradigmData: Record<number, Paradigm> = {};

for (const [id, rawData] of Object.entries(paradigmJson)) {
  paradigmData[Number(id)] = rawData;
}
