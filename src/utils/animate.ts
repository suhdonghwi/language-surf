import Graph from "graphology";
import * as d3 from "d3-interpolate";

interface AnimationOptions {
  duration: number;
}

export function animateNodes<T>(
  graph: Graph<T>,
  reducer: (key: string) => Partial<T>,
  options: AnimationOptions
) {
  const interpolators: Record<string, (t: number) => T> = {};
  const targetAttributes: Record<string, T> = {};
  graph.forEachNode((key) => {
    const source = graph.getNodeAttributes(key);
    const target = Object.assign({}, source, reducer(key));

    targetAttributes[key] = target;
    interpolators[key] = d3.interpolate(source, target);
  });

  const start = Date.now();

  let frame: number | null = null;
  const step = () => {
    let progress = (Date.now() - start) / options.duration;

    if (progress >= 1) {
      graph.updateEachNodeAttributes((key) => targetAttributes[key]);
      return;
    }

    graph.updateEachNodeAttributes((key) => interpolators[key](progress));
    frame = requestAnimationFrame(step);
  };

  step();
  return () => {
    if (frame) cancelAnimationFrame(frame);
  };
}
