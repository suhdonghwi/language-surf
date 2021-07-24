/** @jsxImportSource theme-ui */
import { useEffect, useRef } from "react";

import { DirectedGraph } from "graphology";
import Sigma from "sigma";
import NodeAttribute from "../data/NodeAttribute";
import animate from "../utils/animate";
import { LayoutMapping } from "../data/Layout";

interface NetworkProps {
  graph: DirectedGraph<NodeAttribute>;
  layoutMapping: LayoutMapping;
}

export default function Network({ graph, layoutMapping }: NetworkProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current === null) return;

    const defaultEdgeColor = "rgba(100, 100, 100, 0.5)",
      defaultNodeColor = "#495057";

    graph.forEachNode((key) =>
      graph.setNodeAttribute(key, "color", defaultNodeColor)
    );

    graph.forEachEdge((key) => {
      graph.setEdgeAttribute(key, "color", defaultEdgeColor);
      graph.setEdgeAttribute(key, "size", 1);
    });

    let highlightNode: string | null = null;
    let influencedToEdges: Set<string> = new Set(),
      influencedToNodes: Set<string> = new Set();
    let influencedByEdges: Set<string> = new Set(),
      influencedByNodes: Set<string> = new Set();

    const renderer = new Sigma(graph, containerRef.current, {
      defaultEdgeType: "arrow",
      zIndex: true,
      labelColor: "#212529",
    });

    renderer.on("enterNode", (e) => {
      document.body.style.cursor = "pointer";
      highlightNode = e.node;

      for (const edge of graph.outEdges(e.node)) {
        influencedToEdges.add(edge);
        influencedToNodes.add(graph.target(edge));
      }

      for (const edge of graph.inEdges(e.node)) {
        influencedByEdges.add(edge);
        influencedByNodes.add(graph.source(edge));
      }

      renderer.setSetting("labelManual", true);
      animate(
        graph,
        (key) => {
          if (highlightNode === key) {
            return { color: "#12b886" };
          } else if (influencedToNodes.has(key)) {
            return { color: "#1c7ed6", showLabel: true };
          } else if (influencedByNodes.has(key)) {
            return { color: "#f03e3e", showLabel: true };
          } else {
            return { color: defaultEdgeColor };
          }
        },
        (key) => {
          if (influencedToEdges.has(key)) {
            return {
              color: "#1c7ed6",
              size: 2,
              z: 99,
            };
          } else if (influencedByEdges.has(key)) {
            return {
              color: "#f03e3e",
              size: 2,
              z: 99,
            };
          } else {
            return {
              color: defaultEdgeColor,
              size: 1,
              z: 0,
            };
          }
        },
        { duration: 100 }
      );
    });

    renderer.on("leaveNode", (e) => {
      document.body.style.cursor = "default";
      highlightNode = null;

      influencedToEdges.clear();
      influencedToNodes.clear();

      influencedByEdges.clear();
      influencedByNodes.clear();

      renderer.setSetting("labelManual", false);
      animate(
        graph,
        () => ({
          color: defaultNodeColor,
          showLabel: undefined,
        }),
        () => ({
          size: 1,
          color: defaultEdgeColor,
        }),
        {
          duration: 100,
        }
      );
    });

    return () => {
      renderer.kill();
    };
  }, [graph]);

  useEffect(() => {
    animate(
      graph,
      (key) =>
        layoutMapping[key] === undefined
          ? { hidden: true }
          : { hidden: false, ...layoutMapping[key] },
      () => ({}),
      {
        duration: 1500,
        easing: (t: number) =>
          t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, // easeInOutCubic
      }
    );
  }, [graph, layoutMapping]);

  return (
    <div
      ref={containerRef}
      sx={{ height: "100vh", backgroundColor: "background" }}
    />
  );
}
