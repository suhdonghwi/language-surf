import { Stage } from "@inlet/react-pixi";

import Network from "./components/Network";
import Viewport from "./components/Viewport";

function App() {
  const data = [{}, {}, {}, {}, {}];

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
        <Network data={data} />
      </Viewport>
    </Stage>
  );
}

export default App;
