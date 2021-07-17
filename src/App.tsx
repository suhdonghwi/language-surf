import { useEffect, useMemo, useRef } from "react";

import Language, { languageData, influenceData } from "./data/Language";
import Sigma from "sigma";

import { DirectedGraph } from "graphology";
import { random } from "graphology-layout";

function App() {
  const containerRef = useRef<HTMLDivElement>(null);

  const graph = useMemo(() => {
    const g = new DirectedGraph<Language>();

    for (const [id, data] of Object.entries(languageData)) {
      g.addNode(id, data);
    }

    for (const { source, target } of influenceData) {
      g.addEdge(source, target);
    }

    g.forEachNode((key) => {
      g.setNodeAttribute(key, "size", 5 + 0.5 * g.outDegree(key));
    });

    return g;
  }, []);

  useEffect(() => {
    if (containerRef.current !== null) {
      random.assign(graph, { scale: 1000, center: 0 });
      const renderer = new Sigma(graph, containerRef.current);
    }
  });

  return <div ref={containerRef} style={{ height: "100vh" }}></div>;
}

export default App;
