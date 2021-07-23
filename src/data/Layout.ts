import Graph from "graphology";
import { random } from "graphology-layout";
import forceAtlas2 from "graphology-layout-forceatlas2";
import noverlap from "graphology-layout-noverlap";

export type LayoutMapping = Record<string, { x: number; y: number }>;
export type LayoutResult = { name: string; mapping: LayoutMapping };

class Layout {
  private _name: string;
  private _mapper: (graph: Graph) => LayoutMapping;

  constructor(name: string, mapLayout: (graph: Graph) => LayoutMapping) {
    this._name = name;
    this._mapper = mapLayout;
  }

  calculate(graph: Graph): LayoutResult {
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
];

export default layouts;
