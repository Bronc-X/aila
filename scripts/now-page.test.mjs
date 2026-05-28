import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

const repoRoot = fileURLToPath(new URL("..", import.meta.url));
const profile = JSON.parse(readFileSync(new URL("../data/toni-now.json", import.meta.url), "utf8"));

const ownProjectNames = ["Lotus", "AntiAnxiety", "Cosic", "ViolinMaster", "招标智能体", "小红书自动化工具"];
const companionNames = [
  "MoviePainter",
  "PathPilot",
  "JobPath",
  "Sparkooo",
  "GROUD",
  "AlphaPai RPA Agent",
  "量化策略分析",
  "全国门店管理系统"
];

function assertPublicAssetExists(src) {
  if (!src || src.startsWith("http")) return;
  const relativePath = src.startsWith("/") ? src.slice(1) : src;
  assert.ok(existsSync(path.join(repoRoot, "public", relativePath)), `missing public asset: ${src}`);
}

test("toni now profile separates own projects from companion cases", () => {
  assert.equal(profile.name, "Toni");
  assert.equal(profile.headline, "企业专家模型搭建与 AI 项目落地");
  assert.ok(profile.intro.some((line) => line.includes("Lotus、AntiAnxiety、Cosic、ViolinMaster、招标智能体、小红书自动化工具")));
  assert.ok(profile.intro.some((line) => line.includes("深耕大湾区 B 端 AI 转型 2 年")));
  assert.ok(profile.intro.some((line) => line.includes("拆需求、接数据、做系统、跑测试、部署上线")));
  assert.equal(JSON.stringify(profile).includes("个人聚合页资产化"), false);
  assert.equal(JSON.stringify(profile).includes("public/now"), false);

  assert.deepEqual(
    profile.projects.map((project) => project.name),
    ownProjectNames
  );
  assert.deepEqual(
    profile.companionCases.map((item) => item.title),
    companionNames
  );

  for (const project of profile.projects) {
    assert.equal(typeof project.imageLabel, "string");
    assert.ok(project.image, `${project.name} should have a durable media asset`);
    assertPublicAssetExists(project.image);
    for (const image of project.images ?? []) {
      assertPublicAssetExists(image);
    }
  }

  for (const item of profile.companionCases) {
    assert.ok(item.label, `${item.title} should have a case label`);
    assert.ok(item.image, `${item.title} should have a case image`);
    assertPublicAssetExists(item.image);
    for (const image of item.images ?? []) {
      assertPublicAssetExists(image);
    }
  }

  assert.equal(profile.projects.find((project) => project.name === "Cosic")?.images?.length, 2);
  assert.equal(profile.projects.find((project) => project.name === "AntiAnxiety")?.images?.length, 4);
  assert.equal(profile.projects.some((project) => project.image === "/now/antianxiety-site.png"), false);
  assert.equal(profile.companionCases.find((item) => item.title === "PathPilot")?.images?.length, 3);
  assert.equal(profile.companionCases.find((item) => item.title === "MoviePainter")?.images?.length, 2);
  assert.equal(profile.credentials?.[0]?.issuer, "NVIDIA");
  assertPublicAssetExists(profile.credentials?.[0]?.image);

  assert.equal(
    profile.projects.find((project) => project.name === "招标智能体")?.href,
    "https://github.com/raoyiyi4-blip/bid_data_management"
  );
  assert.equal(
    profile.projects.find((project) => project.name === "小红书自动化工具")?.href,
    "https://github.com/xiahui001/auto-red-book"
  );
  assert.ok(profile.links.some((link) => link.label === "WeChat"));
});
