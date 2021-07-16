import { Graphics } from "@inlet/react-pixi";
import { useCallback } from "react";

interface LinkProps {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}

export default function Link({
  sourceX,
  sourceY,
  targetX,
  targetY,
}: LinkProps) {
  const draw = useCallback(
    (g) => {
      g.clear();
      g.lineStyle(3, 0xff0000)
        .moveTo(sourceX, sourceY)
        .lineTo(targetX, targetY);
    },
    [sourceX, sourceY, targetX, targetY]
  );

  return <Graphics draw={draw} />;
}
