import React from "react";
import * as PIXI from "pixi.js";

import { Viewport as PixiViewport } from "pixi-viewport";
import { PixiComponent, useApp } from "@inlet/react-pixi/animated";

interface Props {
  children: React.ReactNode;
  screenWidth: number;
  screenHeight: number;
  worldWidth: number;
  worldHeight: number;
}

const Viewport = (props: Props) => {
  const app = useApp();
  return <PixiComponentViewport app={app} {...props} />;
};

interface PixiComponentProps {
  app: PIXI.Application;
}

const PixiComponentViewport = PixiComponent("Viewport", {
  create: (props: PixiComponentProps & Props) => {
    const viewport = new PixiViewport({
      screenWidth: props.screenWidth,
      screenHeight: props.screenHeight,
      worldWidth: props.worldWidth,
      worldHeight: props.worldHeight,
      ticker: props.app.ticker,
      interaction: props.app.renderer.plugins.interaction,
    });

    viewport
      .drag()
      .pinch()
      .wheel()
      .moveCenter(new PIXI.Point(0, 0))
      .clampZoom({ minScale: 0.75, maxScale: 20 })
      .decelerate();

    return viewport;
  },
});
export default Viewport;
