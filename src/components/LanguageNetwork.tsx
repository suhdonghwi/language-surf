import { useMemo, useState } from "react";

import { DirectedGraph } from "graphology";
import { random } from "graphology-layout";
import noverlap from "graphology-layout-noverlap";
import forceAtlas2 from "graphology-layout-forceatlas2";

import { languageData, influenceData } from "../data/Language";
import Network from "./Network";
import NodeAttribute from "../data/NodeAttribute";
import Layout, { LayoutMapping } from "../data/Layout";
import Loading from "./Loading";

interface LanguageNetworkProps {
  layout: Layout;
}

export default function LanguageNetwork({ layout }: LanguageNetworkProps) {
  const graph = useMemo(() => {
    const g = new DirectedGraph<NodeAttribute>();

    for (const [id, data] of Object.entries(languageData)) {
      g.addNode(id, { label: data.label, lang: data });
    }

    for (const { source, target } of influenceData) {
      g.addEdge(source, target, { z: 0 });
    }

    g.forEachNode((key) => {
      g.setNodeAttribute(key, "size", 3 + 0.15 * g.outDegree(key));
      g.setNodeAttribute(key, "x", 0);
      g.setNodeAttribute(key, "y", 0);
    });

    return g;
  }, []);

  const [layoutData, setLayoutData] = useState<Record<
    Layout,
    LayoutMapping
  > | null>(null);

  const layoutMapping = useMemo(() => {
    if (layout === "force") {
      const temp = graph.copy();

      random.assign(temp, { center: 0, scale: 100 });
      forceAtlas2.assign(temp, {
        iterations: 100,
        settings: {
          gravity: 1,
          barnesHutOptimize: true,
          adjustSizes: true,
        },
      });
      return noverlap(temp, 100);
    } else if (layout === "random") {
      return random(graph, { center: 0, scale: 100 });
    }

    return {};
  }, [graph, layout]);

  return layoutData === null ? (
    <Loading />
  ) : (
    <Network graph={graph} layoutMapping={layoutMapping} />
  );
}
