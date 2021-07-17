import { useMemo } from "react";
import { Container, useApp, useTick } from "@inlet/react-pixi";

import Graph from "graphology";
import { random } from "graphology-layout";
import forceAtlas2 from "graphology-layout-forceatlas2";
import noverlap from "graphology-layout-noverlap";

import Node from "./Node";
import Link from "./Link";
import { Viewport } from "pixi-viewport";

interface NetworkProps {
  graph: Graph;
}

export default function Network({ graph }: NetworkProps) {
  useMemo(() => {
    random.assign(graph, { scale: 1000, center: 0 });
    forceAtlas2.assign(graph, {
      iterations: 1,
      settings: {
        gravity: 0.1,
      },
    });
    noverlap.assign(graph, {
      maxIterations: 100,
      settings: { margin: 2 },
    });
  }, [graph]);

  const app = useApp();
  useTick(() => {
    const viewport = app.stage.children[0] as Viewport;
    // console.log(viewport.getVisibleBounds());
  });

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
          label={graph.getNodeAttribute(key, "name")}
          showLabel={false}
        />
      ))}
    </Container>
  );
}
