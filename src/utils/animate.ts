import Graph from "graphology";
import * as d3 from "d3-interpolate";

interface AnimationOptions {
  duration: number;
  onComplete?(): void;
}

export default function animate<T1, T2>(
  graph: Graph<T1, T2>,
  nodeReducer: (key: string) => Partial<T1>,
  edgeReducer: (key: string) => Partial<T2>,
  options: AnimationOptions
) {
  const nodeInterpolators: Record<string, (t: number) => T1> = {};
  const nodeTargetAttrs: Record<string, T1> = {};
  graph.forEachNode((key) => {
    const source = graph.getNodeAttributes(key);
    const target = Object.assign({}, source, nodeReducer(key));

    nodeInterpolators[key] = d3.interpolateObject(source, target);
    nodeTargetAttrs[key] = target;
  });

  const edgeInterpolators: Record<string, (t: number) => T2> = {};
  const edgeTargetAttrs: Record<string, T2> = {};
  graph.forEachEdge((key) => {
    const source = graph.getEdgeAttributes(key);
    const target = Object.assign({}, source, edgeReducer(key));

    edgeInterpolators[key] = d3.interpolateObject(source, target);
    edgeTargetAttrs[key] = target;
  });

  const start = Date.now();

  let frame: number | null = null;
  const step = () => {
    let progress = (Date.now() - start) / options.duration;

    if (progress >= 1) {
      graph.updateEachNodeAttributes((key) => nodeTargetAttrs[key]);
      graph.updateEachEdgeAttributes((key) => edgeTargetAttrs[key]);

      if (options.onComplete) options.onComplete();
      return;
    }

    graph.updateEachNodeAttributes((key) => nodeInterpolators[key](progress));
    graph.updateEachEdgeAttributes((key) => edgeInterpolators[key](progress));
    frame = requestAnimationFrame(step);
  };

  step();
  return () => {
    if (frame) cancelAnimationFrame(frame);
  };
}
