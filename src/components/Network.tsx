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
    let influencedToEdges: Set<string> = new Set(),
      influencedToNodes: Set<string> = new Set();
    let influencedByEdges: Set<string> = new Set(),
      influencedByNodes: Set<string> = new Set();

    const renderer = new Sigma(graph, containerRef.current, {
      defaultEdgeColor,
      defaultNodeColor,
      defaultEdgeType: "arrow",
      zIndex: true, // NOT WORKING
      labelColor: "#212529",
      nodeReducer: (key, data) => {
        key = key.toString();

        if (highlightNode === null) {
          return data;
        }

        if (highlightNode === key) {
          return { ...data, color: "#12b886" };
        } else if (influencedToNodes.has(key)) {
          return { ...data, color: "#1c7ed6" };
        } else if (influencedByNodes.has(key)) {
          return { ...data, color: "#f03e3e" };
        } else {
          return { ...data, color: defaultEdgeColor, label: "" };
        }
      },
      edgeReducer: (key, data) => {
        key = key.toString();

        if (highlightNode === null) {
          return data;
        }

        if (influencedToEdges.has(key)) {
          return {
            ...data,
            color: "#1c7ed6",
            size: 1.5,
            z: 99,
          };
        } else if (influencedByEdges.has(key)) {
          return {
            ...data,
            color: "#f03e3e",
            size: 1.5,
            z: 99,
          };
        } else {
          return data;
        }
      },
    });

    renderer.on("enterNode", (e) => {
      highlightNode = e.node;

      for (const edge of graph.outEdges(e.node)) {
        influencedToEdges.add(edge);
        influencedToNodes.add(graph.target(edge));
      }

      for (const edge of graph.inEdges(e.node)) {
        influencedByEdges.add(edge);
        influencedByNodes.add(graph.source(edge));
      }

      renderer.refresh();
    });

    renderer.on("leaveNode", (e) => {
      highlightNode = null;
      influencedToEdges.clear();
      influencedToNodes.clear();

      influencedByEdges.clear();
      influencedByNodes.clear();

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
