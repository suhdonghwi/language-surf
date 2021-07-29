import { useEffect, useMemo, useState } from "react";
import { DirectedGraph } from "graphology";

import { languageData, influenceData } from "../data/Language";
import layouts, { LayoutResult } from "../data/Layout";
import NodeAttribute from "../data/NodeAttribute";
import Network from "./Network";
import Loading from "./Loading";
import { paradigmData } from "../data/Paradigm";

interface LanguageNetworkProps {
  layoutIndex: number;

  selectedLanguage: number | null;
  selectedParadigm: number | null;
  selectedTyping: number | null;

  onClick(id: number): void;
}

export default function LanguageNetwork({
  layoutIndex,
  selectedLanguage,
  selectedParadigm,
  selectedTyping,
  onClick,
}: LanguageNetworkProps) {
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

  const [layoutData, setLayoutData] = useState<LayoutResult[] | null>(null);
  const [highlights, setHighlights] = useState<string[]>([]);

  useEffect(() => {
    async function calculateLayouts(): Promise<LayoutResult[]> {
      const result = [];
      for (const layout of layouts) {
        result.push(layout.calculate(graph));
      }

      return result;
    }

    async function setData() {
      setLayoutData(await calculateLayouts());
    }

    setData();
  }, [graph]);

  useEffect(() => {
    if (selectedParadigm === null && selectedTyping === null) {
      setHighlights([]);
      return;
    }

    function findLanguages(id: number): string[] {
      const langs: string[] = Object.entries(languageData)
        .filter(([_, l]) => l.paradigm.includes(id))
        .map(([key, _]) => key);

      const derived: string[] = paradigmData[id].derived.flatMap((p) =>
        findLanguages(p)
      );

      return langs.concat(derived);
    }

    setHighlights(
      selectedParadigm === null
        ? Object.entries(languageData)
            .filter(([_, l]) => l.typing.includes(Number(selectedTyping)))
            .map(([key, _]) => key)
        : findLanguages(selectedParadigm)
    );
  }, [selectedParadigm, selectedTyping]);

  return layoutData === null ? (
    <Loading />
  ) : (
    <Network
      graph={graph}
      layoutMapping={layoutData[layoutIndex].mapping}
      onClick={onClick}
      focusTo={selectedLanguage}
      highlights={highlights}
    />
  );
}
