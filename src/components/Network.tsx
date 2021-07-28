/** @jsxImportSource theme-ui */
import { useCallback, useEffect, useRef } from "react";

import { DirectedGraph } from "graphology";
import Sigma from "sigma";
import NodeAttribute from "../data/NodeAttribute";
import animate from "../utils/animate";
import { LayoutMapping } from "../data/Layout";

interface NetworkProps {
  graph: DirectedGraph<NodeAttribute>;
  layoutMapping: LayoutMapping;
  focusTo: string | null;
  highlights: string[];

  onClick(id: string): void;
}

export default function Network({
  graph,
  layoutMapping,
  focusTo,
  highlights,
  onClick,
}: NetworkProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<Sigma | null>(null);

  const defaultEdgeColor = "rgba(100, 100, 100, 0.5)",
    defaultNodeColor = "#495057";

  const focusNode = useCallback(
    (focusKey: string) => {
      let influencedToEdges: Set<string> = new Set(),
        influencedToNodes: Set<string> = new Set();
      let influencedByEdges: Set<string> = new Set(),
        influencedByNodes: Set<string> = new Set();

      for (const edge of graph.outEdges(focusKey)) {
        influencedToEdges.add(edge);
        influencedToNodes.add(graph.target(edge));
      }

      for (const edge of graph.inEdges(focusKey)) {
        influencedByEdges.add(edge);
        influencedByNodes.add(graph.source(edge));
      }

      if (rendererRef.current !== null)
        rendererRef.current.setSetting("labelManual", true);

      animate(
        graph,
        (key) => {
          if (focusKey === key) {
            return { color: "#12b886", showLabel: true };
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
              size: 1.5,
              z: 99,
            };
          } else if (influencedByEdges.has(key)) {
            return {
              color: "#f03e3e",
              size: 1.5,
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
    },
    [graph]
  );

  const unfocusNode = useCallback(() => {
    if (rendererRef.current === null) return;
    rendererRef.current.setSetting("labelManual", false);

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
  }, [graph]);

  useEffect(() => {
    if (containerRef.current === null) return;

    graph.forEachNode((key) =>
      graph.setNodeAttribute(key, "color", defaultNodeColor)
    );

    graph.forEachEdge((key) => {
      graph.setEdgeAttribute(key, "color", defaultEdgeColor);
      graph.setEdgeAttribute(key, "size", 1);
    });

    const renderer = new Sigma(graph, containerRef.current, {
      defaultEdgeType: "arrow",
      zIndex: true,
      labelColor: "#212529",
    });
    rendererRef.current = renderer;

    return () => {
      renderer.kill();
    };
  }, [graph]);

  useEffect(() => {
    if (
      rendererRef.current === null ||
      focusTo !== null ||
      highlights.length > 0
    )
      return;
    const renderer = rendererRef.current;

    function enterNode(e: any) {
      document.body.style.cursor = "pointer";
      focusNode(e.node);
    }

    function leaveNode() {
      document.body.style.cursor = "default";
      unfocusNode();
    }

    function clickNode(e: any) {
      document.body.style.cursor = "default";
      onClick(e.node);
    }

    renderer.on("enterNode", enterNode);
    renderer.on("leaveNode", leaveNode);
    renderer.on("clickNode", clickNode);

    return () => {
      renderer.off("enterNode", enterNode);
      renderer.off("leaveNode", leaveNode);
      renderer.off("clickNode", clickNode);
    };
  }, [focusNode, unfocusNode, onClick, focusTo, highlights]);

  useEffect(() => {
    animate(
      graph,
      (key) =>
        layoutMapping[key] === undefined
          ? { hidden: true, x: 0, y: 0 }
          : { hidden: false, ...layoutMapping[key] },
      () => ({}),
      {
        duration: 1500,
        easing: (t: number) =>
          t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2, // easeInOutCubic
      }
    );
  }, [graph, layoutMapping]);

  useEffect(() => {
    if (rendererRef.current === null || focusTo === null) {
      unfocusNode();
      return;
    }

    /*
    const renderer = rendererRef.current;
    const camera = renderer.getCamera();

    const graphCoords = {
      x: graph.getNodeAttribute(focusTo, "x"),
      y: graph.getNodeAttribute(focusTo, "y"),
    };
    const coords = camera.viewportToFramedGraph(
      renderer.getDimensions(),
      renderer.graphToViewport(graphCoords)
    );
    camera.animate({ ...coords, ratio: 0.1 });
    */

    console.log(typeof focusTo);
    focusNode(focusTo);
  }, [graph, focusTo, focusNode, unfocusNode]);

  useEffect(() => {
    if (rendererRef.current === null) return;

    if (highlights.length === 0) {
      rendererRef.current.setSetting("labelManual", false);

      animate(
        graph,
        () => ({ color: defaultNodeColor, showLabel: undefined }),
        () => ({
          color: defaultEdgeColor,
          size: 1,
          z: 0,
        }),
        { duration: 100 }
      );
    } else {
      rendererRef.current.setSetting("labelManual", true);

      animate(
        graph,
        (key) => {
          if (highlights.includes(key)) {
            return { color: "#12b886", showLabel: true };
          } else {
            return { color: defaultEdgeColor, showLabel: false };
          }
        },
        () => ({
          color: defaultEdgeColor,
          size: 1,
          z: 0,
        }),
        { duration: 100 }
      );
    }
  }, [highlights, graph]);

  return (
    <div
      ref={containerRef}
      sx={{ height: "100vh", backgroundColor: "background" }}
    />
  );
}
