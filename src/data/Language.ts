import languageJson from "./json/language.json";
import influenceJson from "./json/influence.json";

export default interface Language {
  name: string;
  wikipedia_pageid: number;
  inception: {
    time: Date;
    precision: number;
  } | null;
  paradigm: number[];
  typing: number[];
}

export const languageData: Record<number, Language> = {};

for (const [id, raw_data] of Object.entries(languageJson)) {
  languageData[Number(id)] = {
    ...raw_data,
    inception:
      raw_data.inception == null
        ? null
        : {
            time: new Date(raw_data.inception.time),
            precision: raw_data.inception.precision,
          },
  };
}

export const influenceData: { source: number; target: number }[] =
  influenceJson;
