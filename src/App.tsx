import { Stage } from "@inlet/react-pixi";

import Network from "./components/Network";
import Viewport from "./components/Viewport";

import { useMemo } from "react";
import { languageData } from "./data/Language";

function App() {
  const nodeData = useMemo(
    () =>
      Object.entries(languageData).map(([id, data]) => ({
        index: Number(id),
        x: NaN,
        y: NaN,
      })),
    []
  );
  const linkData: any = [];

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
        <Network nodeData={nodeData} linkData={linkData} />
      </Viewport>
    </Stage>
  );
}

export default App;
