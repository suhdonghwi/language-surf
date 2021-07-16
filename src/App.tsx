import { Stage } from "@inlet/react-pixi";

import Network from "./components/Network";
import Viewport from "./components/Viewport";

import { useMemo } from "react";
import Language, { languageData, influenceData } from "./data/Language";
import { DirectedGraph } from "graphology";

function App() {
  const graph = useMemo(() => {
    const g = new DirectedGraph<Language>();

    for (const [id, data] of Object.entries(languageData)) {
      g.addNode(id, data);
    }

    for (const { source, target } of influenceData) {
      g.addEdge(source, target);
    }

    return g;
  }, []);

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      options={{ resizeTo: window, backgroundColor: 0xffffff }}
    >
      <Viewport
        screenWidth={window.innerWidth}
        screenHeight={window.innerHeight}
        worldWidth={window.innerWidth}
        worldHeight={window.innerHeight}
      >
        <Network graph={graph} />
      </Viewport>
    </Stage>
  );
}

export default App;
