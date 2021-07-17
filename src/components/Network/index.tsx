import { useCallback, useEffect, useMemo, useState } from "react";
import { Container, useApp } from "@inlet/react-pixi/animated";

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
  const [labeledNodes, setLabeledNodes] = useState<string[]>([]);

  useEffect(() => {
    const viewport = app.stage.children[0] as Viewport;

    function updateLabeledNodes() {
      const nodes: string[] = [];
      graph.forEachNode((key) => {
        const x = graph.getNodeAttribute(key, "x");
        const y = graph.getNodeAttribute(key, "y");

        if (viewport.getVisibleBounds().contains(x, y)) {
          nodes.push(key);
        }
      });
      nodes.sort((a, b) => graph.outDegree(b) - graph.outDegree(a));

      setLabeledNodes(nodes.slice(0, 10));
    }

    viewport.on("drag-end", updateLabeledNodes);
    //viewport.on("zoomed-end", updateLabeledNodes);
    updateLabeledNodes();

    return () => {
      viewport.removeAllListeners();
    };
  }, [graph, app.stage.children]);

  const [hoverNode, setHoverNode] = useState<string | null>(null);
  const onMouseover = useCallback((key) => {
    setHoverNode(key);
  }, []);
  const onMouseout = useCallback((key) => {
    setHoverNode(null);
  }, []);

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
          showLabel={labeledNodes.includes(key)}
          onMouseover={() => onMouseover(key)}
          onMouseout={() => onMouseout(key)}
          highlight={key === hoverNode}
        />
      ))}
    </Container>
  );
}
