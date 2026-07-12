"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { CSS2DObject, CSS2DRenderer } from "three/examples/jsm/renderers/CSS2DRenderer.js";

import styles from "./toni-universe.module.css";
import { universe, universeNodeMap } from "./universe-data";
import type { UniverseLayer, UniverseNode, UniverseRelation, UniverseRelationType } from "./universe-types";

type SceneProps = {
  visibleNodeIds: string[];
  selectedId: string;
  hoveredId: string | null;
  focusNodeId: string | null;
  focusVersion: number;
  onSelect: (nodeId: string) => void;
  onHover: (nodeId: string | null) => void;
  onError: () => void;
};

type VisualMaterial = {
  material: THREE.Material;
  baseOpacity: number;
};

type NodeRuntime = {
  node: UniverseNode;
  group: THREE.Group;
  hitArea: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
  coreMaterial: THREE.MeshBasicMaterial;
  haloMaterial: THREE.SpriteMaterial;
  label: HTMLButtonElement;
  visualMaterials: VisualMaterial[];
  pulseOffset: number;
};

type RelationRuntime = {
  relation: UniverseRelation;
  curve: THREE.QuadraticBezierCurve3;
  lineMaterial: THREE.LineBasicMaterial;
  spineMaterial: THREE.LineBasicMaterial;
  spark: THREE.Sprite;
  sparkMaterial: THREE.SpriteMaterial;
  baseOpacity: number;
  baseSpineOpacity: number;
  speed: number;
  offset: number;
};

type SceneRuntime = {
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  nodes: Map<string, NodeRuntime>;
  relations: RelationRuntime[];
  bloomPass: UnrealBloomPass;
};

type CameraFrame = {
  position: THREE.Vector3;
  target: THREE.Vector3;
  distance: number;
};

type ClusterConfig = {
  count: number;
  radius: number;
  pointSize: number;
  beaconCount: number;
};

const layerPalettes: Record<UniverseLayer, string[]> = {
  core: ["#ead8ad", "#c49a5f", "#86b7b1", "#6f8794", "#a96e43"],
  delivery: ["#d9c795", "#b77b48", "#6da49b", "#718b99", "#8f9878"],
  capability: ["#c7d8d4", "#68a99d", "#6e93a5", "#83958d", "#b69a66"],
  proof: ["#d8c49b", "#b97950", "#9c865f", "#6f8e98", "#7b9b8d"],
};

const clusterConfigs: Record<UniverseLayer, ClusterConfig> = {
  core: { count: 1520, radius: 6.35, pointSize: 0.13, beaconCount: 28 },
  delivery: { count: 280, radius: 2.35, pointSize: 0.14, beaconCount: 8 },
  capability: { count: 135, radius: 1.55, pointSize: 0.105, beaconCount: 5 },
  proof: { count: 92, radius: 1.22, pointSize: 0.095, beaconCount: 4 },
};

const relationColors: Record<UniverseRelationType, string> = {
  flow: "#c6a66c",
  enables: "#63a79d",
  proves: "#b77952",
  compounds: "#728f9e",
};

const defaultRelationOpacity: Record<UniverseRelationType, number> = {
  flow: 0.36,
  enables: 0.12,
  proves: 0.1,
  compounds: 0.2,
};

const defaultSpineOpacity: Record<UniverseRelationType, number> = {
  flow: 0.28,
  enables: 0.14,
  proves: 0.13,
  compounds: 0.18,
};

const overviewLabelIds = new Set(["discover", "deploy", "compound"]);

const visualPositions: Record<string, [number, number, number]> = {
  fde: [0, 0, 0],
  discover: [-1.6, 13.2, -2.8],
  design: [2.4, 9.2, 2.9],
  build: [-1.7, 3.8, 2.2],
  deploy: [2.1, -2.6, -2.1],
  operate: [-1.8, -8.8, 3.1],
  compound: [1.4, -13.2, -3.2],
  "field-mapping": [-5.1, 13.8, 2.6],
  "data-integration": [-5.6, 7.6, -4.8],
  "solution-architecture": [5.4, 10.9, -2.4],
  "rapid-product": [4.8, 5.7, 4.8],
  "workflow-engineering": [-5.7, 2.5, -4.7],
  "model-runtime": [5.5, 1.8, -4.2],
  "deployment-governance": [5.8, -3.8, 4.6],
  "adoption-operations": [-5.4, -7.1, -4.6],
  "operating-metrics": [5.1, -9.2, 4.8],
  "knowledge-compounding": [-4.8, -13.8, 3.6],
  "survey-decision-system": [-8.8, 15.2, -4.4],
  "ecommerce-product-radar": [-9.1, 8.1, 5.1],
  "commercial-poster-workshop": [-8.4, 2.6, -6.3],
  "aila-platform": [8.2, 7.6, 5.7],
  lusie: [8.7, -0.5, -5.4],
  lotus: [8.1, -10.8, 5.8],
  cosic: [7.6, -5.3, 7.2],
  "training-system": [-8.1, -6.9, -5.8],
  antios: [-8.5, -12.1, 5.4],
  quantmax: [-8.8, -16.2, -5.9],
};

function getVisualPosition(node: UniverseNode) {
  return visualPositions[node.id] ?? node.position;
}

function seeded(index: number) {
  const value = Math.sin(index * 999.91) * 43758.5453;
  return value - Math.floor(value);
}

function hashString(value: string) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return Math.abs(hash);
}

function getOverviewFrame(aspect: number): CameraFrame {
  const bounds = new THREE.Box3().setFromPoints(universe.nodes.map((node) => new THREE.Vector3(...getVisualPosition(node))));
  const target = bounds.getCenter(new THREE.Vector3());
  const size = bounds.getSize(new THREE.Vector3()).addScalar(8);
  const verticalFov = THREE.MathUtils.degToRad(42);
  const halfFovTangent = Math.tan(verticalFov / 2);
  const heightDistance = size.y / 2 / halfFovTangent;
  const widthDistance = size.x / 2 / (halfFovTangent * Math.max(aspect, 0.55));
  const distance = Math.max(heightDistance, widthDistance) * 0.9 + size.z / 3;

  target.y -= 0.8;
  return {
    target,
    position: new THREE.Vector3(target.x + 1.2, target.y + 2.8, target.z + distance),
    distance,
  };
}

function createStarTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 96;
  canvas.height = 96;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Unable to create star texture");

  const gradient = context.createRadialGradient(48, 48, 0, 48, 48, 48);
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.08, "rgba(255,255,255,0.98)");
  gradient.addColorStop(0.26, "rgba(255,255,255,0.62)");
  gradient.addColorStop(0.58, "rgba(255,255,255,0.16)");
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, 96, 96);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createNebulaTexture(seed: number) {
  const canvas = document.createElement("canvas");
  canvas.width = 384;
  canvas.height = 384;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Unable to create nebula texture");

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.globalCompositeOperation = "lighter";
  for (let index = 0; index < 52; index += 1) {
    const x = seeded(seed + index * 7 + 1) * canvas.width;
    const y = seeded(seed + index * 7 + 2) * canvas.height;
    const radius = 28 + seeded(seed + index * 7 + 3) * 92;
    const intensity = 0.025 + seeded(seed + index * 7 + 4) * 0.065;
    const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
    gradient.addColorStop(0, `rgba(255,255,255,${intensity})`);
    gradient.addColorStop(0.32, `rgba(255,255,255,${intensity * 0.72})`);
    gradient.addColorStop(0.72, `rgba(255,255,255,${intensity * 0.18})`);
    gradient.addColorStop(1, "rgba(255,255,255,0)");
    context.fillStyle = gradient;
    context.fillRect(x - radius, y - radius, radius * 2, radius * 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createStarField(
  count: number,
  spread: number,
  pointSize: number,
  palette: string[],
  texture: THREE.Texture,
  seed: number
) {
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);

  for (let index = 0; index < count; index += 1) {
    const radius = spread * (0.28 + seeded(seed + index * 6 + 1) * 0.72);
    const theta = seeded(seed + index * 6 + 2) * Math.PI * 2;
    const phi = Math.acos(2 * seeded(seed + index * 6 + 3) - 1);
    positions[index * 3] = Math.sin(phi) * Math.cos(theta) * radius;
    positions[index * 3 + 1] = Math.cos(phi) * radius * 0.72;
    positions[index * 3 + 2] = Math.sin(phi) * Math.sin(theta) * radius;

    const paletteColor = new THREE.Color(palette[Math.floor(seeded(seed + index * 6 + 4) * palette.length)]);
    paletteColor.lerp(new THREE.Color("#dbe4e1"), seeded(seed + index * 6 + 5) * 0.22);
    colors[index * 3] = paletteColor.r;
    colors[index * 3 + 1] = paletteColor.g;
    colors[index * 3 + 2] = paletteColor.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({
    map: texture,
    size: pointSize,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.72,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    alphaTest: 0.012,
    toneMapped: false,
  });
  const field = new THREE.Points(geometry, material);
  field.frustumCulled = false;
  return field;
}

function createParticleCluster(node: UniverseNode, texture: THREE.Texture, densityScale: number) {
  const config = clusterConfigs[node.layer];
  const seed = hashString(node.id);
  const weightScale = 0.78 + node.weight * 0.085;
  const radius = config.radius * weightScale;
  const particleCount = Math.max(48, Math.round(config.count * densityScale));
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const palette = layerPalettes[node.layer];
  const centerLight = new THREE.Color(node.layer === "core" ? "#c9ad74" : "#d4dfdb");

  for (let index = 0; index < particleCount; index += 1) {
    const shellChance = seeded(seed + index * 9 + 1);
    const radialSeed = seeded(seed + index * 9 + 2);
    const particleRadius =
      shellChance > 0.86 ? radius * (0.84 + radialSeed * 0.72) : radius * Math.pow(radialSeed, 2.25);
    const theta = seeded(seed + index * 9 + 3) * Math.PI * 2;
    const phi = Math.acos(2 * seeded(seed + index * 9 + 4) - 1);
    const verticalCompression = node.layer === "proof" ? 0.72 : node.layer === "capability" ? 0.82 : 0.94;

    positions[index * 3] = Math.sin(phi) * Math.cos(theta) * particleRadius;
    positions[index * 3 + 1] = Math.cos(phi) * particleRadius * verticalCompression;
    positions[index * 3 + 2] = Math.sin(phi) * Math.sin(theta) * particleRadius * 0.9;

    const paletteColor = new THREE.Color(palette[Math.floor(seeded(seed + index * 9 + 5) * palette.length)]);
    const centerBrightness = THREE.MathUtils.clamp(1 - particleRadius / Math.max(radius, 0.001), 0, 1);
    paletteColor.lerp(centerLight, centerBrightness * 0.22 + seeded(seed + index * 9 + 6) * 0.04);
    colors[index * 3] = paletteColor.r;
    colors[index * 3 + 1] = paletteColor.g;
    colors[index * 3 + 2] = paletteColor.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  const material = new THREE.PointsMaterial({
    map: texture,
    size: config.pointSize,
    sizeAttenuation: true,
    transparent: true,
    opacity: node.layer === "core" ? 0.48 : 0.68,
    vertexColors: true,
    blending: node.layer === "core" ? THREE.NormalBlending : THREE.AdditiveBlending,
    depthWrite: false,
    alphaTest: 0.012,
    toneMapped: true,
  });
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  return { points, material, radius, seed };
}

function createClusterFibers(node: UniverseNode, radius: number, seed: number) {
  const fiberCount = node.layer === "core" ? 96 : node.layer === "delivery" ? 22 : node.layer === "capability" ? 8 : 5;
  const positions = new Float32Array(fiberCount * 6);

  for (let index = 0; index < fiberCount; index += 1) {
    const emitterRadius = node.layer === "core" ? 0.5 : 0.14;
    const startRadius = emitterRadius * (0.34 + seeded(seed + index * 12 + 1) * 0.66);
    const endRadius = radius * (0.28 + Math.pow(seeded(seed + index * 12 + 2), 1.45));
    const startTheta = seeded(seed + index * 12 + 3) * Math.PI * 2;
    const startPhi = Math.acos(2 * seeded(seed + index * 12 + 4) - 1);
    const endTheta = startTheta + (seeded(seed + index * 12 + 5) - 0.5) * 0.22;
    const endPhi = THREE.MathUtils.clamp(
      startPhi + (seeded(seed + index * 12 + 6) - 0.5) * 0.18,
      0.05,
      Math.PI - 0.05
    );

    positions[index * 6] = Math.sin(startPhi) * Math.cos(startTheta) * startRadius;
    positions[index * 6 + 1] = Math.cos(startPhi) * startRadius * 0.86;
    positions[index * 6 + 2] = Math.sin(startPhi) * Math.sin(startTheta) * startRadius * 0.88;
    positions[index * 6 + 3] = Math.sin(endPhi) * Math.cos(endTheta) * endRadius;
    positions[index * 6 + 4] = Math.cos(endPhi) * endRadius * 0.86;
    positions[index * 6 + 5] = Math.sin(endPhi) * Math.sin(endTheta) * endRadius * 0.88;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.LineBasicMaterial({
    color: layerPalettes[node.layer][2],
    transparent: true,
    opacity: node.layer === "core" ? 0.2 : node.layer === "delivery" ? 0.15 : 0.09,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    toneMapped: false,
  });
  return { fibers: new THREE.LineSegments(geometry, material), material };
}

function createBundledRelationGeometry(curve: THREE.QuadraticBezierCurve3, relation: UniverseRelation) {
  const fiberCount = relation.type === "flow" ? 8 : relation.type === "compounds" ? 6 : relation.type === "proves" ? 5 : 4;
  const segments = relation.type === "flow" ? 34 : 22;
  const seed = hashString(`${relation.source}-${relation.target}-${relation.type}-bundle`);
  const points: THREE.Vector3[] = [];

  for (let fiberIndex = 0; fiberIndex < fiberCount; fiberIndex += 1) {
    const spread = relation.type === "flow" ? 0.52 : 0.32;
    const offset = new THREE.Vector3(
      (seeded(seed + fiberIndex * 5 + 1) - 0.5) * spread,
      (seeded(seed + fiberIndex * 5 + 2) - 0.5) * spread,
      (seeded(seed + fiberIndex * 5 + 3) - 0.5) * spread * 1.8
    );
    const fiberCurve = new THREE.QuadraticBezierCurve3(
      curve.v0.clone(),
      curve.v1.clone().add(offset),
      curve.v2.clone()
    );
    const fiberPoints = fiberCurve.getPoints(segments);
    for (let pointIndex = 0; pointIndex < fiberPoints.length - 1; pointIndex += 1) {
      points.push(fiberPoints[pointIndex], fiberPoints[pointIndex + 1]);
    }
  }

  return new THREE.BufferGeometry().setFromPoints(points);
}

function createNodeLabel(
  node: UniverseNode,
  onSelect: (nodeId: string) => void,
  onHover: (nodeId: string | null) => void
) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = styles.nodeLabel;
  button.dataset.layer = node.layer;
  button.setAttribute("aria-label", `${node.title}, ${node.english}`);

  const signal = document.createElement("i");
  signal.setAttribute("aria-hidden", "true");
  const copy = document.createElement("span");
  const english = document.createElement("small");
  english.textContent = node.english;
  const title = document.createElement("strong");
  title.textContent = node.title;
  copy.append(english, title);
  button.append(signal, copy);

  button.addEventListener("click", (event) => {
    event.stopPropagation();
    onSelect(node.id);
  });
  button.addEventListener("pointerenter", () => onHover(node.id));
  button.addEventListener("pointerleave", () => onHover(null));
  button.addEventListener("focus", () => onHover(node.id));
  button.addEventListener("blur", () => onHover(null));
  return button;
}

function createRelationCurve(relation: UniverseRelation) {
  const source = universeNodeMap.get(relation.source);
  const target = universeNodeMap.get(relation.target);
  if (!source || !target) throw new Error(`Invalid Universe relation: ${relation.source} -> ${relation.target}`);

  const start = new THREE.Vector3(...getVisualPosition(source));
  const end = new THREE.Vector3(...getVisualPosition(target));
  const midpoint = start.clone().add(end).multiplyScalar(0.5);
  const direction = end.clone().sub(start);
  const normal = new THREE.Vector3(-direction.y, direction.x, 0);
  if (normal.lengthSq() < 0.0001) normal.set(1, 0, 0);

  const bendScale = {
    flow: 0.14,
    enables: 0.16,
    proves: -0.18,
    compounds: 0.26,
  }[relation.type];
  const minimumBend = {
    flow: 0.85,
    enables: 0.75,
    proves: 0.85,
    compounds: 2.2,
  }[relation.type];
  const maximumBend = {
    flow: 2.4,
    enables: 2.7,
    proves: 3,
    compounds: 4.6,
  }[relation.type];
  const bendDirection = Math.sign(bendScale);
  const bendMagnitude = THREE.MathUtils.clamp(Math.abs(direction.length() * bendScale), minimumBend, maximumBend);
  midpoint.add(normal.normalize().multiplyScalar(bendMagnitude * bendDirection));
  midpoint.z += {
    flow: 0.35,
    enables: 0.7,
    proves: -1,
    compounds: 2.2,
  }[relation.type];
  return new THREE.QuadraticBezierCurve3(start, midpoint, end);
}

export default function FdeUniverseScene({
  visibleNodeIds,
  selectedId,
  hoveredId,
  focusNodeId,
  focusVersion,
  onSelect,
  onHover,
  onError,
}: SceneProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const runtimeRef = useRef<SceneRuntime | null>(null);
  const callbacksRef = useRef({ onSelect, onHover, onError });
  const focusTweenRef = useRef<gsap.core.Timeline | null>(null);
  const [readyVersion, setReadyVersion] = useState(0);
  const visibleSet = useMemo(() => new Set(visibleNodeIds), [visibleNodeIds]);

  useEffect(() => {
    callbacksRef.current = { onSelect, onHover, onError };
  }, [onError, onHover, onSelect]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let animationFrame = 0;
    let disposed = false;
    let pointerDown = { x: 0, y: 0 };
    let wheelTween: gsap.core.Tween | null = null;

    try {
      const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const compactViewport = window.matchMedia("(max-width: 700px)").matches;
      const densityScale = reducedMotion ? 0.5 : compactViewport ? 0.66 : 1;
      const scene = new THREE.Scene();
      scene.background = new THREE.Color("#02080b");
      scene.fog = new THREE.FogExp2("#061318", 0.0096);

      const aspect = mount.clientWidth / mount.clientHeight;
      const overviewFrame = getOverviewFrame(aspect);
      const camera = new THREE.PerspectiveCamera(42, aspect, 0.1, 240);
      camera.position.copy(overviewFrame.position);

      const renderer = new THREE.WebGLRenderer({
        antialias: true,
        powerPreference: "high-performance",
      });
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 0.74;
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, compactViewport ? 1.25 : 1.65));
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      renderer.domElement.className = styles.webglCanvas;
      renderer.domElement.setAttribute("aria-hidden", "true");
      mount.appendChild(renderer.domElement);

      const composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(mount.clientWidth, mount.clientHeight),
        reducedMotion ? 0.36 : compactViewport ? 0.46 : 0.52,
        0.42,
        0.42
      );
      composer.addPass(bloomPass);

      const labelRenderer = new CSS2DRenderer();
      labelRenderer.setSize(mount.clientWidth, mount.clientHeight);
      labelRenderer.domElement.className = styles.labelLayer;
      labelRenderer.domElement.setAttribute("role", "group");
      labelRenderer.domElement.setAttribute("aria-label", "FDE 宇宙节点");
      mount.appendChild(labelRenderer.domElement);

      const controls = new OrbitControls(camera, renderer.domElement);
      let wheelTargetDistance = overviewFrame.distance;
      const handleControlsStart = () => {
        focusTweenRef.current?.kill();
        wheelTween?.kill();
        wheelTargetDistance = camera.position.distanceTo(controls.target);
      };
      controls.addEventListener("start", handleControlsStart);
      controls.enableDamping = true;
      controls.dampingFactor = 0.055;
      controls.enablePan = false;
      controls.enableZoom = false;
      controls.minDistance = 5.5;
      controls.maxDistance = Math.max(118, overviewFrame.distance * 1.6);
      controls.minPolarAngle = Math.PI * 0.1;
      controls.maxPolarAngle = Math.PI * 0.9;
      controls.rotateSpeed = 0.44;
      controls.zoomSpeed = 0.68;
      controls.target.copy(overviewFrame.target);
      controls.update();

      const handleWheel = (event: WheelEvent) => {
        event.preventDefault();
        focusTweenRef.current?.kill();

        const deltaScale = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? 16 : event.deltaMode === WheelEvent.DOM_DELTA_PAGE ? mount.clientHeight : 1;
        const currentDistance = camera.position.distanceTo(controls.target);
        const baseDistance = wheelTween?.isActive() ? wheelTargetDistance : currentDistance;
        const nextDistance = gsap.utils.clamp(
          controls.minDistance,
          controls.maxDistance,
          baseDistance * Math.exp(event.deltaY * deltaScale * 0.00115)
        );
        const direction = camera.position.clone().sub(controls.target).normalize();
        const destination = controls.target.clone().add(direction.multiplyScalar(nextDistance));
        wheelTargetDistance = nextDistance;
        wheelTween?.kill();

        if (reducedMotion) {
          camera.position.copy(destination);
          controls.update();
          return;
        }

        wheelTween = gsap.to(camera.position, {
          x: destination.x,
          y: destination.y,
          z: destination.z,
          duration: 0.72,
          ease: "power3.out",
          overwrite: "auto",
          onUpdate: () => controls.update(),
        });
      };
      renderer.domElement.addEventListener("wheel", handleWheel, { passive: false });

      const textures = [createStarTexture(), createNebulaTexture(117), createNebulaTexture(337)];
      const [starTexture, nebulaTextureA, nebulaTextureB] = textures;

      const backdrop = new THREE.Group();
      scene.add(backdrop);
      const farStars = createStarField(
        reducedMotion ? 1200 : compactViewport ? 1700 : 2800,
        150,
        0.22,
        ["#dfe7e4", "#78a4b0", "#6f8993", "#b79b69", "#758f86"],
        starTexture,
        1900
      );
      const nearStars = createStarField(
        reducedMotion ? 440 : compactViewport ? 620 : 1050,
        82,
        0.3,
        ["#e5ebe7", "#78b6aa", "#87a5b2", "#c0a36d"],
        starTexture,
        2900
      );
      backdrop.add(farStars, nearStars);

      const nebulaGroup = new THREE.Group();
      const nebulaSpecs = [
        { texture: nebulaTextureA, color: "#174c57", opacity: 0.15, position: [-21, 10, -18], scale: [40, 26] },
        { texture: nebulaTextureB, color: "#284c4c", opacity: 0.11, position: [18, -10, -22], scale: [38, 30] },
        { texture: nebulaTextureA, color: "#1d5360", opacity: 0.11, position: [10, 19, -32], scale: [32, 24] },
        { texture: nebulaTextureB, color: "#68482f", opacity: 0.07, position: [-18, -20, -28], scale: [34, 20] },
        { texture: nebulaTextureA, color: "#183742", opacity: 0.09, position: [1, 0, -38], scale: [52, 34] },
      ] as const;
      nebulaSpecs.forEach((spec, index) => {
        const material = new THREE.SpriteMaterial({
          map: spec.texture,
          color: spec.color,
          transparent: true,
          opacity: spec.opacity,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          toneMapped: false,
          rotation: seeded(index + 81) * Math.PI,
        });
        const sprite = new THREE.Sprite(material);
        sprite.position.set(spec.position[0], spec.position[1], spec.position[2]);
        sprite.scale.set(spec.scale[0], spec.scale[1], 1);
        nebulaGroup.add(sprite);
      });
      backdrop.add(nebulaGroup);

      const root = new THREE.Group();
      root.rotation.set(-0.04, -0.12, 0.04);
      scene.add(root);

      const relationRuntimes: RelationRuntime[] = universe.relations.map((relation, index) => {
        const curve = createRelationCurve(relation);
        const geometry = createBundledRelationGeometry(curve, relation);
        const baseOpacity = defaultRelationOpacity[relation.type];
        const baseSpineOpacity = defaultSpineOpacity[relation.type];
        const spineMaterial = new THREE.LineBasicMaterial({
          color: relationColors[relation.type],
          transparent: true,
          opacity: baseSpineOpacity,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          toneMapped: true,
        });
        const spine = new THREE.Line(
          new THREE.BufferGeometry().setFromPoints(curve.getPoints(relation.type === "flow" ? 72 : 48)),
          spineMaterial
        );
        spine.renderOrder = relation.type === "flow" ? 4 : 2;
        spine.frustumCulled = false;
        root.add(spine);

        const lineMaterial = new THREE.LineBasicMaterial({
          color: relationColors[relation.type],
          transparent: true,
          opacity: baseOpacity * 0.56,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          toneMapped: false,
        });
        const line = new THREE.LineSegments(geometry, lineMaterial);
        line.renderOrder = relation.type === "flow" ? 3 : 1;
        line.frustumCulled = false;
        root.add(line);

        const sparkMaterial = new THREE.SpriteMaterial({
          map: starTexture,
          color: relationColors[relation.type],
          transparent: true,
          opacity: relation.type === "flow" ? 0.95 : 0.58,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          toneMapped: false,
        });
        const spark = new THREE.Sprite(sparkMaterial);
        const sparkScale = relation.type === "flow" ? 0.86 : 0.52;
        spark.scale.setScalar(sparkScale);
        root.add(spark);

        return {
          relation,
          curve,
          lineMaterial,
          spineMaterial,
          spark,
          sparkMaterial,
          baseOpacity,
          baseSpineOpacity,
          speed: 0.045 + seeded(index + 600) * 0.055,
          offset: seeded(index + 900),
        };
      });

      const nodeRuntimes = new Map<string, NodeRuntime>();
      const interactiveMeshes: Array<THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>> = [];

      for (const node of universe.nodes) {
        const group = new THREE.Group();
        group.position.set(...getVisualPosition(node));
        group.userData.nodeId = node.id;
        root.add(group);

        const cluster = createParticleCluster(node, starTexture, densityScale);
        group.add(cluster.points);
        const visualMaterials: VisualMaterial[] = [
          { material: cluster.material, baseOpacity: cluster.material.opacity },
        ];

        const palette = layerPalettes[node.layer];
        const haloMaterial = new THREE.SpriteMaterial({
          map: starTexture,
          color: palette[1],
          transparent: true,
          opacity: node.layer === "core" ? 0.1 : node.layer === "delivery" ? 0.14 : 0.08,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          toneMapped: true,
        });
        const halo = new THREE.Sprite(haloMaterial);
        const haloScale = cluster.radius * (node.layer === "core" ? 2.8 : 3.5);
        halo.scale.set(haloScale, haloScale, 1);
        group.add(halo);
        visualMaterials.push({ material: haloMaterial, baseOpacity: haloMaterial.opacity });

        const coreMaterial = new THREE.MeshBasicMaterial({
          color: node.layer === "core" ? "#c8a76c" : palette[0],
          transparent: true,
          opacity: node.layer === "core" ? 0.5 : 0.72,
          blending: node.layer === "core" ? THREE.NormalBlending : THREE.AdditiveBlending,
          depthWrite: false,
          toneMapped: true,
        });
        const coreGeometry =
          node.layer === "core" ? new THREE.IcosahedronGeometry(0.72, 3) : new THREE.SphereGeometry(0.18, 18, 14);
        const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
        group.add(coreMesh);
        visualMaterials.push({ material: coreMaterial, baseOpacity: coreMaterial.opacity });

        const clusterFibers = createClusterFibers(node, cluster.radius, cluster.seed);
        group.add(clusterFibers.fibers);
        visualMaterials.push({ material: clusterFibers.material, baseOpacity: clusterFibers.material.opacity });

        for (let index = 0; index < clusterConfigs[node.layer].beaconCount; index += 1) {
          const theta = seeded(cluster.seed + index * 5 + 1) * Math.PI * 2;
          const phi = Math.acos(2 * seeded(cluster.seed + index * 5 + 2) - 1);
          const radius = cluster.radius * (0.38 + seeded(cluster.seed + index * 5 + 3) * 1.05);
          const beaconMaterial = new THREE.SpriteMaterial({
            map: starTexture,
            color: palette[index % palette.length],
            transparent: true,
            opacity: 0.28 + seeded(cluster.seed + index * 5 + 4) * 0.16,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
            toneMapped: true,
          });
          const beacon = new THREE.Sprite(beaconMaterial);
          beacon.position.set(
            Math.sin(phi) * Math.cos(theta) * radius,
            Math.cos(phi) * radius * 0.86,
            Math.sin(phi) * Math.sin(theta) * radius * 0.86
          );
          const beaconScale =
            (node.layer === "core" ? 0.38 : 0.2) + seeded(cluster.seed + index * 5 + 5) * (node.layer === "core" ? 0.8 : 0.42);
          beacon.scale.setScalar(beaconScale);
          group.add(beacon);
          visualMaterials.push({ material: beaconMaterial, baseOpacity: beaconMaterial.opacity });
        }

        const hitMaterial = new THREE.MeshBasicMaterial({
          transparent: true,
          opacity: 0.001,
          depthWrite: false,
        });
        const hitArea = new THREE.Mesh(new THREE.SphereGeometry(Math.max(cluster.radius * 0.78, 0.9), 16, 12), hitMaterial);
        hitArea.userData.nodeId = node.id;
        group.add(hitArea);
        interactiveMeshes.push(hitArea);

        const labelElement = createNodeLabel(
          node,
          (nodeId) => callbacksRef.current.onSelect(nodeId),
          (nodeId) => callbacksRef.current.onHover(nodeId)
        );
        const label = new CSS2DObject(labelElement);
        label.position.set(0, cluster.radius * (node.layer === "core" ? 1.16 : 1.28), 0);
        group.add(label);

        nodeRuntimes.set(node.id, {
          node,
          group,
          hitArea,
          coreMaterial,
          haloMaterial,
          label: labelElement,
          visualMaterials,
          pulseOffset: seeded(cluster.seed + 400) * Math.PI * 2,
        });
      }

      const raycaster = new THREE.Raycaster();
      const pointer = new THREE.Vector2();
      const parallaxPointer = new THREE.Vector2();
      let lastHoveredId: string | null = null;

      const updatePointer = (event: PointerEvent) => {
        const rect = renderer.domElement.getBoundingClientRect();
        pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        parallaxPointer.set(pointer.x, pointer.y);
      };

      const handlePointerMove = (event: PointerEvent) => {
        updatePointer(event);
        raycaster.setFromCamera(pointer, camera);
        const hit = raycaster.intersectObjects(interactiveMeshes, false)[0];
        const nodeId = typeof hit?.object.userData.nodeId === "string" ? hit.object.userData.nodeId : null;
        renderer.domElement.style.cursor = nodeId ? "pointer" : "grab";
        if (nodeId !== lastHoveredId) {
          lastHoveredId = nodeId;
          callbacksRef.current.onHover(nodeId);
        }
      };

      const handlePointerLeave = () => {
        lastHoveredId = null;
        parallaxPointer.set(0, 0);
        callbacksRef.current.onHover(null);
      };

      const handlePointerDown = (event: PointerEvent) => {
        pointerDown = { x: event.clientX, y: event.clientY };
      };

      const handlePointerUp = (event: PointerEvent) => {
        const moved = Math.hypot(event.clientX - pointerDown.x, event.clientY - pointerDown.y);
        if (moved > 6) return;
        updatePointer(event);
        raycaster.setFromCamera(pointer, camera);
        const hit = raycaster.intersectObjects(interactiveMeshes, false)[0];
        const nodeId = typeof hit?.object.userData.nodeId === "string" ? hit.object.userData.nodeId : null;
        if (nodeId) callbacksRef.current.onSelect(nodeId);
      };

      renderer.domElement.addEventListener("pointermove", handlePointerMove);
      renderer.domElement.addEventListener("pointerleave", handlePointerLeave);
      renderer.domElement.addEventListener("pointerdown", handlePointerDown);
      renderer.domElement.addEventListener("pointerup", handlePointerUp);
      const handleContextLost = (event: Event) => {
        event.preventDefault();
        callbacksRef.current.onError();
      };
      renderer.domElement.addEventListener("webglcontextlost", handleContextLost, { once: true });

      const resizeObserver = new ResizeObserver(() => {
        if (!mount.clientWidth || !mount.clientHeight) return;
        camera.aspect = mount.clientWidth / mount.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(mount.clientWidth, mount.clientHeight);
        composer.setSize(mount.clientWidth, mount.clientHeight);
        bloomPass.setSize(mount.clientWidth, mount.clientHeight);
        labelRenderer.setSize(mount.clientWidth, mount.clientHeight);
      });
      resizeObserver.observe(mount);

      const animationContext = gsap.context(() => {
        if (reducedMotion) return;

        gsap.set(root.scale, { x: 0.72, y: 0.72, z: 0.72 });
        const timeline = gsap.timeline({ defaults: { ease: "power4.out" } });
        timeline.fromTo(
          camera.position,
          { z: overviewFrame.position.z + 28, y: overviewFrame.position.y + 7 },
          { z: overviewFrame.position.z, y: overviewFrame.position.y, duration: 2.15 }
        );
        timeline.fromTo(root.rotation, { y: -0.7, x: 0.22, z: -0.12 }, { y: -0.12, x: -0.04, z: 0.04, duration: 2 }, 0);
        timeline.to(root.scale, { x: 1, y: 1, z: 1, duration: 1.8, ease: "expo.out" }, 0.12);
        timeline.fromTo(bloomPass, { strength: 0.1 }, { strength: 0.52, duration: 1.9 }, 0.22);
      }, mount);

      const timer = new THREE.Timer();
      timer.connect(document);
      const animate = (timestamp?: number) => {
        animationFrame = 0;
        if (disposed || document.hidden) return;

        timer.update(timestamp);
        const elapsed = timer.getElapsed();
        if (!reducedMotion) {
          root.rotation.y += 0.00016;
          farStars.rotation.y -= 0.000045;
          nearStars.rotation.y += 0.00008;
          nearStars.position.x += (parallaxPointer.x * 1.8 - nearStars.position.x) * 0.018;
          nearStars.position.y += (parallaxPointer.y * 1.2 - nearStars.position.y) * 0.018;
          nebulaGroup.position.x += (parallaxPointer.x * 0.55 - nebulaGroup.position.x) * 0.01;
          nebulaGroup.position.y += (parallaxPointer.y * 0.38 - nebulaGroup.position.y) * 0.01;

          for (const nodeRuntime of nodeRuntimes.values()) {
            const pulse = 1 + Math.sin(elapsed * 0.72 + nodeRuntime.pulseOffset) * (nodeRuntime.node.layer === "core" ? 0.045 : 0.022);
            nodeRuntime.group.rotation.y += nodeRuntime.node.layer === "core" ? 0.001 : 0.00042;
            nodeRuntime.haloMaterial.rotation += nodeRuntime.node.layer === "core" ? 0.0008 : 0.00035;
            nodeRuntime.coreMaterial.opacity = Math.min(1, (nodeRuntime.node.layer === "core" ? 0.86 : 0.72) * pulse);
          }

          for (const relationRuntime of relationRuntimes) {
            if (!relationRuntime.spark.layers.isEnabled(0)) continue;
            const progress = (elapsed * relationRuntime.speed + relationRuntime.offset) % 1;
            relationRuntime.curve.getPoint(progress, relationRuntime.spark.position);
            const pulse = 0.62 + Math.sin((progress + relationRuntime.offset) * Math.PI * 2) * 0.22;
            relationRuntime.sparkMaterial.opacity =
              (relationRuntime.relation.type === "flow" ? 0.95 : 0.58) * pulse;
          }
        }

        controls.update();
        composer.render();
        labelRenderer.render(scene, camera);
        animationFrame = requestAnimationFrame(animate);
      };

      const startAnimation = () => {
        if (!disposed && !document.hidden && animationFrame === 0) animationFrame = requestAnimationFrame(animate);
      };
      const handleVisibilityChange = () => {
        if (document.hidden) {
          cancelAnimationFrame(animationFrame);
          animationFrame = 0;
          return;
        }
        timer.reset();
        startAnimation();
      };
      document.addEventListener("visibilitychange", handleVisibilityChange);
      startAnimation();

      runtimeRef.current = { camera, controls, nodes: nodeRuntimes, relations: relationRuntimes, bloomPass };
      queueMicrotask(() => {
        if (!disposed) setReadyVersion((version) => version + 1);
      });

      return () => {
        disposed = true;
        runtimeRef.current = null;
        cancelAnimationFrame(animationFrame);
        resizeObserver.disconnect();
        renderer.domElement.removeEventListener("pointermove", handlePointerMove);
        renderer.domElement.removeEventListener("pointerleave", handlePointerLeave);
        renderer.domElement.removeEventListener("pointerdown", handlePointerDown);
        renderer.domElement.removeEventListener("pointerup", handlePointerUp);
        renderer.domElement.removeEventListener("wheel", handleWheel);
        renderer.domElement.removeEventListener("webglcontextlost", handleContextLost);
        document.removeEventListener("visibilitychange", handleVisibilityChange);
        controls.removeEventListener("start", handleControlsStart);
        animationContext.revert();
        controls.dispose();
        timer.dispose();
        focusTweenRef.current?.kill();
        wheelTween?.kill();
        scene.traverse((object) => {
          if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points) {
            object.geometry.dispose();
          }
          if (object instanceof THREE.Mesh || object instanceof THREE.Line || object instanceof THREE.Points || object instanceof THREE.Sprite) {
            const materials = Array.isArray(object.material) ? object.material : [object.material];
            materials.forEach((material) => material.dispose());
          }
        });
        textures.forEach((texture) => texture.dispose());
        bloomPass.dispose();
        (composer as EffectComposer & { dispose?: () => void }).dispose?.();
        renderer.dispose();
        renderer.domElement.remove();
        labelRenderer.domElement.remove();
      };
    } catch {
      callbacksRef.current.onError();
      return;
    }
  }, []);

  useEffect(() => {
    const runtime = runtimeRef.current;
    if (!runtime) return;

    const activeId = hoveredId ?? selectedId;
    for (const [nodeId, nodeRuntime] of runtime.nodes) {
      const isVisible = visibleSet.has(nodeId);
      const selected = nodeId === selectedId;
      const hovered = nodeId === hoveredId;
      const showLabel =
        isVisible &&
        (selected || hovered || (nodeRuntime.node.layer === "core" && selectedId === "fde") || (selectedId === "fde" && overviewLabelIds.has(nodeId)));

      nodeRuntime.hitArea.layers.set(isVisible ? 0 : 31);
      for (const visual of nodeRuntime.visualMaterials) {
        const targetOpacity = isVisible ? visual.baseOpacity * (selected ? 1.06 : hovered ? 1.03 : 1) : 0.012;
        gsap.to(visual.material, {
          opacity: Math.min(1, targetOpacity),
          duration: 0.4,
          overwrite: true,
        });
      }

      const targetScale = selected ? 1.18 : hovered ? 1.1 : 1;
      gsap.to(nodeRuntime.group.scale, {
        x: targetScale,
        y: targetScale,
        z: targetScale,
        duration: 0.5,
        ease: "power3.out",
        overwrite: true,
      });

      nodeRuntime.label.classList.toggle(styles.nodeLabelHidden, !showLabel);
      nodeRuntime.label.classList.toggle(styles.nodeLabelActive, selected || hovered);
      nodeRuntime.label.toggleAttribute("hidden", !showLabel);
      nodeRuntime.label.setAttribute("tabindex", showLabel ? "0" : "-1");
      nodeRuntime.label.setAttribute("aria-hidden", showLabel ? "false" : "true");
      if (selected) nodeRuntime.label.setAttribute("aria-current", "true");
      else nodeRuntime.label.removeAttribute("aria-current");
    }

    for (const relationRuntime of runtime.relations) {
      const isVisible = visibleSet.has(relationRuntime.relation.source) && visibleSet.has(relationRuntime.relation.target);
      const isActive =
        relationRuntime.relation.source === activeId ||
        relationRuntime.relation.target === activeId ||
        (activeId === "fde" && relationRuntime.relation.type === "flow");
      const targetOpacity = isVisible
        ? relationRuntime.baseOpacity * (isActive ? (relationRuntime.relation.type === "flow" ? 1.25 : 1.55) : 0.56)
        : 0.006;
      const targetSpineOpacity = isVisible
        ? relationRuntime.baseSpineOpacity * (isActive ? (relationRuntime.relation.type === "flow" ? 1.55 : 1.75) : 0.72)
        : 0.008;
      gsap.to(relationRuntime.lineMaterial, {
        opacity: Math.min(0.38, targetOpacity * 0.56),
        duration: 0.38,
        overwrite: true,
      });
      gsap.to(relationRuntime.spineMaterial, {
        opacity: Math.min(0.68, targetSpineOpacity),
        duration: 0.38,
        overwrite: true,
      });
      relationRuntime.spark.layers.set(isVisible && (isActive || relationRuntime.relation.type === "flow") ? 0 : 31);
    }
  }, [hoveredId, readyVersion, selectedId, visibleSet]);

  useEffect(() => {
    const runtime = runtimeRef.current;
    if (!runtime) return;

    let target: THREE.Vector3;
    let destination: THREE.Vector3;
    let viewDirection = runtime.camera.position.clone().sub(runtime.controls.target).normalize();
    const focusedNodeRuntime = focusNodeId ? runtime.nodes.get(focusNodeId) : null;

    if (focusNodeId === null) {
      const overviewFrame = getOverviewFrame(runtime.camera.aspect);
      target = overviewFrame.target;
      destination = overviewFrame.position;
    } else {
      if (!focusedNodeRuntime) return;

      target = new THREE.Vector3();
      focusedNodeRuntime.group.getWorldPosition(target);
      viewDirection = runtime.camera.position.clone().sub(runtime.controls.target).normalize();
      const distance =
        focusedNodeRuntime.node.layer === "core"
          ? 22
          : focusedNodeRuntime.node.layer === "delivery"
            ? 14
            : focusedNodeRuntime.node.layer === "capability"
              ? 10.5
              : 9;
      destination = target.clone().add(viewDirection.clone().multiplyScalar(distance));
      destination.y += focusedNodeRuntime.node.layer === "core" ? 1.4 : 0.55;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    focusTweenRef.current?.kill();
    if (reducedMotion) {
      runtime.camera.position.copy(destination);
      runtime.controls.target.copy(target);
      runtime.camera.fov = focusNodeId ? 36 : 42;
      runtime.camera.updateProjectionMatrix();
      runtime.bloomPass.strength = focusNodeId ? 0.6 : 0.52;
      runtime.controls.update();
      return;
    }

    const fovState = { value: runtime.camera.fov };
    const timeline = gsap.timeline({ defaults: { overwrite: "auto" } });

    if (focusNodeId) {
      const stagingPosition = destination.clone().add(viewDirection.clone().multiplyScalar(2.4));
      timeline
        .to(runtime.bloomPass, { strength: 0.64, duration: 0.32, ease: "power2.out" }, 0)
        .to(runtime.bloomPass, { strength: 0.6, duration: 0.52, ease: "power2.inOut" }, 0.32)
        .to(
          runtime.camera.position,
          {
            x: stagingPosition.x,
            y: stagingPosition.y,
            z: stagingPosition.z,
            duration: 0.78,
            ease: "power3.inOut",
            onUpdate: () => runtime.controls.update(),
          },
          0
        )
        .to(
          runtime.camera.position,
          {
            x: destination.x,
            y: destination.y,
            z: destination.z,
            duration: 0.5,
            ease: "power3.out",
            onUpdate: () => runtime.controls.update(),
          },
          0.72
        );
    } else {
      timeline
        .to(runtime.bloomPass, { strength: 0.52, duration: 0.72, ease: "power2.inOut" }, 0)
        .to(
          runtime.camera.position,
          {
            x: destination.x,
            y: destination.y,
            z: destination.z,
            duration: 1.15,
            ease: "power3.inOut",
            onUpdate: () => runtime.controls.update(),
          },
          0
        );
    }

    timeline
      .to(
        runtime.controls.target,
        {
          x: target.x,
          y: target.y,
          z: target.z,
          duration: focusNodeId ? 1.08 : 1.15,
          ease: "power3.inOut",
          onUpdate: () => runtime.controls.update(),
        },
        0
      )
      .to(
        fovState,
        {
          value: focusNodeId ? 36 : 42,
          duration: 0.86,
          ease: "power2.inOut",
          onUpdate: () => {
            runtime.camera.fov = fovState.value;
            runtime.camera.updateProjectionMatrix();
          },
        },
        0
      );

    if (focusedNodeRuntime) {
      timeline.fromTo(
        focusedNodeRuntime.group.scale,
        { x: 0.96, y: 0.96, z: 0.96 },
        { x: 1.18, y: 1.18, z: 1.18, duration: 0.82, ease: "elastic.out(1, 0.58)" },
        0.42
      );
    }

    focusTweenRef.current = timeline;
  }, [focusNodeId, focusVersion, readyVersion]);

  return <div ref={mountRef} className={styles.sceneMount} />;
}
