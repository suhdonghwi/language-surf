import { useMemo } from "react";
import { Container } from "@inlet/react-pixi";

import Graph from "graphology";
import { random } from "graphology-layout";

import Node from "./Node";
import Link from "./Link";

interface NetworkProps {
  graph: Graph;
}

export default function Network({ graph }: NetworkProps) {
  useMemo(() => {
    random.assign(graph, { scale: 500, center: 0 });

    /*forceAtlas2.assign(graph, {
      iterations: 50,
      settings: {
        gravity: 0.5,
        adjustSizes: true,
        barnesHutOptimize: true,
      },
    });
    noverlap.assign(graph, {
      maxIterations: 100,
    });*/
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
