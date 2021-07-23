import Graph from "graphology";
import * as d3 from "d3-interpolate";

interface AnimationOptions {
  duration: number;
  easing?(t: number): number;
  onComplete?(): void;
}

export default function animate<T1, T2>(
  graph: Graph<T1, T2>,
  nodeReducer: (key: string) => Partial<T1>,
  edgeReducer: (key: string) => Partial<T2>,
  options: AnimationOptions
) {
  const nodeInterpolators: Record<string, (t: number) => Partial<T1>> = {};
  const nodeTargetAttrs: Record<string, Partial<T1>> = {};
  graph.forEachNode((key) => {
    const source = graph.getNodeAttributes(key);
    const target = nodeReducer(key);

    nodeInterpolators[key] = d3.interpolateObject(source, target);
    nodeTargetAttrs[key] = target;
  });

  const edgeInterpolators: Record<string, (t: number) => Partial<T2>> = {};
  const edgeTargetAttrs: Record<string, Partial<T2>> = {};
  graph.forEachEdge((key) => {
    const source = graph.getEdgeAttributes(key);
    const target = edgeReducer(key);

    edgeInterpolators[key] = d3.interpolateObject(source, target);
    edgeTargetAttrs[key] = target;
  });

  const start = Date.now();

  let frame: number | null = null;
  const step = () => {
    let progress = (Date.now() - start) / options.duration;
    if (options.easing !== undefined) progress = options.easing(progress);

    if (progress >= 1) {
      graph.forEachNode((key) => {
        graph.mergeNodeAttributes(key, nodeTargetAttrs[key] as T1);
      });
      graph.forEachEdge((key) => {
        graph.mergeEdgeAttributes(key, edgeTargetAttrs[key] as T2);
      });

      if (options.onComplete) options.onComplete();
      return;
    }

    graph.forEachNode((key) => {
      graph.mergeNodeAttributes(key, nodeInterpolators[key](progress) as T1);
    });
    graph.forEachEdge((key) => {
      graph.mergeEdgeAttributes(key, edgeInterpolators[key](progress) as T2);
    });
    frame = requestAnimationFrame(step);
  };

  step();
  return () => {
    if (frame) cancelAnimationFrame(frame);
  };
}
