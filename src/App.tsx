import { Stage, Graphics } from "@inlet/react-pixi";

function App() {
  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      options={{ resizeTo: window, backgroundColor: 0xffffff }}
    >
      <Graphics
        draw={(g) => {
          g.beginFill(0xff0000);
          g.drawRect(0, 0, 100, 100);
          g.endFill();
        }}
      />
    </Stage>
  );
}

export default App;
