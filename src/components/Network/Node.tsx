import { Graphics } from "@inlet/react-pixi";
import { useCallback } from "react";

interface NodeProps {
  x?: number;
  y?: number;
}

export default function Node({ x, y }: NodeProps) {
  const draw = useCallback((g) => {
    g.clear();
    g.beginFill(0xff0000);
    g.drawCircle(0, 0, 10);
    g.endFill();
  }, []);

  return <Graphics x={x} y={y} draw={draw} />;
}
