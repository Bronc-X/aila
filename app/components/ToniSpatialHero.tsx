"use client";

import Hls from "hls.js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  type MouseEvent as ReactMouseEvent,
  type WheelEvent as ReactWheelEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styles from "./ToniSpatialHero.module.css";

type Vec3 = { x: number; y: number; z: number };
type Camera = { x: number; y: number; z: number; yaw: number; pitch: number };
type Projected = Vec3 & { scale: number; visible: boolean };
type HitZone = { id: string; href: string; x: number; y: number; w: number; h: number; depth: number };
type PointerState = {
  x: number;
  y: number;
  hasPointer: boolean;
};
type GateKind = "word" | "panel" | "cube";
type BackgroundVideo = {
  id: string;
  label: string;
  src: string;
  kind: "mp4" | "hls";
};
type Gate = {
  id: string;
  href: string;
  title: string;
  eyebrow: string;
  copy: string;
  x: number;
  y: number;
  z: number;
  width: number;
  height: number;
  depth: number;
  rotY: number;
  tint: string;
  kind: GateKind;
  warp: number;
};

const backgroundVideos: BackgroundVideo[] = [
  {
    id: "dark-veil",
    label: "Dark Veil",
    kind: "mp4",
    src: "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260330_145725_08886141-ed95-4a8e-8d6d-b75eaadce638.mp4",
  },
  {
    id: "silk-flow",
    label: "Silk Flow",
    kind: "hls",
    src: "https://stream.mux.com/01yW6GoUz01OTXk5w1Rt1MHkJWlCGIwj46SUONJZ4DJUE.m3u8",
  },
];

const gates: Gate[] = [
  {
    id: "toni",
    href: "/about",
    title: "TONI",
    eyebrow: "关于 Toni",
    copy: "个人介绍、方法与合作背景",
    x: 20,
    y: -116,
    z: 260,
    width: 720,
    height: 260,
    depth: 120,
    rotY: -0.18,
    tint: "#ff3b1f",
    kind: "word",
    warp: 24,
  },
  {
    id: "work",
    href: "/work",
    title: "WORK",
    eyebrow: "代表作品",
    copy: "AILA / Antios / QuantMAx",
    x: 430,
    y: -128,
    z: 76,
    width: 316,
    height: 190,
    depth: 52,
    rotY: -0.5,
    tint: "#fff3dc",
    kind: "panel",
    warp: 32,
  },
  {
    id: "services",
    href: "/services",
    title: "SERVICES",
    eyebrow: "企业合作",
    copy: "诊断、原型与系统落地",
    x: -560,
    y: 94,
    z: -150,
    width: 360,
    height: 210,
    depth: 58,
    rotY: 0.44,
    tint: "#a8f06a",
    kind: "panel",
    warp: 28,
  },
  {
    id: "aila",
    href: "/aila",
    title: "AILA",
    eyebrow: "AI 工作台",
    copy: "面向经营流程的工具矩阵",
    x: 20,
    y: 228,
    z: -318,
    width: 244,
    height: 244,
    depth: 150,
    rotY: 0.08,
    tint: "#8ed6ce",
    kind: "cube",
    warp: 22,
  },
  {
    id: "training",
    href: "/training",
    title: "TRAINING",
    eyebrow: "课程训练",
    copy: "工作坊、Slides 与工具入口",
    x: 554,
    y: 158,
    z: -552,
    width: 308,
    height: 184,
    depth: 48,
    rotY: -0.34,
    tint: "#f0c56b",
    kind: "panel",
    warp: 22,
  },
];

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

const wrap = (value: number, size: number) => {
  const wrapped = value % size;
  return wrapped < 0 ? wrapped + size : wrapped;
};

const seeded = (index: number) => {
  const x = Math.sin(index * 987.231) * 10000;
  return x - Math.floor(x);
};

function rotateY(point: Vec3, angle: number) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return {
    x: point.x * c - point.z * s,
    y: point.y,
    z: point.x * s + point.z * c,
  };
}

function rotateX(point: Vec3, angle: number) {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return {
    x: point.x,
    y: point.y * c - point.z * s,
    z: point.y * s + point.z * c,
  };
}

function mix(hex: string, alpha: number) {
  return `${hex}${Math.round(clamp(alpha, 0, 1) * 255)
    .toString(16)
    .padStart(2, "0")}`;
}

function drawPolygon(
  ctx: CanvasRenderingContext2D,
  points: Projected[],
  fill: string,
  stroke?: string,
) {
  if (points.some((point) => !point.visible)) return;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i += 1) ctx.lineTo(points[i].x, points[i].y);
  ctx.closePath();
  ctx.fillStyle = fill;
  ctx.fill();
  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function strokeProjectedLine(
  ctx: CanvasRenderingContext2D,
  from: Projected,
  to: Projected,
  stroke: string,
  width = 1,
) {
  if (!from.visible || !to.visible) return;
  ctx.beginPath();
  ctx.moveTo(from.x, from.y);
  ctx.lineTo(to.x, to.y);
  ctx.strokeStyle = stroke;
  ctx.lineWidth = width;
  ctx.stroke();
}

export default function ToniSpatialHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hitZonesRef = useRef<HitZone[]>([]);
  const cameraRef = useRef<Camera>({ x: 0, y: 0, z: 0, yaw: -0.02, pitch: -0.035 });
  const targetRef = useRef<Camera>({ x: 0, y: 0, z: 0, yaw: -0.02, pitch: -0.035 });
  const velocityRef = useRef(0);
  const dragRef = useRef({ active: false, moved: false, x: 0, y: 0, yaw: 0, pitch: 0 });
  const pointerRef = useRef<PointerState>({ x: 0, y: 0, hasPointer: false });
  const [activeVideoId, setActiveVideoId] = useState(backgroundVideos[0].id);
  const [activeId, setActiveId] = useState("toni");
  const router = useRouter();
  const activeVideo = backgroundVideos.find((video) => video.id === activeVideoId) ?? backgroundVideos[0];

  const stars = useMemo(
    () =>
      Array.from({ length: 96 }, (_, index) => ({
        x: (seeded(index + 1) - 0.5) * 2300,
        y: (seeded(index + 2) - 0.5) * 1300,
        z: seeded(index + 3) * 2600 - 800,
        r: 0.34 + seeded(index + 4) * 1.1,
      })),
    [],
  );

  const project = useCallback((point: Vec3, width: number, height: number): Projected => {
    const camera = cameraRef.current;
    let local: Vec3 = {
      x: point.x - camera.x,
      y: point.y - camera.y,
      z: point.z - camera.z,
    };
    local = rotateY(local, -camera.yaw);
    local = rotateX(local, -camera.pitch);
    const depth = local.z + 980;
    if (depth < 70) return { x: 0, y: 0, z: depth, scale: 0, visible: false };
    const scale = 820 / depth;
    return {
      x: width / 2 + local.x * scale,
      y: height / 2 + local.y * scale,
      z: depth,
      scale,
      visible: true,
    };
  }, []);

  const resolveGateCenter = useCallback((gate: Gate, time: number) => {
    const camera = cameraRef.current;
    const localZ = wrap(gate.z - camera.z * 0.5, 2200) - 820;
    const phase = time * 0.00054 + gate.z * 0.012 + camera.z * 0.002;
    return {
      x: gate.x + Math.sin(phase) * gate.warp,
      y: gate.y + Math.cos(phase * 0.84) * gate.warp * 0.58,
      z: camera.z + localZ,
      localZ,
      phase,
    };
  }, []);

  const drawAtmosphere = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    ctx.save();
    ctx.globalCompositeOperation = "screen";

    const amber = ctx.createRadialGradient(width * 0.22, height * 0.25, 0, width * 0.22, height * 0.25, width * 0.68);
    amber.addColorStop(0, "rgba(255, 59, 31, 0.16)");
    amber.addColorStop(0.34, "rgba(119, 38, 15, 0.07)");
    amber.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = amber;
    ctx.fillRect(0, 0, width, height);

    const tealDrift = Math.sin(time * 0.00016) * 58;
    const teal = ctx.createRadialGradient(width * 0.72 + tealDrift, height * 0.38, 0, width * 0.72 + tealDrift, height * 0.38, width * 0.54);
    teal.addColorStop(0, "rgba(81, 196, 182, 0.105)");
    teal.addColorStop(0.46, "rgba(22, 75, 72, 0.062)");
    teal.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = teal;
    ctx.fillRect(0, 0, width, height);

    const floorGlow = ctx.createRadialGradient(width * 0.52, height * 1.02, 0, width * 0.52, height * 1.02, height * 0.62);
    floorGlow.addColorStop(0, "rgba(168, 240, 106, 0.105)");
    floorGlow.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = floorGlow;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }, []);

  const drawStars = useCallback((
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number,
  ) => {
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    stars.forEach((star, index) => {
      const z = cameraRef.current.z + wrap(star.z - cameraRef.current.z * 0.25, 2600) - 900;
      const point = project({ x: star.x, y: star.y, z }, width, height);
      if (!point.visible) return;
      const twinkle = 0.66 + Math.sin(time * 0.0012 + index * 1.7) * 0.34;
      const alpha = clamp((1 - point.z / 2200) * twinkle, 0, 0.18);
      const tint = index % 9 === 0 ? "168, 240, 106" : index % 7 === 0 ? "255, 218, 176" : "234, 246, 244";
      ctx.beginPath();
      ctx.arc(point.x, point.y, Math.max(0.45, star.r * point.scale), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${tint}, ${alpha})`;
      ctx.fill();
      if (star.r > 1.55) {
        ctx.beginPath();
        ctx.arc(point.x, point.y, star.r * point.scale * 5.5, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${tint}, ${alpha * 0.04})`;
        ctx.fill();
      }
    });
    ctx.restore();
  }, [project, stars]);

  const drawTunnel = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    const camera = cameraRef.current;
    const halfW = 1040;
    const halfH = 650;
    const spacing = 142;
    const start = Math.floor((camera.z - 920) / spacing) * spacing;
    const layers = Array.from({ length: 23 }, (_, index) => start + index * spacing);

    ctx.save();
    ctx.globalCompositeOperation = "screen";

    layers.forEach((z, index) => {
      const wobble = Math.sin(time * 0.00028 + index * 0.72) * 24;
      const corners = [
        project({ x: -halfW + wobble, y: -halfH, z }, width, height),
        project({ x: halfW + wobble, y: -halfH, z }, width, height),
        project({ x: halfW - wobble * 0.45, y: halfH, z }, width, height),
        project({ x: -halfW - wobble * 0.45, y: halfH, z }, width, height),
      ];
      const center = project({ x: 0, y: 0, z }, width, height);
      const alpha = clamp(0.28 - Math.abs(center.z - 780) / 3800, 0.018, 0.19);
      const stroke = `rgba(226, 242, 236, ${alpha})`;

      strokeProjectedLine(ctx, corners[0], corners[1], stroke);
      strokeProjectedLine(ctx, corners[1], corners[2], stroke);
      strokeProjectedLine(ctx, corners[2], corners[3], `rgba(168, 240, 106, ${alpha * 0.7})`);
      strokeProjectedLine(ctx, corners[3], corners[0], stroke);

      if (index % 2 === 0) {
        const midLeft = project({ x: -halfW + wobble, y: 0, z }, width, height);
        const midRight = project({ x: halfW - wobble * 0.4, y: 0, z }, width, height);
        const midTop = project({ x: 0, y: -halfH, z }, width, height);
        const midBottom = project({ x: 0, y: halfH, z }, width, height);
        strokeProjectedLine(ctx, midLeft, midRight, `rgba(226, 242, 236, ${alpha * 0.42})`);
        strokeProjectedLine(ctx, midTop, midBottom, `rgba(226, 242, 236, ${alpha * 0.36})`);
      }

      if (index % 3 === 0) {
        const innerW = halfW * 0.64;
        const innerH = halfH * 0.56;
        const inner = [
          project({ x: -innerW + wobble * 0.4, y: -innerH, z }, width, height),
          project({ x: innerW + wobble * 0.25, y: -innerH, z }, width, height),
          project({ x: innerW - wobble * 0.2, y: innerH, z }, width, height),
          project({ x: -innerW - wobble * 0.2, y: innerH, z }, width, height),
        ];
        strokeProjectedLine(ctx, inner[0], inner[1], `rgba(255, 249, 234, ${alpha * 0.32})`);
        strokeProjectedLine(ctx, inner[1], inner[2], `rgba(255, 249, 234, ${alpha * 0.26})`);
        strokeProjectedLine(ctx, inner[2], inner[3], `rgba(168, 240, 106, ${alpha * 0.24})`);
        strokeProjectedLine(ctx, inner[3], inner[0], `rgba(255, 249, 234, ${alpha * 0.26})`);
      }
    });

    const rails = [-880, -640, -420, -180, 0, 180, 420, 640, 880];
    const levels = [-560, -390, -250, -120, 0, 130, 260, 400, 540];
    for (let index = 0; index < layers.length - 1; index += 1) {
      const zA = layers[index];
      const zB = layers[index + 1];
      const alpha = 0.034 + (index % 4) * 0.009;
      rails.forEach((x, railIndex) => {
        if (railIndex % 2 === 0) {
          strokeProjectedLine(
            ctx,
            project({ x, y: -halfH, z: zA }, width, height),
            project({ x, y: -halfH, z: zB }, width, height),
            `rgba(226, 242, 236, ${alpha})`,
          );
          strokeProjectedLine(
            ctx,
            project({ x, y: halfH, z: zA }, width, height),
            project({ x, y: halfH, z: zB }, width, height),
            `rgba(168, 240, 106, ${alpha * 0.78})`,
          );
        }
      });
      levels.forEach((y, levelIndex) => {
        if (levelIndex % 2 === 1) {
          strokeProjectedLine(
            ctx,
            project({ x: -halfW, y, z: zA }, width, height),
            project({ x: -halfW, y, z: zB }, width, height),
            `rgba(226, 242, 236, ${alpha})`,
          );
          strokeProjectedLine(
            ctx,
            project({ x: halfW, y, z: zA }, width, height),
            project({ x: halfW, y, z: zB }, width, height),
            `rgba(226, 242, 236, ${alpha})`,
          );
        }
      });
    }

    for (let i = 0; i < 18; i += 1) {
      const x = (seeded(i + 41) - 0.5) * halfW * 1.8;
      const y = (seeded(i + 77) - 0.5) * halfH * 1.62;
      const z = camera.z + seeded(i + 101) * 1700 - 520;
      const point = project({ x, y, z }, width, height);
      if (!point.visible) continue;
      const spark = clamp(1 - point.z / 1900, 0, 1);
      ctx.beginPath();
      ctx.arc(point.x, point.y, Math.max(0.9, 2.2 * point.scale), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 255, 246, ${spark * 0.34})`;
      ctx.shadowColor = i % 4 === 0 ? "#a8f06a" : "#ffffff";
      ctx.shadowBlur = 8 * spark;
      ctx.fill();
    }

    ctx.restore();
  }, [project]);

  const drawGlassSheets = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    const camera = cameraRef.current;
    const sheets = Array.from({ length: 8 }, (_, index) => {
      const z = camera.z + wrap(index * 315 - camera.z * 0.32, 2200) - 720;
      return {
        x: (seeded(index + 211) - 0.5) * 1320,
        y: (seeded(index + 233) - 0.5) * 620,
        z,
        w: 210 + seeded(index + 277) * 240,
        h: 120 + seeded(index + 299) * 180,
        rot: -0.55 + seeded(index + 311) * 1.1,
        tint: index % 3 === 0 ? "142, 214, 206" : index % 3 === 1 ? "255, 190, 105" : "255, 246, 229",
      };
    });

    ctx.save();
    ctx.globalCompositeOperation = "screen";

    sheets.forEach((sheet, index) => {
      const halfW = sheet.w / 2;
      const halfH = sheet.h / 2;
      const corners = [
        { x: -halfW, y: -halfH, z: 0 },
        { x: halfW, y: -halfH, z: 0 },
        { x: halfW, y: halfH, z: 0 },
        { x: -halfW, y: halfH, z: 0 },
      ].map((corner) => {
        const rotated = rotateY(corner, sheet.rot + Math.sin(time * 0.0002 + index) * 0.04);
        return project(
          {
            x: rotated.x + sheet.x,
            y: rotated.y + sheet.y + Math.sin(time * 0.00018 + index * 1.7) * 14,
            z: rotated.z + sheet.z,
          },
          width,
          height,
        );
      });
      if (corners.some((point) => !point.visible)) return;

      const center = project({ x: sheet.x, y: sheet.y, z: sheet.z }, width, height);
      const alpha = clamp(0.24 - center.z / 6200, 0.018, 0.1);
      drawPolygon(ctx, corners, `rgba(${sheet.tint}, ${alpha * 0.24})`, `rgba(${sheet.tint}, ${alpha})`);
      strokeProjectedLine(ctx, corners[0], corners[2], `rgba(255, 246, 229, ${alpha * 0.55})`, 0.75);
      strokeProjectedLine(ctx, corners[1], corners[3], `rgba(255, 246, 229, ${alpha * 0.28})`, 0.75);
    });

    const horizonY = height * 0.58 + Math.sin(time * 0.00016) * 20;
    const horizon = ctx.createLinearGradient(0, horizonY - 80, width, horizonY + 80);
    horizon.addColorStop(0, "rgba(0, 0, 0, 0)");
    horizon.addColorStop(0.45, "rgba(142, 214, 206, 0.045)");
    horizon.addColorStop(0.52, "rgba(255, 246, 229, 0.032)");
    horizon.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = horizon;
    ctx.fillRect(0, horizonY - 120, width, 220);

    ctx.restore();
  }, [project]);

  const drawWordGate = useCallback((
    ctx: CanvasRenderingContext2D,
    gate: Gate,
    width: number,
    height: number,
    time: number,
  ) => {
    const resolved = resolveGateCenter(gate, time);
    const center = project(resolved, width, height);
    if (!center.visible) return;

    const fontSize = clamp(gate.height * center.scale * 1.38, 88, 250);
    const active = activeId === gate.id;
    const depthOffset = clamp(fontSize * 0.12, 9, 28);
    const alpha = clamp(1 - center.z / 2000, 0.2, 1);

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = `900 ${fontSize}px Arial Black, Impact, sans-serif`;

    ctx.globalCompositeOperation = "screen";
    ctx.filter = `blur(${clamp(fontSize * 0.065, 7, 18)}px)`;
    ctx.fillStyle = `rgba(255, 59, 31, ${0.28 * alpha})`;
    ctx.fillText(gate.title, center.x - depthOffset * 0.3, center.y + depthOffset * 0.12);
    ctx.filter = "none";
    ctx.globalCompositeOperation = "source-over";

    for (let i = 34; i >= 1; i -= 1) {
      const shade = i / 34;
      ctx.fillStyle = `rgba(69, 18, 8, ${0.18 + shade * 0.3})`;
      ctx.fillText(
        gate.title,
        center.x + depthOffset * shade * (0.8 + Math.sin(time * 0.00035) * 0.08),
        center.y + depthOffset * shade * 0.42,
      );
    }

    ctx.shadowColor = "#ff3b1f";
    ctx.shadowBlur = active ? 24 : 16;
    ctx.fillStyle = `rgba(255, 63, 31, ${0.96 * alpha})`;
    ctx.fillText(gate.title, center.x, center.y);
    ctx.shadowBlur = 0;
    ctx.lineWidth = Math.max(1, 2.2 * center.scale);
    ctx.strokeStyle = "rgba(255, 183, 105, 0.26)";
    ctx.strokeText(gate.title, center.x, center.y);

    const labelY = center.y + fontSize * 0.54;
    ctx.font = `800 ${clamp(13 * center.scale, 9, 13)}px Arial, sans-serif`;
    ctx.fillStyle = "rgba(255, 244, 222, 0.72)";
    ctx.fillText("AI PRODUCT SYSTEMS", center.x, labelY);
    ctx.restore();

    const hitW = gate.width * center.scale;
    const hitH = gate.height * center.scale;
    hitZonesRef.current.push({
      id: gate.id,
      href: gate.href,
      x: center.x - hitW / 2,
      y: center.y - hitH / 2,
      w: hitW,
      h: hitH,
      depth: center.z,
    });
  }, [activeId, project, resolveGateCenter]);

  const drawPanelGate = useCallback((
    ctx: CanvasRenderingContext2D,
    gate: Gate,
    width: number,
    height: number,
    time: number,
  ) => {
    const resolved = resolveGateCenter(gate, time);
    const center = {
      x: resolved.x,
      y: resolved.y,
      z: resolved.z,
    };
    const halfW = gate.width / 2;
    const halfH = gate.height / 2;
    const halfD = gate.depth / 2;
    const phase = resolved.phase;
    const rotation = gate.rotY + Math.sin(phase) * 0.035;
    const corners = [
      { x: -halfW, y: -halfH, z: -halfD },
      { x: halfW, y: -halfH, z: -halfD },
      { x: halfW, y: halfH, z: -halfD },
      { x: -halfW, y: halfH, z: -halfD },
      { x: -halfW, y: -halfH, z: halfD },
      { x: halfW, y: -halfH, z: halfD },
      { x: halfW, y: halfH, z: halfD },
      { x: -halfW, y: halfH, z: halfD },
    ].map((corner) => {
      const rotated = rotateY(corner, rotation);
      return {
        x: rotated.x + center.x,
        y: rotated.y + center.y,
        z: rotated.z + center.z,
      };
    });
    const projected = corners.map((corner) => project(corner, width, height));
    const frontCenter = project(center, width, height);
    if (!frontCenter.visible) return;

    const active = activeId === gate.id;
    const depthAlpha = clamp(1 - frontCenter.z / 2100, 0.18, 1);
    const faceFill = gate.kind === "cube" ? "rgba(8, 32, 38, 0.72)" : "rgba(255, 247, 229, 0.08)";

    drawPolygon(ctx, [projected[0], projected[1], projected[5], projected[4]], "rgba(0, 0, 0, 0.55)");
    drawPolygon(ctx, [projected[1], projected[2], projected[6], projected[5]], mix(gate.tint, 0.13 * depthAlpha));
    drawPolygon(ctx, [projected[2], projected[3], projected[7], projected[6]], "rgba(0, 0, 0, 0.48)");
    drawPolygon(ctx, [projected[4], projected[5], projected[6], projected[7]], faceFill, mix(gate.tint, active ? 0.62 : 0.24));

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    strokeProjectedLine(ctx, projected[4], project({ x: 0, y: 0, z: center.z - 420 }, width, height), `rgba(226, 242, 236, ${0.08 * depthAlpha})`);
    ctx.restore();

    const left = frontCenter.x - halfW * frontCenter.scale + 20 * frontCenter.scale;
    const top = frontCenter.y - halfH * frontCenter.scale + 20 * frontCenter.scale;
    const panelW = gate.width * frontCenter.scale;
    const panelH = gate.height * frontCenter.scale;

    ctx.save();
    ctx.shadowColor = gate.tint;
    ctx.shadowBlur = active ? 22 : 8;
    ctx.strokeStyle = mix(gate.tint, active ? 0.68 : 0.22);
    ctx.lineWidth = active ? 1.5 : 1;
    ctx.strokeRect(frontCenter.x - panelW / 2, frontCenter.y - panelH / 2, panelW, panelH);
    ctx.shadowBlur = 0;

    if (gate.id === "work") {
      const thumbW = panelW * 0.44;
      const thumbH = panelH * 0.32;
      const gradient = ctx.createLinearGradient(left, top, left + thumbW, top + thumbH);
      gradient.addColorStop(0, "rgba(255, 248, 230, 0.66)");
      gradient.addColorStop(0.5, "rgba(255, 59, 31, 0.34)");
      gradient.addColorStop(1, "rgba(9, 26, 25, 0.78)");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.roundRect(left, top, thumbW, thumbH, 8 * frontCenter.scale);
      ctx.fill();
    }

    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillStyle = "rgba(255, 246, 229, 0.58)";
    ctx.font = `800 ${clamp(12 * frontCenter.scale, 8, 12)}px Arial, sans-serif`;
    ctx.fillText(gate.eyebrow.toUpperCase(), left, top + (gate.id === "work" ? panelH * 0.42 : 0));
    ctx.fillStyle = gate.tint;
    ctx.font = `900 ${clamp(48 * frontCenter.scale, 27, 48)}px Georgia, Times New Roman, serif`;
    ctx.fillText(gate.title, left, top + (gate.id === "work" ? panelH * 0.52 : 26 * frontCenter.scale));
    ctx.fillStyle = "rgba(255, 246, 229, 0.76)";
    ctx.font = `800 ${clamp(14 * frontCenter.scale, 10, 14)}px Arial, sans-serif`;
    ctx.fillText(gate.copy, left, top + (gate.id === "work" ? panelH * 0.78 : 90 * frontCenter.scale));
    ctx.restore();

    hitZonesRef.current.push({
      id: gate.id,
      href: gate.href,
      x: frontCenter.x - panelW / 2,
      y: frontCenter.y - panelH / 2,
      w: panelW,
      h: panelH,
      depth: frontCenter.z,
    });
  }, [activeId, project, resolveGateCenter]);

  const drawForegroundFragments = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    const camera = cameraRef.current;
    const fragments = [
      { char: "A", x: -900, y: 260, z: camera.z + 120, size: 310, alpha: 0.2 },
      { char: "I", x: 800, y: 120, z: camera.z + 80, size: 360, alpha: 0.22 },
      { char: "T", x: 760, y: -430, z: camera.z + 160, size: 280, alpha: 0.14 },
      { char: "O", x: -760, y: -350, z: camera.z + 260, size: 230, alpha: 0.12 },
    ];

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "900 260px Arial Black, Impact, sans-serif";
    ctx.globalCompositeOperation = "screen";
    fragments.forEach((fragment, index) => {
      const point = project({ x: fragment.x + Math.sin(time * 0.0003 + index) * 40, y: fragment.y, z: fragment.z }, width, height);
      if (!point.visible) return;
      ctx.filter = `blur(${12 + index * 3}px)`;
      ctx.font = `900 ${fragment.size * point.scale}px Arial Black, Impact, sans-serif`;
      ctx.fillStyle = `rgba(255, 59, 31, ${fragment.alpha})`;
      ctx.fillText(fragment.char, point.x, point.y);
    });
    ctx.restore();
  }, [project]);

  const updateSignalPointer = useCallback((width: number, height: number, time: number) => {
    const pointer = pointerRef.current;
    if (!pointer.x || !pointer.y || !pointer.hasPointer) {
      pointer.x = width * (0.54 + Math.sin(time * 0.00014) * 0.18);
      pointer.y = height * (0.42 + Math.cos(time * 0.00018) * 0.12);
    }
  }, []);

  const drawSignalRibbons = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
    const pointer = pointerRef.current;
    const cursorX = pointer.hasPointer ? pointer.x : width * (0.52 + Math.sin(time * 0.00014) * 0.16);
    const cursorY = pointer.hasPointer ? pointer.y : height * (0.44 + Math.cos(time * 0.00018) * 0.12);
    const pullX = (cursorX - width / 2) * 0.045;
    const pullY = (cursorY - height / 2) * 0.035;

    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.lineCap = "round";

    for (let i = 0; i < 6; i += 1) {
      const baseY = height * (0.22 + i * 0.105);
      const amplitude = height * (0.018 + i * 0.003);
      const phase = time * (0.00028 + i * 0.000035) + i * 1.36;
      const gradient = ctx.createLinearGradient(0, baseY, width, baseY + amplitude * 2);
      gradient.addColorStop(0, "rgba(0, 0, 0, 0)");
      gradient.addColorStop(0.18, i % 2 === 0 ? "rgba(142, 214, 206, 0.13)" : "rgba(255, 190, 105, 0.12)");
      gradient.addColorStop(0.48, "rgba(255, 246, 229, 0.16)");
      gradient.addColorStop(0.82, i % 2 === 0 ? "rgba(255, 59, 31, 0.13)" : "rgba(168, 240, 106, 0.11)");
      gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

      for (let pass = 0; pass < 2; pass += 1) {
        ctx.beginPath();
        for (let x = -90; x <= width + 90; x += 26) {
          const drift = Math.sin(x * 0.0042 + phase) * amplitude + Math.sin(x * 0.009 + phase * 0.7) * amplitude * 0.45;
          const perspective = (x / width - 0.5) * (i - 2.5) * 18;
          const y = baseY + drift + perspective + pullY * (0.2 + i * 0.08);
          const warpedX = x + pullX * Math.sin(i + x * 0.003);
          if (x === -90) ctx.moveTo(warpedX, y);
          else ctx.lineTo(warpedX, y);
        }
        ctx.strokeStyle = gradient;
        ctx.lineWidth = pass === 0 ? 24 - i * 2 : 1.35;
        ctx.globalAlpha = pass === 0 ? 0.18 : 0.9;
        ctx.filter = pass === 0 ? "blur(10px)" : "none";
        ctx.stroke();
      }
    }

    ctx.filter = "none";
    ctx.globalAlpha = 1;
    for (let i = 0; i < 5; i += 1) {
      const sweep = wrap(time * (0.035 + i * 0.006) + i * 360, width + 520) - 260;
      const y = height * (0.16 + seeded(i + 401) * 0.72);
      const beam = ctx.createLinearGradient(sweep - 180, y - 90, sweep + 260, y + 90);
      beam.addColorStop(0, "rgba(0, 0, 0, 0)");
      beam.addColorStop(0.46, i % 2 === 0 ? "rgba(142, 214, 206, 0.11)" : "rgba(255, 190, 105, 0.095)");
      beam.addColorStop(0.5, "rgba(255, 246, 229, 0.14)");
      beam.addColorStop(0.56, i % 2 === 0 ? "rgba(255, 59, 31, 0.085)" : "rgba(168, 240, 106, 0.08)");
      beam.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.save();
      ctx.translate(sweep, y);
      ctx.rotate(-0.26 + i * 0.1);
      ctx.fillStyle = beam;
      ctx.fillRect(-260, -12 - i * 1.2, 540, 22 + i * 2);
      ctx.restore();
    }

    ctx.restore();
  }, []);

  const drawScene = useCallback((
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number,
  ) => {
    const background = ctx.createRadialGradient(width * 0.48, height * 0.42, 0, width * 0.48, height * 0.42, Math.max(width, height) * 0.84);
    background.addColorStop(0, "rgba(7, 8, 8, 0.58)");
    background.addColorStop(0.42, "rgba(1, 3, 4, 0.66)");
    background.addColorStop(1, "rgba(0, 0, 0, 0.9)");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    drawAtmosphere(ctx, width, height, time);
    drawStars(ctx, width, height, time);
    drawTunnel(ctx, width, height, time);
    drawGlassSheets(ctx, width, height, time);

    hitZonesRef.current = [];
    [...gates]
      .sort((a, b) => resolveGateCenter(b, time).localZ - resolveGateCenter(a, time).localZ)
      .forEach((gate) => {
        if (gate.kind === "word") {
          drawWordGate(ctx, gate, width, height, time);
        } else {
          drawPanelGate(ctx, gate, width, height, time);
        }
      });

    drawForegroundFragments(ctx, width, height, time);
    drawSignalRibbons(ctx, width, height, time);
  }, [drawAtmosphere, drawForegroundFragments, drawGlassSheets, drawPanelGate, drawSignalRibbons, drawStars, drawTunnel, drawWordGate, resolveGateCenter]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    let hls: Hls | undefined;
    video.pause();
    video.removeAttribute("src");
    video.load();

    if (activeVideo.kind === "hls" && Hls.isSupported()) {
      hls = new Hls({ enableWorker: true });
      hls.loadSource(activeVideo.src);
      hls.attachMedia(video);
    } else {
      video.src = activeVideo.src;
    }

    const play = () => {
      void video.play().catch(() => undefined);
    };

    video.addEventListener("loadedmetadata", play, { once: true });
    play();

    return () => {
      video.removeEventListener("loadedmetadata", play);
      hls?.destroy();
    };
  }, [activeVideo]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    let animation = 0;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const render = (time: number) => {
      const camera = cameraRef.current;
      const target = targetRef.current;
      if (!dragRef.current.active) {
        camera.x += (target.x - camera.x) * 0.035;
        camera.y += (target.y - camera.y) * 0.035;
        camera.yaw += (target.yaw - camera.yaw) * 0.035;
        camera.pitch += (target.pitch - camera.pitch) * 0.035;
      }
      camera.z += reduceMotion ? 0 : 0.42 + velocityRef.current;
      velocityRef.current *= 0.9;
      updateSignalPointer(width, height, time);

      ctx.clearRect(0, 0, width, height);
      drawScene(ctx, width, height, time);
      animation = window.requestAnimationFrame(render);
    };

    resize();
    window.addEventListener("resize", resize);
    animation = window.requestAnimationFrame(render);
    return () => {
      window.removeEventListener("resize", resize);
      window.cancelAnimationFrame(animation);
    };
  }, [drawScene, updateSignalPointer]);

  const focusGate = (gate: Gate) => {
    setActiveId(gate.id);
    targetRef.current = {
      ...targetRef.current,
      x: gate.x * 0.13,
      y: gate.y * 0.1,
      yaw: gate.rotY * 0.22,
      pitch: gate.id === "toni" ? -0.045 : -0.02,
    };
    velocityRef.current += 18;
  };

  const handleWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    velocityRef.current += event.deltaY * 0.12;
  };

  const handleMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    dragRef.current = {
      active: true,
      moved: false,
      x: event.clientX,
      y: event.clientY,
      yaw: cameraRef.current.yaw,
      pitch: cameraRef.current.pitch,
    };
  };

  const handleMouseMove = (event: ReactMouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    pointerRef.current.x = event.clientX - rect.left;
    pointerRef.current.y = event.clientY - rect.top;
    pointerRef.current.hasPointer = true;

    if (!dragRef.current.active) return;
    const dx = event.clientX - dragRef.current.x;
    const dy = event.clientY - dragRef.current.y;
    if (Math.abs(dx) > 4 || Math.abs(dy) > 4) dragRef.current.moved = true;
    cameraRef.current.yaw = dragRef.current.yaw + dx * 0.0022;
    cameraRef.current.pitch = clamp(dragRef.current.pitch + dy * 0.0016, -0.34, 0.22);
  };

  const handleMouseUp = () => {
    dragRef.current.active = false;
    targetRef.current.yaw = cameraRef.current.yaw;
    targetRef.current.pitch = cameraRef.current.pitch;
  };

  const handleMouseLeave = () => {
    pointerRef.current.hasPointer = false;
    handleMouseUp();
  };

  const handleClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (dragRef.current.moved) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const hit = [...hitZonesRef.current]
      .filter((zone) => x >= zone.x && x <= zone.x + zone.w && y >= zone.y && y <= zone.y + zone.h)
      .sort((a, b) => {
        const areaA = a.w * a.h;
        const areaB = b.w * b.h;
        if (Math.abs(areaA - areaB) > 1) return areaA - areaB;
        return a.depth - b.depth;
      })[0];
    if (hit) router.push(hit.href);
  };

  return (
    <section
      className={styles.hero}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      aria-label="Toni spatial homepage"
    >
      <video ref={videoRef} className={styles.backgroundVideo} muted loop playsInline aria-hidden="true" />
      <canvas ref={canvasRef} className={styles.canvas} />
      <nav className={styles.nav} aria-label="Primary">
        <Link href="/" className={styles.brand}>
          Toni
        </Link>
        <div className={styles.links}>
          <Link href="/work">作品</Link>
          <Link href="/services">企业合作</Link>
          <Link href="/about">关于</Link>
          <Link href="/aila">AILA</Link>
          <Link href="/training">课程</Link>
        </div>
      </nav>
      <div className={styles.controls} aria-label="Spatial gates">
        {gates.map((gate) => (
          <Link
            key={gate.id}
            href={gate.href}
            aria-label={`Open ${gate.title}`}
            className={activeId === gate.id ? styles.active : ""}
            onMouseEnter={() => focusGate(gate)}
            onFocus={() => focusGate(gate)}
            onClick={(event) => {
              event.stopPropagation();
              focusGate(gate);
            }}
          >
            <span>{gate.eyebrow}</span>
            {gate.title}
          </Link>
        ))}
      </div>
      <div className={styles.videoPicker} aria-label="Visual texture">
        {backgroundVideos.map((video) => (
          <button
            key={video.id}
            type="button"
            className={activeVideoId === video.id ? styles.videoActive : ""}
            onClick={(event) => {
              event.stopPropagation();
              setActiveVideoId(video.id);
            }}
            aria-pressed={activeVideoId === video.id}
          >
            {video.label}
          </button>
        ))}
      </div>
    </section>
  );
}
