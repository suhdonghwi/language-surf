import { useMemo } from "react";

import { DirectedGraph } from "graphology";

import { languageData, influenceData } from "../data/Language";
import Network from "./Network";
import NodeAttribute from "../data/NodeAttribute";

export default function LanguageNetwork() {
  const graph = useMemo(() => {
    const g = new DirectedGraph<NodeAttribute>();

    for (const [id, data] of Object.entries(languageData)) {
      g.addNode(id, { label: data.label, lang: data });
    }

    for (const { source, target } of influenceData) {
      g.addEdge(source, target, { z: 0 });
    }

    g.forEachNode((key) => {
      g.setNodeAttribute(key, "size", 3 + 0.15 * g.outDegree(key));
    });

    return g;
  }, []);

  return <Network graph={graph} />;
}
