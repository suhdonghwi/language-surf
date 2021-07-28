import languageJson from "./json/language.json";
import influenceJson from "./json/influence.json";

export default interface Language {
  label: string;
  description: string;

  wikipedia_pageid: number;
  inception: {
    time: Date;
    precision: number;
  } | null;
  paradigm: number[];
  typing: number[];
}

export const languageData: Record<string, Language> = {};

for (const [id, rawData] of Object.entries(languageJson)) {
  languageData[id] = {
    ...rawData,
    inception:
      rawData.inception == null
        ? null
        : {
            time: new Date(rawData.inception.time),
            precision: rawData.inception.precision,
          },
  };
}

export const influenceData: { source: number; target: number }[] =
  influenceJson;
