import Language from "./Language";

export default interface NodeAttribute {
  x?: number;
  y?: number;
  size?: number;
  label?: string;
  color?: string;

  lang: Language;
}
