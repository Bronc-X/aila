"use client";

import Hls from "hls.js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Rocket,
} from "lucide-react";
import {
  type CSSProperties,
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
type CubeFace = {
  points: Projected[];
  fill: string | CanvasGradient | CanvasPattern;
  stroke: string;
  depth: number;
};
type BurstShard = {
  angle: number;
  distance: number;
  size: number;
  spin: number;
  tint: string;
};
type CrystalBurst = {
  id: string;
  key: string;
  x: number;
  y: number;
  start: number;
  tint: string;
  shards: BurstShard[];
};
type BurstStyle = CSSProperties & Record<`--${string}`, string>;
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
  english: string;
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

type ProofStat = {
  value: string;
  label: string;
  shortLabel: string;
  detail: string;
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
    id: "work",
    href: "/work",
    title: "案例",
    english: "WORK",
    eyebrow: "自己的作品",
    copy: "Cosic、智能招标、Lotus 和产品档案",
    x: 20,
    y: -116,
    z: 260,
    width: 720,
    height: 260,
    depth: 120,
    rotY: -0.18,
    tint: "#22d665",
    kind: "word",
    warp: 24,
  },
  {
    id: "tools",
    href: "/tools",
    title: "工具",
    english: "TOOLS",
    eyebrow: "AILA 系统",
    copy: "AILA 工具矩阵和两个新增内容工具",
    x: 486,
    y: -18,
    z: -190,
    width: 264,
    height: 264,
    depth: 264,
    rotY: -0.5,
    tint: "#ffd28a",
    kind: "panel",
    warp: 32,
  },
  {
    id: "plan",
    href: "/aila",
    title: "FDE",
    english: "FDE",
    eyebrow: "企业交付",
    copy: "诊断、交付、复用和增长飞轮",
    x: -540,
    y: 94,
    z: -150,
    width: 278,
    height: 278,
    depth: 278,
    rotY: 0.44,
    tint: "#a8f06a",
    kind: "panel",
    warp: 28,
  },
  {
    id: "contact",
    href: "/contact",
    title: "合作",
    english: "CONTACT",
    eyebrow: "关于 / 联系",
    copy: "发来业务现场，先判断哪里值得动",
    x: 20,
    y: 228,
    z: -318,
    width: 292,
    height: 292,
    depth: 292,
    rotY: 0.08,
    tint: "#8ed6ce",
    kind: "cube",
    warp: 22,
  },
];

const proofStats: ProofStat[] = [
  { value: "看案例", label: "自己的作品", shortLabel: "作品档案", detail: "Cosic、智能招标、Lotus、AntiAnxiety 和公开产品档案。" },
  { value: "试工具", label: "工具模块", shortLabel: "8 个模块", detail: "AILA 工具矩阵和新增内容工具统一进入 /tools。" },
  { value: "做方案", label: "企业 FDE", shortLabel: "交付方案", detail: "诊断、交付、复用和增长飞轮。" },
  { value: "聊合作", label: "关于联系", shortLabel: "发来场景", detail: "发来业务现场，先判断哪里值得动。" },
];

const heroWordLines = [
  { text: "欢迎来到", scale: 0.44, offset: -0.72, accent: false },
  { text: "Toni", scale: 1, offset: 0, accent: true },
  { text: "的主页", scale: 0.38, offset: 0.72, accent: false },
];

const lusieAiUrl = "/lusie";

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
  fill: string | CanvasGradient | CanvasPattern,
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

function drawProjectedEllipse(
  ctx: CanvasRenderingContext2D,
  center: Projected,
  radiusX: number,
  radiusY: number,
  rotation: number,
  stroke: string,
  width = 1,
) {
  if (!center.visible) return;
  ctx.beginPath();
  ctx.ellipse(center.x, center.y, radiusX, radiusY, rotation, 0, Math.PI * 2);
  ctx.strokeStyle = stroke;
  ctx.lineWidth = width;
  ctx.stroke();
}

function drawCrystalRim(
  ctx: CanvasRenderingContext2D,
  projected: Projected[],
  tint: string,
  depthAlpha: number,
  active: boolean,
) {
  const rimAlpha = (active ? 0.92 : 0.68) * depthAlpha;
  const glintAlpha = (active ? 0.62 : 0.38) * depthAlpha;

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.shadowColor = "#8f7cff";
  ctx.shadowBlur = active ? 28 : 18;
  strokeProjectedLine(ctx, projected[4], projected[5], `rgba(190, 206, 255, ${rimAlpha})`, 1.65);
  strokeProjectedLine(ctx, projected[5], projected[6], mix(tint, rimAlpha * 0.72), 1.45);
  strokeProjectedLine(ctx, projected[6], projected[7], `rgba(118, 122, 255, ${rimAlpha * 0.72})`, 1.25);
  strokeProjectedLine(ctx, projected[7], projected[4], `rgba(213, 233, 255, ${rimAlpha * 0.62})`, 1.3);
  strokeProjectedLine(ctx, projected[4], projected[0], `rgba(180, 186, 255, ${rimAlpha * 0.5})`, 1);
  strokeProjectedLine(ctx, projected[5], projected[1], `rgba(248, 255, 255, ${glintAlpha})`, 0.85);
  strokeProjectedLine(ctx, projected[6], projected[2], `rgba(126, 230, 255, ${glintAlpha * 0.8})`, 0.85);
  strokeProjectedLine(ctx, projected[7], projected[3], `rgba(142, 214, 206, ${glintAlpha * 0.56})`, 0.75);
  strokeProjectedLine(ctx, projected[4], projected[6], `rgba(236, 246, 255, ${glintAlpha * 0.34})`, 0.65);
  strokeProjectedLine(ctx, projected[5], projected[7], `rgba(137, 116, 255, ${glintAlpha * 0.3})`, 0.65);

  projected.slice(4).forEach((point, index) => {
    if (!point.visible) return;
    const radius = Math.max(1.2, 3.2 * point.scale);
    const glow = index % 2 === 0 ? "190, 206, 255" : "126, 230, 255";
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${glow}, ${glintAlpha * 0.82})`;
    ctx.fill();
  });
  ctx.restore();
}

function drawCrystalBurst(ctx: CanvasRenderingContext2D, burst: CrystalBurst, time: number) {
  const progress = clamp((time - burst.start) / 820, 0, 1);
  const easeOut = 1 - (1 - progress) ** 3;
  const alpha = 1 - progress;
  if (alpha <= 0) return;

  ctx.save();
  ctx.globalCompositeOperation = "screen";
  ctx.shadowColor = burst.tint;
  ctx.shadowBlur = 38 * alpha;

  const flash = ctx.createRadialGradient(burst.x, burst.y, 0, burst.x, burst.y, 170 * easeOut + 16);
  flash.addColorStop(0, `rgba(255, 246, 229, ${0.7 * alpha})`);
  flash.addColorStop(0.2, mix(burst.tint, 0.42 * alpha));
  flash.addColorStop(0.42, `rgba(239, 248, 255, ${0.24 * alpha})`);
  flash.addColorStop(0.5, "rgba(255, 255, 255, 0)");
  flash.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = flash;
  ctx.fillRect(burst.x - 220, burst.y - 220, 440, 440);

  ctx.beginPath();
  ctx.arc(burst.x, burst.y, 24 + easeOut * 135, 0, Math.PI * 2);
  ctx.strokeStyle = `rgba(255, 246, 229, ${0.56 * alpha})`;
  ctx.lineWidth = 2.4;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(burst.x, burst.y, 9 + easeOut * 86, 0, Math.PI * 2);
  ctx.strokeStyle = mix(burst.tint, 0.62 * alpha);
  ctx.lineWidth = 1.4;
  ctx.stroke();

  const ring = ctx.createRadialGradient(burst.x, burst.y, 0, burst.x, burst.y, 132 * easeOut + 10);
  ring.addColorStop(0, `rgba(255, 246, 229, ${0.26 * alpha})`);
  ring.addColorStop(0.28, mix(burst.tint, 0.24 * alpha));
  ring.addColorStop(0.44, `rgba(239, 248, 255, ${0.18 * alpha})`);
  ring.addColorStop(0.46, "rgba(255, 255, 255, 0)");
  ring.addColorStop(1, "rgba(255, 255, 255, 0)");
  ctx.fillStyle = ring;
  ctx.fillRect(burst.x - 180, burst.y - 180, 360, 360);

  burst.shards.forEach((shard, index) => {
    const radius = shard.distance * easeOut;
    const x = burst.x + Math.cos(shard.angle) * radius;
    const y = burst.y + Math.sin(shard.angle) * radius * 0.72 + progress * 18;
    const shardAlpha = alpha * (0.68 + seeded(index + 83) * 0.44);
    const length = shard.size * (1 - progress * 0.42);
    const width = Math.max(2, length * 0.32);
    const rotation = shard.angle + shard.spin * progress;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(rotation);
    ctx.beginPath();
    ctx.moveTo(0, -length * 0.52);
    ctx.lineTo(width, 0);
    ctx.lineTo(0, length * 0.48);
    ctx.lineTo(-width * 0.76, length * 0.08);
    ctx.closePath();
    const shardFill = ctx.createLinearGradient(-width, -length, width, length);
    shardFill.addColorStop(0, `rgba(255, 255, 255, ${0.72 * shardAlpha})`);
    shardFill.addColorStop(0.42, mix(shard.tint, 0.46 * shardAlpha));
    shardFill.addColorStop(1, `rgba(52, 232, 218, ${0.18 * shardAlpha})`);
    ctx.fillStyle = shardFill;
    ctx.fill();
    ctx.strokeStyle = `rgba(255, 246, 229, ${0.62 * shardAlpha})`;
    ctx.lineWidth = 0.9;
    ctx.stroke();
    ctx.restore();
  });

  ctx.restore();
}

function attachLoopingVideo(video: HTMLVideoElement, source: BackgroundVideo, playbackRate: number) {
  let hls: Hls | undefined;
  let keepAlive = 0;
  video.pause();
  video.removeAttribute("src");
  video.currentTime = 0;
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.playbackRate = playbackRate;
  video.load();

  if (source.kind === "hls" && Hls.isSupported()) {
    hls = new Hls({ enableWorker: true });
    hls.loadSource(source.src);
    hls.attachMedia(video);
  } else {
    video.src = source.src;
  }

  const play = () => {
    void video.play().catch(() => undefined);
  };

  const restart = () => {
    video.currentTime = 0;
    play();
  };

  const resume = () => {
    if (video.paused || video.ended) play();
  };

  video.addEventListener("loadedmetadata", play, { once: true });
  video.addEventListener("ended", restart);
  video.addEventListener("pause", resume);
  video.addEventListener("stalled", resume);
  video.addEventListener("suspend", resume);
  keepAlive = window.setInterval(resume, 2400);
  play();

  return () => {
    video.removeEventListener("loadedmetadata", play);
    video.removeEventListener("ended", restart);
    video.removeEventListener("pause", resume);
    video.removeEventListener("stalled", resume);
    video.removeEventListener("suspend", resume);
    window.clearInterval(keepAlive);
    hls?.destroy();
  };
}

function drawFittedText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  stroke = false,
) {
  const measured = Math.max(1, ctx.measureText(text).width);
  const scaleX = Math.min(1, maxWidth / measured);
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scaleX, 1);
  if (stroke) ctx.strokeText(text, 0, 0);
  else ctx.fillText(text, 0, 0);
  ctx.restore();
}

function makeBurst(id: string, x: number, y: number, tint: string): CrystalBurst {
  return {
    id,
    key: `${id}-${Math.round(performance.now())}-${Math.round(x)}-${Math.round(y)}`,
    x,
    y,
    tint,
    start: performance.now(),
    shards: Array.from({ length: 46 }, (_, index) => ({
      angle: (Math.PI * 2 * index) / 46 + seeded(index + id.length * 19) * 0.24,
      distance: 54 + seeded(index + 31) * 178,
      size: 10 + seeded(index + 43) * 34,
      spin: (seeded(index + 59) - 0.5) * Math.PI * 1.8,
      tint: index % 4 === 0 ? "#fff6e5" : index % 3 === 0 ? "#8ed6ce" : tint,
    })),
  };
}

export default function ToniSpatialHero() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const galaxyVideoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hitZonesRef = useRef<HitZone[]>([]);
  const burstsRef = useRef<CrystalBurst[]>([]);
  const cameraRef = useRef<Camera>({ x: 0, y: 0, z: 0, yaw: -0.02, pitch: -0.035 });
  const targetRef = useRef<Camera>({ x: 0, y: 0, z: 0, yaw: -0.02, pitch: -0.035 });
  const velocityRef = useRef(0);
  const dragRef = useRef({ active: false, moved: false, x: 0, y: 0, yaw: 0, pitch: 0 });
  const [activeVideoId, setActiveVideoId] = useState("silk-flow");
  const [activeId, setActiveId] = useState("toni");
  const [visibleBursts, setVisibleBursts] = useState<CrystalBurst[]>([]);
  const router = useRouter();
  const activeVideo = backgroundVideos.find((video) => video.id === activeVideoId) ?? backgroundVideos[0];
  const galaxyVideo = backgroundVideos.find((video) => video.id !== activeVideoId) ?? backgroundVideos[1];

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

    const greenAurora = ctx.createRadialGradient(width * 0.22, height * 0.25, 0, width * 0.22, height * 0.25, width * 0.68);
    greenAurora.addColorStop(0, "rgba(34, 214, 101, 0.14)");
    greenAurora.addColorStop(0.34, "rgba(24, 89, 56, 0.07)");
    greenAurora.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = greenAurora;
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
      const tint = index % 9 === 0 ? "168, 240, 106" : index % 7 === 0 ? "142, 214, 206" : "234, 246, 244";
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
        tint: index % 3 === 0 ? "142, 214, 206" : index % 3 === 1 ? "168, 240, 106" : "234, 246, 244",
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

    const wordText = heroWordLines.map((line) => line.text).join("");
    const baseSize = clamp(gate.height * center.scale * 0.96, 72, 178);
    const active = activeId === gate.id;
    const depthOffset = clamp(baseSize * 0.12, 10, 30);
    const alpha = clamp(1 - center.z / 2000, 0.2, 1);
    const lineY = (offset: number) => center.y + offset * baseSize;
    const emerald = "34, 214, 101";
    const cream = "255, 246, 229";
    const underlineY = lineY(0.54);
    const underlineW = baseSize * 2.2;

    ctx.save();
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    ctx.globalCompositeOperation = "screen";
    ctx.filter = `blur(${clamp(baseSize * 0.075, 9, 22)}px)`;
    ctx.font = `900 ${baseSize * 0.74}px Arial Black, Impact, sans-serif`;
    ctx.fillStyle = `rgba(${emerald}, ${0.22 * alpha})`;
    ctx.fillText(wordText, center.x - depthOffset * 0.22, center.y + depthOffset * 0.08);
    ctx.filter = "none";
    ctx.globalCompositeOperation = "source-over";

    for (let i = 28; i >= 1; i -= 1) {
      const shade = i / 28;
      heroWordLines.forEach((line) => {
        const size = baseSize * line.scale;
        ctx.font = `900 ${size}px Arial Black, Impact, sans-serif`;
        ctx.fillStyle = line.accent
          ? `rgba(7, 33, 19, ${0.08 + shade * 0.13})`
          : `rgba(9, 18, 14, ${0.14 + shade * 0.16})`;
        ctx.fillText(
          line.text,
          center.x + depthOffset * shade * (0.72 + Math.sin(time * 0.00035) * 0.06),
          lineY(line.offset) + depthOffset * shade * 0.34,
        );
      });
    }

    const underline = ctx.createLinearGradient(center.x - underlineW / 2, underlineY, center.x + underlineW / 2, underlineY);
    underline.addColorStop(0, "rgba(34, 214, 101, 0)");
    underline.addColorStop(0.24, `rgba(${emerald}, ${0.34 * alpha})`);
    underline.addColorStop(0.5, `rgba(${emerald}, ${0.78 * alpha})`);
    underline.addColorStop(0.76, `rgba(${emerald}, ${0.34 * alpha})`);
    underline.addColorStop(1, "rgba(34, 214, 101, 0)");
    ctx.save();
    ctx.globalCompositeOperation = "screen";
    ctx.shadowColor = "#22d665";
    ctx.shadowBlur = active ? 24 : 16;
    ctx.strokeStyle = underline;
    ctx.lineWidth = Math.max(2, baseSize * 0.025);
    ctx.beginPath();
    ctx.moveTo(center.x - underlineW / 2, underlineY);
    ctx.lineTo(center.x + underlineW / 2, underlineY);
    ctx.stroke();
    ctx.restore();

    heroWordLines.forEach((line) => {
      const size = baseSize * line.scale;
      ctx.font = `900 ${size}px Arial Black, Impact, sans-serif`;
      ctx.shadowColor = line.accent ? "#22d665" : "rgba(255, 246, 229, 0.22)";
      ctx.shadowBlur = line.accent ? (active ? 34 : 24) : 6;
      ctx.fillStyle = line.accent
        ? "#22d665"
        : `rgba(${cream}, ${0.5 * alpha})`;
      ctx.fillText(line.text, center.x, lineY(line.offset));
      ctx.shadowBlur = 0;
      ctx.lineWidth = Math.max(1, 2.2 * center.scale);
      ctx.strokeStyle = line.accent ? "rgba(168, 240, 106, 0.42)" : `rgba(${cream}, 0.07)`;
      ctx.strokeText(line.text, center.x, lineY(line.offset));
    });
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
    const rotation = gate.rotY + Math.sin(phase) * 0.055;
    const tilt = Math.sin(phase * 0.72) * 0.035;

    const toWorld = (point: Vec3) => {
      const lifted = rotateX(point, tilt);
      const rotated = rotateY(lifted, rotation);
      return {
        x: rotated.x + center.x,
        y: rotated.y + center.y,
        z: rotated.z + center.z,
      };
    };

    const corners = [
      { x: -halfW, y: -halfH, z: -halfD },
      { x: halfW, y: -halfH, z: -halfD },
      { x: halfW, y: halfH, z: -halfD },
      { x: -halfW, y: halfH, z: -halfD },
      { x: -halfW, y: -halfH, z: halfD },
      { x: halfW, y: -halfH, z: halfD },
      { x: halfW, y: halfH, z: halfD },
      { x: -halfW, y: halfH, z: halfD },
    ].map(toWorld);
    const centerPlane = [
      { x: -halfW, y: -halfH, z: 0 },
      { x: halfW, y: -halfH, z: 0 },
      { x: halfW, y: halfH, z: 0 },
      { x: -halfW, y: halfH, z: 0 },
    ].map((point) => project(toWorld(point), width, height));
    const projected = corners.map((corner) => project(corner, width, height));
    const frontCenter = project(center, width, height);
    if (!frontCenter.visible) return;

    const active = activeId === gate.id;
    const depthAlpha = clamp(1 - frontCenter.z / 2100, 0.18, 1);
    const panelW = gate.width * frontCenter.scale;
    const panelH = gate.height * frontCenter.scale;

    const projectedCenter = project({ x: center.x, y: center.y + halfH + 16, z: center.z + halfD * 0.35 }, width, height);
    if (projectedCenter.visible) {
      ctx.save();
      ctx.globalCompositeOperation = "multiply";
      ctx.fillStyle = "rgba(0, 0, 0, 0.42)";
      ctx.beginPath();
      ctx.ellipse(
        projectedCenter.x,
        projectedCenter.y,
        Math.max(16, panelW * 0.48),
        Math.max(6, panelH * 0.14),
        rotation * 0.26,
        0,
        Math.PI * 2,
      );
      ctx.fill();
      ctx.restore();
    }

    const crystalFill = (
      topLeft: Projected,
      bottomRight: Projected,
      alpha: number,
      bright = 0.14,
    ) => {
      const gradient = ctx.createLinearGradient(topLeft.x, topLeft.y, bottomRight.x, bottomRight.y);
      gradient.addColorStop(0, `rgba(239, 248, 255, ${alpha * 0.62})`);
      gradient.addColorStop(0.22, `rgba(149, 128, 255, ${alpha * bright})`);
      gradient.addColorStop(0.58, mix(gate.tint, alpha * 0.28));
      gradient.addColorStop(1, `rgba(7, 14, 42, ${alpha * 0.46})`);
      return gradient;
    };

    const faces: CubeFace[] = [
      {
        points: [projected[0], projected[1], projected[2], projected[3]],
        fill: crystalFill(projected[0], projected[2], 0.5 * depthAlpha, 0.12),
        stroke: `rgba(190, 206, 255, ${0.2 * depthAlpha})`,
        depth: (projected[0].z + projected[1].z + projected[2].z + projected[3].z) / 4,
      },
      {
        points: [projected[0], projected[1], projected[5], projected[4]],
        fill: crystalFill(projected[0], projected[5], 0.58 * depthAlpha, 0.18),
        stroke: `rgba(226, 239, 255, ${0.36 * depthAlpha})`,
        depth: (projected[0].z + projected[1].z + projected[5].z + projected[4].z) / 4,
      },
      {
        points: [projected[1], projected[2], projected[6], projected[5]],
        fill: crystalFill(projected[1], projected[6], 0.72 * depthAlpha, 0.28),
        stroke: mix(gate.tint, 0.58 * depthAlpha),
        depth: (projected[1].z + projected[2].z + projected[6].z + projected[5].z) / 4,
      },
      {
        points: [projected[2], projected[3], projected[7], projected[6]],
        fill: crystalFill(projected[2], projected[7], 0.5 * depthAlpha, 0.1),
        stroke: `rgba(126, 230, 255, ${0.22 * depthAlpha})`,
        depth: (projected[2].z + projected[3].z + projected[7].z + projected[6].z) / 4,
      },
      {
        points: [projected[3], projected[0], projected[4], projected[7]],
        fill: crystalFill(projected[3], projected[4], 0.6 * depthAlpha, 0.16),
        stroke: `rgba(143, 124, 255, ${0.34 * depthAlpha})`,
        depth: (projected[3].z + projected[0].z + projected[4].z + projected[7].z) / 4,
      },
      {
        points: [projected[4], projected[5], projected[6], projected[7]],
        fill: crystalFill(projected[4], projected[6], (gate.kind === "cube" ? 0.86 : 0.72) * depthAlpha, 0.36),
        stroke: active ? `rgba(239, 248, 255, ${0.72 * depthAlpha})` : `rgba(190, 206, 255, ${0.48 * depthAlpha})`,
        depth: (projected[4].z + projected[5].z + projected[6].z + projected[7].z) / 4,
      },
    ];

    faces
      .sort((a, b) => b.depth - a.depth)
      .forEach((face) => {
        drawPolygon(ctx, face.points, face.fill, face.stroke);
      });

    drawCrystalRim(ctx, projected, gate.tint, depthAlpha, active);

    if (centerPlane.every((point) => point.visible)) {
      const planeTopLeft = centerPlane[0];
      const planeTopRight = centerPlane[1];
      const planeBottomLeft = centerPlane[3];

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(centerPlane[0].x, centerPlane[0].y);
      ctx.lineTo(centerPlane[1].x, centerPlane[1].y);
      ctx.lineTo(centerPlane[2].x, centerPlane[2].y);
      ctx.lineTo(centerPlane[3].x, centerPlane[3].y);
      ctx.closePath();
      ctx.clip();

      ctx.transform(
        (planeTopRight.x - planeTopLeft.x) / gate.width,
        (planeTopRight.y - planeTopLeft.y) / gate.width,
        (planeBottomLeft.x - planeTopLeft.x) / gate.height,
        (planeBottomLeft.y - planeTopLeft.y) / gate.height,
        planeTopLeft.x,
        planeTopLeft.y,
      );

      const chamber = ctx.createRadialGradient(
        gate.width * 0.5,
        gate.height * 0.48,
        0,
        gate.width * 0.5,
        gate.height * 0.48,
        Math.max(gate.width, gate.height) * 0.7,
      );
      chamber.addColorStop(0, `rgba(239, 248, 255, ${active ? 0.17 : 0.11})`);
      chamber.addColorStop(0.26, mix(gate.tint, active ? 0.22 : 0.14));
      chamber.addColorStop(0.62, "rgba(45, 34, 100, 0.1)");
      chamber.addColorStop(1, "rgba(0, 0, 0, 0.28)");
      ctx.fillStyle = chamber;
      ctx.fillRect(0, 0, gate.width, gate.height);

      const bevel = ctx.createLinearGradient(0, 0, gate.width, gate.height);
      bevel.addColorStop(0, "rgba(248, 255, 255, 0.22)");
      bevel.addColorStop(0.18, "rgba(143, 124, 255, 0.06)");
      bevel.addColorStop(0.52, "rgba(0, 0, 0, 0)");
      bevel.addColorStop(0.78, "rgba(126, 230, 255, 0.08)");
      bevel.addColorStop(1, "rgba(239, 248, 255, 0.18)");
      ctx.fillStyle = bevel;
      ctx.fillRect(0, 0, gate.width, gate.height);

      ctx.globalCompositeOperation = "screen";
      ctx.shadowBlur = 0;
      for (let point = 0; point < 22; point += 1) {
        const seed = point + gate.z * 0.1;
        const x = gate.width * (0.09 + seeded(seed + 3) * 0.82);
        const y = gate.height * (0.13 + seeded(seed + 7) * 0.74);
        const pulse = 0.55 + Math.sin(time * 0.0022 + seed) * 0.45;
        ctx.fillStyle = point % 3 === 0
          ? `rgba(239, 248, 255, ${(active ? 0.18 : 0.1) * pulse})`
          : mix(gate.tint, (active ? 0.14 : 0.07) * pulse);
        ctx.fillRect(x, y, 1 + seeded(seed + 11) * 1.5, 1 + seeded(seed + 13) * 1.4);
      }

      ctx.lineWidth = Math.max(1, gate.height * 0.006);
      ctx.shadowColor = "#8f7cff";
      ctx.shadowBlur = active ? 18 : 10;
      ctx.strokeStyle = `rgba(239, 248, 255, ${active ? 0.24 : 0.14})`;
      ctx.beginPath();
      ctx.moveTo(gate.width * 0.18, gate.height * 0.18);
      ctx.lineTo(gate.width * 0.58, gate.height * 0.36);
      ctx.lineTo(gate.width * 0.82, gate.height * 0.2);
      ctx.stroke();
      ctx.strokeStyle = `rgba(143, 124, 255, ${active ? 0.26 : 0.16})`;
      ctx.beginPath();
      ctx.moveTo(gate.width * 0.16, gate.height * 0.78);
      ctx.lineTo(gate.width * 0.44, gate.height * 0.56);
      ctx.lineTo(gate.width * 0.74, gate.height * 0.68);
      ctx.stroke();
      ctx.shadowBlur = 0;

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.globalCompositeOperation = "source-over";
      ctx.shadowColor = "rgba(0, 0, 0, 0.88)";
      ctx.shadowBlur = 10;
      const labelFont = '"DIN Condensed", Bahnschrift, "Arial Narrow", Arial, sans-serif';
      const titleFont = '"Microsoft YaHei UI", "Microsoft YaHei", "PingFang SC", "Noto Sans CJK SC", "Source Han Sans SC", sans-serif';
      const titleSize = clamp(Math.min(gate.width / (gate.title.length * 0.78), gate.height * 0.34), 42, 68);
      const englishSize = clamp(gate.height * 0.105, 15, 24);
      const labelSize = clamp(gate.height * 0.07, 11, 16);

      ctx.fillStyle = "rgba(255, 246, 229, 0.72)";
      ctx.font = `800 ${labelSize}px ${labelFont}`;
      drawFittedText(ctx, gate.eyebrow.toUpperCase(), gate.width / 2, gate.height * 0.26, gate.width * 0.72);

      ctx.font = `900 ${titleSize}px ${titleFont}`;
      ctx.lineWidth = Math.max(1, titleSize * 0.055);
      ctx.strokeStyle = "rgba(0, 0, 0, 0.76)";
      drawFittedText(ctx, gate.title, gate.width / 2, gate.height * 0.52, gate.width * 0.82, true);
      ctx.shadowColor = gate.tint;
      ctx.shadowBlur = active ? 17 : 9;
      const titleGradient = ctx.createLinearGradient(gate.width * 0.16, gate.height * 0.39, gate.width * 0.84, gate.height * 0.61);
      titleGradient.addColorStop(0, "#fff6e5");
      titleGradient.addColorStop(0.34, gate.tint);
      titleGradient.addColorStop(0.68, "#e8f7dc");
      titleGradient.addColorStop(1, gate.tint);
      ctx.fillStyle = titleGradient;
      drawFittedText(ctx, gate.title, gate.width / 2, gate.height * 0.52, gate.width * 0.82);
      ctx.shadowBlur = active ? 12 : 7;
      ctx.font = `900 ${englishSize}px ${labelFont}`;
      ctx.fillStyle = `rgba(255, 246, 229, ${active ? 0.86 : 0.68})`;
      drawFittedText(ctx, gate.english, gate.width / 2, gate.height * 0.72, gate.width * 0.68);
      ctx.restore();
    }

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
      ctx.fillStyle = `rgba(34, 214, 101, ${fragment.alpha})`;
      ctx.fillText(fragment.char, point.x, point.y);
    });
    ctx.restore();
  }, [project]);

  const drawScene = useCallback((
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number,
  ) => {
    const background = ctx.createRadialGradient(width * 0.48, height * 0.42, 0, width * 0.48, height * 0.42, Math.max(width, height) * 0.84);
    background.addColorStop(0, "rgba(7, 8, 8, 0.08)");
    background.addColorStop(0.42, "rgba(1, 3, 4, 0.18)");
    background.addColorStop(1, "rgba(0, 0, 0, 0.5)");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);

    drawAtmosphere(ctx, width, height, time);
    drawStars(ctx, width, height, time);
    drawTunnel(ctx, width, height, time);
    drawGlassSheets(ctx, width, height, time);

    hitZonesRef.current = [];
    const sortedGates = [...gates].sort((a, b) => resolveGateCenter(b, time).localZ - resolveGateCenter(a, time).localZ);
    sortedGates
      .filter((gate) => gate.kind === "word")
      .forEach((gate) => drawWordGate(ctx, gate, width, height, time));
    sortedGates
      .filter((gate) => gate.kind !== "word")
      .forEach((gate) => drawPanelGate(ctx, gate, width, height, time));

    drawForegroundFragments(ctx, width, height, time);
    burstsRef.current = burstsRef.current.filter((burst) => time - burst.start < 720);
    burstsRef.current.forEach((burst) => drawCrystalBurst(ctx, burst, time));
  }, [drawAtmosphere, drawForegroundFragments, drawGlassSheets, drawPanelGate, drawStars, drawTunnel, drawWordGate, resolveGateCenter]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;
    return attachLoopingVideo(video, activeVideo, 0.86);
  }, [activeVideo]);

  useEffect(() => {
    const video = galaxyVideoRef.current;
    if (!video) return undefined;
    return attachLoopingVideo(video, galaxyVideo, 0.72);
  }, [galaxyVideo]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;
    const ctx = canvas.getContext("2d");
    if (!ctx) return undefined;

    let animation = 0;
    let width = 0;
    let height = 0;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
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
  }, [drawScene]);

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

  const hitTestGate = (x: number, y: number) =>
    [...hitZonesRef.current]
      .filter((zone) => x >= zone.x && x <= zone.x + zone.w && y >= zone.y && y <= zone.y + zone.h)
      .sort((a, b) => {
        const areaA = a.w * a.h;
        const areaB = b.w * b.h;
        if (Math.abs(areaA - areaB) > 1) return areaA - areaB;
        return a.depth - b.depth;
      })[0];

  const triggerBurst = (hit: HitZone, x: number, y: number) => {
    const gate = gates.find((item) => item.id === hit.id);
    const burst = makeBurst(hit.id, x, y, gate?.tint ?? "#a8f06a");
    setActiveId(hit.id);
    burstsRef.current.push(burst);
    setVisibleBursts((current) => [...current.slice(-3), burst]);
    window.setTimeout(() => {
      setVisibleBursts((current) => current.filter((item) => item.key !== burst.key));
    }, 860);
    velocityRef.current += 8;
  };

  const handleWheel = (event: ReactWheelEvent<HTMLDivElement>) => {
    event.preventDefault();
    velocityRef.current += event.deltaY * 0.12;
  };

  const handleMouseDown = (event: ReactMouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const hit = hitTestGate(x, y);
    if (hit && hit.id !== "toni") triggerBurst(hit, x, y);
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
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const hovered = [...hitZonesRef.current]
      .filter((zone) => x >= zone.x && x <= zone.x + zone.w && y >= zone.y && y <= zone.y + zone.h)
      .sort((a, b) => a.depth - b.depth)[0];
    if (hovered && hovered.id !== activeId) setActiveId(hovered.id);

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
    handleMouseUp();
  };

  const handleClick = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (dragRef.current.moved) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const hit = hitTestGate(x, y);
    if (hit) {
      if (hit.id === "toni") triggerBurst(hit, x, y);
      window.setTimeout(() => router.push(hit.href), 360);
    }
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
      <video ref={galaxyVideoRef} className={styles.galaxyVideo} muted loop playsInline aria-hidden="true" />
      <div className={styles.earthHalo} aria-hidden="true" />
      <div className={styles.cosmicMist} aria-hidden="true" />
      <div className={styles.signalGrid} aria-hidden="true" />
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.burstLayer} aria-hidden="true">
        {visibleBursts.map((burst) => (
          <div
            key={burst.key}
            className={styles.crystalBurst}
            style={{ "--burst-x": `${burst.x}px`, "--burst-y": `${burst.y}px`, "--burst-tint": burst.tint } as BurstStyle}
          >
            <span className={styles.burstFlash} />
            {burst.shards.slice(0, 24).map((shard, index) => (
              <span
                key={`${burst.key}-${index}`}
                className={styles.burstShard}
                style={{
                  "--shard-angle": `${shard.angle}rad`,
                  "--shard-distance": `${shard.distance}px`,
                  "--shard-size": `${shard.size}px`,
                  "--shard-spin": `${shard.spin}rad`,
                  "--shard-tint": shard.tint,
                } as BurstStyle}
              />
            ))}
          </div>
        ))}
      </div>
      <nav className={styles.nav} aria-label="Primary">
        <div className={styles.topLeftActions}>
          <Link href="/" className={styles.brand}>
            Toni
          </Link>
          <Link href={lusieAiUrl} className={styles.lusieTopButton}>
            航模项目
            <ArrowUpRight size={14} />
          </Link>
        </div>
        <div className={styles.links}>
          <Link href="/work">作品</Link>
          <Link href="/tools">工具</Link>
          <Link href="/aila">FDE</Link>
          <Link href="/contact">关于 / 联系</Link>
        </div>
      </nav>

      <div
        className={styles.entryDock}
        aria-label="入口导航"
        onMouseDown={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
      >
        <div className={styles.entryButtons}>
          <button type="button" className={styles.entryTrigger} aria-haspopup="true" aria-label="显示入口卡片">
            <Rocket size={16} />
            入口
          </button>
        </div>
        <div className={styles.entryPanel} aria-label="四个入口">
          {proofStats.map((stat, index) => {
            const gate = gates[index];

            return (
              <Link
                key={stat.label}
                href={gate.href}
                className={activeId === gate.id ? styles.entryActive : ""}
                onMouseEnter={() => focusGate(gate)}
                onFocus={() => focusGate(gate)}
              >
                <strong>{stat.value}</strong>
                <span>{stat.shortLabel}</span>
              </Link>
            );
          })}
        </div>
      </div>
      <Link
        href="/pet/taiga"
        className={styles.taigaSignal}
        aria-label="Find Taiga"
        onMouseDown={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
      >
        <span className={styles.taigaOrbit} aria-hidden="true" />
        <span className={styles.taigaSprite} aria-hidden="true" />
        <span className={styles.taigaWhisper}>TAIGA</span>
      </Link>
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
