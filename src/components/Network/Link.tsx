import React from "react";
import { Graphics } from "@inlet/react-pixi/animated";
import { useCallback } from "react";

interface LinkProps {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}

function Link({ sourceX, sourceY, targetX, targetY }: LinkProps) {
  const draw = useCallback(
    (g) => {
      g.clear();
      g.lineStyle(1, 0x343a40, 0.05)
        .moveTo(sourceX, sourceY)
        .lineTo(targetX, targetY);
    },
    [sourceX, sourceY, targetX, targetY]
  );

  return <Graphics draw={draw} />;
}

export default React.memo(Link);
