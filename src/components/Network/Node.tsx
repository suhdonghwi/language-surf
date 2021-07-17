import { Container, Graphics, Text } from "@inlet/react-pixi";
import { TextStyle } from "pixi.js";
import { useCallback } from "react";

interface NodeProps {
  x: number;
  y: number;
  radius: number;
  label: string;
  showLabel: boolean;
}

export default function Node({ x, y, radius, label, showLabel }: NodeProps) {
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
      <Graphics draw={draw} />
      {showLabel && (
        <Text
          x={radius + 3}
          y={-6}
          text={label}
          resolution={4}
          style={
            new TextStyle({
              fontFamily: '"Source Sans Pro", Helvetica, sans-serif',
              fontSize: 10,
            })
          }
        />
      )}
    </Container>
  );
}
