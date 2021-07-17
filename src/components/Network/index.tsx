import { useMemo } from "react";
import { Container } from "@inlet/react-pixi";

import Graph from "graphology";
import { circlepack, circular, random } from "graphology-layout";
import forceAtlas2 from "graphology-layout-forceatlas2";
import noverlap from "graphology-layout-noverlap";

import Node from "./Node";
import Link from "./Link";

interface NetworkProps {
  graph: Graph;
}

export default function Network({ graph }: NetworkProps) {
  useMemo(() => {
    random.assign(graph, { scale: 100, center: 0 });
    forceAtlas2.assign(graph, {
      iterations: 20,
      settings: {
        gravity: 10,
      },
    });
    noverlap.assign(graph, {
      maxIterations: 100,
      settings: { margin: 1 },
    });
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
          radius={graph.getNodeAttribute(key, "size") / 2}
        />
      ))}
    </Container>
  );
}
