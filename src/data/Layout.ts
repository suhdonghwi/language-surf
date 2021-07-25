import { random } from "graphology-layout";
import forceAtlas2 from "graphology-layout-forceatlas2";
import noverlap from "graphology-layout-noverlap";

import { LanguageGraph } from "./NodeAttribute";

export type LayoutMapping = Record<string, { x: number; y: number }>;
export type LayoutResult = { name: string; mapping: LayoutMapping };

class Layout {
  private _name: string;
  private _mapper: (graph: LanguageGraph) => LayoutMapping;

  constructor(
    name: string,
    mapLayout: (graph: LanguageGraph) => LayoutMapping
  ) {
    this._name = name;
    this._mapper = mapLayout;
  }

  calculate(graph: LanguageGraph): LayoutResult {
    return { name: this._name, mapping: this._mapper(graph) };
  }

  name(): string {
    return this._name;
  }
}

const layouts = [
  new Layout("Force-based layout", (g) => {
    const temp = g.copy();
    random.assign(temp, { center: 0, scale: 100 });
    forceAtlas2.assign(temp, {
      iterations: 100,
      settings: {
        gravity: 1,
        barnesHutOptimize: true,
        adjustSizes: true,
      },
    });
    return noverlap(temp, 100);
  }),
  new Layout("Random layout", (g) => random(g, { center: 0, scale: 500 })),
  new Layout("Timeline layout", (g) => {
    const languageMap: Record<number, string[]> = {};
    g.forEachNode((key) => {
      const inception = g.getNodeAttributes(key).lang.inception;
      if (inception === null || inception.precision !== 9) return;

      const year = inception.time.getFullYear();
      if (languageMap[year] === undefined) languageMap[year] = [key];
      else languageMap[year].push(key);
    });

    const mapping: LayoutMapping = {};
    for (const [year, langs] of Object.entries(languageMap)) {
      langs.sort((a, b) => g.outDegree(b) - g.outDegree(a));

      let i = 0;
      for (const lang of langs) {
        mapping[lang] = { y: (1984 - Number(year)) * 10, x: i * 10 };
        i--;
      }
    }

    return mapping;
  }),
];

export default layouts;
