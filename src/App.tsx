import { useMemo } from "react";

import Language, { languageData, influenceData } from "./data/Language";

import { DirectedGraph } from "graphology";
import Network from "./components/Network";

function App() {
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

export default App;
