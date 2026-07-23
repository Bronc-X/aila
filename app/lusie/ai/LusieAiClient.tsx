"use client";

import LusieSurfaceMotion from "../LusieSurfaceMotion";
import { ToyBoxApp } from "../_shipmodel/toybox/ToyBoxApp";

export function LusieAiClient() {
  return (
    <LusieSurfaceMotion variant="workbench">
      <div className="lusie-ai-scope">
        <ToyBoxApp />
      </div>
    </LusieSurfaceMotion>
  );
}
