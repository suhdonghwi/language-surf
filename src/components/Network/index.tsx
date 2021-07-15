import { useEffect, useState } from "react";
import * as d3 from "d3-force";
import { Container, Graphics } from "@inlet/react-pixi";

import Node from "./Node";

interface NodeData {
  index: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
}

interface LinkData {
  source: NodeData;
  target: NodeData;
}

interface NetworkProps {
  nodeData: NodeData[];
  linkData: LinkData[];
}

export default function Network({ nodeData, linkData }: NetworkProps) {
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [links, setLinks] = useState<LinkData[]>([]);

  useEffect(() => {
    d3.forceSimulation(nodeData)
      .force("collide", d3.forceCollide(10))
      .force("charge", d3.forceManyBody())
      .force("link", d3.forceLink(linkData))
      .on("tick", () => {
        setNodes([...nodeData]);
        setLinks([...linkData]);
      });
  }, [nodeData, linkData]);

  return (
    <Container>
      {links.map((link, i) => (
        <Graphics
          draw={(g) => {
            g.clear();
            g.lineStyle(3, 0)
              .moveTo(link.source.x, link.source.y)
              .lineTo(link.target.x, link.target.y);
          }}
        />
      ))}
      {nodes.map((node, i) => (
        <Node key={i} x={node.x} y={node.y} />
      ))}
    </Container>
  );
}
