import { Stage } from "@inlet/react-pixi";

import Network from "./components/Network";
import Viewport from "./components/Viewport";

function App() {
  const nodeData = [
    { index: 0, x: NaN, y: NaN, vx: NaN, vy: NaN },
    { index: 1, x: NaN, y: NaN, vx: NaN, vy: NaN },
    { index: 2, x: NaN, y: NaN, vx: NaN, vy: NaN },
    { index: 3, x: NaN, y: NaN, vx: NaN, vy: NaN },
    { index: 4, x: NaN, y: NaN, vx: NaN, vy: NaN },
  ];

  const linkData = [
    { source: nodeData[0], target: nodeData[1] },
    { source: nodeData[1], target: nodeData[2] },
  ];

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
