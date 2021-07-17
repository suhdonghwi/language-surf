import { useMemo } from "react";

import { DirectedGraph } from "graphology";

import Language, { languageData, influenceData } from "../data/Language";
import Network from "./Network";

export default function LanguageNetwork() {
  const graph = useMemo(() => {
    const g = new DirectedGraph<Language>();

    for (const [id, data] of Object.entries(languageData)) {
      g.addNode(id, data);
    }

    for (const { source, target } of influenceData) {
      g.addEdge(source, target);
    }

    g.forEachNode((key) => {
      g.setNodeAttribute(key, "size", 3 + 0.1 * g.outDegree(key));
    });

    return g;
  }, []);

  return <Network graph={graph} />;
}
