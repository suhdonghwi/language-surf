import { DirectedGraph } from "graphology";

import Language from "./Language";

export default interface NodeAttribute {
  x?: number;
  y?: number;
  hidden?: boolean;

  size?: number;
  label?: string;
  color?: string;

  lang: Language;
}

export type LanguageGraph = DirectedGraph<NodeAttribute>;
