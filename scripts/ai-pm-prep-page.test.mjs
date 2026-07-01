import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const pageSource = readFileSync(new URL("../app/ai-pm-prep/page.tsx", import.meta.url), "utf8");
const styleSource = readFileSync(new URL("../app/ai-pm-prep/prep.module.css", import.meta.url), "utf8");
const combined = `${pageSource}\n${styleSource}`;

test("T0 prep page keeps the public learning surface and CC Switch setup path", () => {
  assert.match(pageSource, /title:\s*"T0 课预习包 \| Agent Coding 项目陪跑"/);
  assert.match(pageSource, /<h1>T0 课预习包<\/h1>/);
  assert.match(pageSource, /Claude Code 和 Codex 的 API 配置/);
  assert.match(pageSource, /推荐路径：用 CC Switch 统一管理 provider/);
  assert.match(pageSource, /config\.toml/);
  assert.match(pageSource, /ANTHROPIC_BASE_URL/);
});

test("T0 prep page keeps required install and reference links", () => {
  const requiredLinks = [
    "https://github.com/farion1231/cc-switch/releases/download/v3.16.4/CC-Switch-v3.16.4-Windows.msi",
    "https://github.com/farion1231/cc-switch/releases/download/v3.16.4/CC-Switch-v3.16.4-Windows-Portable.zip",
    "https://github.com/farion1231/cc-switch/releases/download/v3.16.4/CC-Switch-v3.16.4-macOS.dmg",
    "https://github.com/farion1231/cc-switch/releases/download/v3.16.4/CC-Switch-v3.16.4-macOS.zip",
    "https://developers.openai.com/codex/config-reference",
    "https://code.claude.com/docs/en/llm-gateway",
    "https://docs.aihubmix.com/en/api/Codex-CLI",
    "https://www.newapi.ai/en/docs/apps/cc-switch",
    "https://docs.siliconflow.cn/en/usercases/use-siliconcloud-in-ccswitch"
  ];

  for (const link of requiredLinks) {
    assert.ok(pageSource.includes(link), `missing required T0 prep link: ${link}`);
  }
});

test("T0 prep page preserves language constraints", () => {
  const bannedTerms = [
    "CC Suite",
    "Cursor",
    "AI 产品经理",
    "AI PM",
    "产品经理",
    "不是",
    "而是"
  ];

  for (const term of bannedTerms) {
    assert.equal(combined.includes(term), false, `banned T0 prep wording returned: ${term}`);
  }
});
