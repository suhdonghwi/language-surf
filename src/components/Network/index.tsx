import { useEffect, useState } from "react";
import * as d3 from "d3-force";
import { Container } from "@inlet/react-pixi";

import Node, { NodeProps } from "./Node";

interface NetworkProps {
  data: NodeProps[];
}

export default function Network({ data }: NetworkProps) {
  const [nodes, setNodes] = useState<NodeProps[]>([]);

  useEffect(() => {
    d3.forceSimulation(data)
      .force("collide", d3.forceCollide(10))
      .force("charge", d3.forceManyBody())
      .on("tick", () => {
        setNodes([...data]);
      });
  }, [data]);

  return (
    <Container>
      {nodes.map((node, i) => (
        <Node key={i} {...node} />
      ))}
    </Container>
  );
}
