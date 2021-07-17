import React from "react";

import { Container, Graphics, Text } from "@inlet/react-pixi";
import { Circle, TextStyle } from "pixi.js";
import { useCallback } from "react";

interface NodeProps {
  x: number;
  y: number;
  radius: number;
  label: string;
  showLabel: boolean;

  onMouseover(): void;
  onMouseout(): void;
}

function Node({
  x,
  y,
  radius,
  label,
  showLabel,
  onMouseover,
  onMouseout,
}: NodeProps) {
  const draw = useCallback(
    (g) => {
      g.clear();
      g.beginFill(0x343a40);
      g.drawCircle(0, 0, radius);
      g.endFill();
    },
    [radius]
  );

  return (
    <Container x={x} y={y}>
      <Graphics
        draw={draw}
        interactive={true}
        hitArea={new Circle(0, 0, radius)}
        mouseover={onMouseover}
        mouseout={onMouseout}
      />
      <Text
        x={radius * 1.4}
        y={-radius / 1.6}
        text={label}
        visible={showLabel}
        resolution={4}
        style={
          new TextStyle({
            align: "center",
            fontSize: radius,
          })
        }
      />
    </Container>
  );
}

export default React.memo(Node);
