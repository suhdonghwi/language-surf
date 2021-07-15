import { Stage } from "@inlet/react-pixi";
import Network from "./components/Network";

function App() {
  const data = [{}, {}, {}, {}, {}];

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      options={{ resizeTo: window, backgroundColor: 0xffffff }}
    >
      <Network data={data} />
    </Stage>
  );
}

export default App;
