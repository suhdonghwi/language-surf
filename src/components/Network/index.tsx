import { useMemo } from "react";
import { Container } from "@inlet/react-pixi";

import Graph from "graphology";
import { circlepack } from "graphology-layout";

import Node from "./Node";
import Link from "./Link";

interface NetworkProps {
  graph: Graph;
}

export default function Network({ graph }: NetworkProps) {
  useMemo(() => {
    circlepack.assign(graph, { scale: 30 });
    console.log(graph.getNodeAttributes("0"));
  }, [graph]);

  return (
    <Container>
      {graph.edges().map((key) => (
        <Link
          key={key}
          sourceX={graph.getNodeAttribute(graph.source(key), "x")}
          sourceY={graph.getNodeAttribute(graph.source(key), "y")}
          targetX={graph.getNodeAttribute(graph.target(key), "x")}
          targetY={graph.getNodeAttribute(graph.target(key), "y")}
        />
      ))}

      {graph.nodes().map((key) => (
        <Node
          key={key}
          x={graph.getNodeAttribute(key, "x")}
          y={graph.getNodeAttribute(key, "y")}
        />
      ))}
    </Container>
  );
}
