import type { ModelSubtype } from "../types";

const previewBasePath = "/lusie/concept-previews";
const airlinerPreviewUrl = `${previewBasePath}/airliner-787-space-preview.png`;
const dronePreviewUrl = `${previewBasePath}/advanced-uav-preview.png`;
const biplanePreviewUrl = `${previewBasePath}/biplane-preview.png`;
const sailShipPreviewUrl = `${previewBasePath}/classic-tall-ship-preview.png`;
const sportsPreviewUrl = `${previewBasePath}/future-sports-preview.png`;
const destroyerPreviewUrl = `${previewBasePath}/guided-destroyer-preview.png`;
const fighterPreviewUrl = `${previewBasePath}/modern-fighter-preview.png`;
const offroadPreviewUrl = `${previewBasePath}/offroad-truck-preview.png`;
const vesselPreviewUrl = `${previewBasePath}/patrol-vessel-preview.png`;
const racePreviewUrl = `${previewBasePath}/rally-car-preview.png`;

export interface ConceptPreviewAsset {
  imageUrl: string;
  title: string;
  description: string;
}

export const conceptPreviewAssets: Record<ModelSubtype, ConceptPreviewAsset> = {
  "race-car": {
    imageUrl: racePreviewUrl,
    title: "赛道赛车方向",
    description: "低趴车身、宽轮拱和赛道套件，适合先验证整体姿态。"
  },
  "off-road": {
    imageUrl: offroadPreviewUrl,
    title: "越野车方向",
    description: "高底盘、大胎纹和粗壮防护结构，便于做坚固模型。"
  },
  "future-sports": {
    imageUrl: sportsPreviewUrl,
    title: "概念跑车方向",
    description: "近未来跑车外形，但保留真实车身姿态和可打印厚度。"
  },
  jet: {
    imageUrl: fighterPreviewUrl,
    title: "现代战机方向",
    description: "参考真实战机比例，强化机鼻、主翼和尾翼识别度。"
  },
  airliner: {
    imageUrl: airlinerPreviewUrl,
    title: "客机方向",
    description: "宽体机身、清晰舷窗和翼下发动机，适合做干净的展示模型。"
  },
  biplane: {
    imageUrl: biplanePreviewUrl,
    title: "古典双翼机方向",
    description: "双层机翼、螺旋桨和早期航空结构，适合静态展示。"
  },
  "space-fighter": {
    imageUrl: dronePreviewUrl,
    title: "长航时无人机方向",
    description: "固定翼无人机外形，重点保留长翼展和传感器机鼻。"
  },
  warship: {
    imageUrl: destroyerPreviewUrl,
    title: "现代军舰方向",
    description: "驱逐舰/护卫舰式舰体和雷达上层建筑，细节不过度碎片化。"
  },
  sailboat: {
    imageUrl: vesselPreviewUrl,
    title: "巡逻舰艇方向",
    description: "近海巡逻舰艇轮廓，桥楼、甲板和舷侧线条清晰。"
  },
  "vintage-ship": {
    imageUrl: sailShipPreviewUrl,
    title: "古典帆船方向",
    description: "木质船体、多桅帆面和简化索具，适合收藏式静态船模。"
  }
};
