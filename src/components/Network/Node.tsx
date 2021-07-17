import { Graphics } from "@inlet/react-pixi";
import { useCallback } from "react";

interface NodeProps {
  x: number;
  y: number;
  radius: number;
}

export default function Node({ x, y, radius }: NodeProps) {
  const draw = useCallback(
    (g) => {
      g.clear();
      g.beginFill(0x212529);
      g.drawCircle(x, y, radius);
      g.endFill();
    },
    [x, y, radius]
  );

  return <Graphics draw={draw} />;
}
