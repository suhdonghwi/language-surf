/** @jsxImportSource theme-ui */
import { useEffect, useRef } from "react";

import { DirectedGraph } from "graphology";
import { random } from "graphology-layout";
import Sigma from "sigma";
import forceAtlas2 from "graphology-layout-forceatlas2";
import NodeAttribute from "../data/NodeAttribute";

interface NetworkProps {
  graph: DirectedGraph<NodeAttribute>;
}

export default function Network({ graph }: NetworkProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current === null) return;

    random.assign(graph, { scale: 100, center: 0 });
    forceAtlas2.assign(graph, {
      iterations: 50,
      settings: {
        gravity: 1,
        barnesHutOptimize: true,
        adjustSizes: true,
      },
    });

    const defaultEdgeColor = "rgba(100, 100, 100, 0.5)",
      defaultNodeColor = "#495057";
    let highlightNode: string | null = null;

    const renderer = new Sigma(graph, containerRef.current, {
      defaultEdgeColor,
      defaultNodeColor,
      nodeReducer: (key, data) => {
        if (highlightNode !== null) {
          if (highlightNode === key) {
            return { ...data, color: "#12b886" };
          } else {
            return { ...data, color: defaultEdgeColor };
          }
        } else {
          return data;
        }
      },
    });

    renderer.on("enterNode", (e) => {
      highlightNode = e.node;
      renderer.refresh();
    });

    renderer.on("leaveNode", (e) => {
      highlightNode = null;
      renderer.refresh();
    });

    return () => {
      renderer.kill();
    };
  }, [graph]);

  return (
    <div
      ref={containerRef}
      sx={{ height: "100vh", backgroundColor: "background" }}
    />
  );
}
